import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ItemIngredient } from './item-ingredient.entity';
import { MenuItem } from '../menu-items/menu-item.entity';
import { Inventory } from '../inventory/inventory.entity';
import { UpdateItemIngredientsDto } from './update-item-ingredients.dto';

@Injectable()
export class ItemIngredientsService {
  constructor(
    @InjectRepository(ItemIngredient)
    private readonly itemIngredientsRepo: Repository<ItemIngredient>,
    @InjectRepository(MenuItem)
    private readonly menuItemRepo: Repository<MenuItem>,
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
  ) {}

  findAll() {
    return this.itemIngredientsRepo.find({
      relations: ['menuItem', 'inventory'],
      order: { id: 'ASC' },
    });
  }

  async findByMenuItem(menuItemId: number) {
    return this.itemIngredientsRepo.find({
      where: { menuItem: { id: menuItemId } },
      relations: ['inventory', 'menuItem'],
      order: { id: 'ASC' },
    });
  }

  async replaceForMenuItem(
    menuItemId: number,
    dto: UpdateItemIngredientsDto,
  ): Promise<ItemIngredient[]> {
    const menuItem = await this.menuItemRepo.findOne({
      where: { id: menuItemId },
    });
    if (!menuItem) {
      throw new NotFoundException(`Menu item ${menuItemId} not found`);
    }

    const nextIngredients = Array.isArray(dto.ingredients) ? dto.ingredients : [];
    const inventoryIds = [...new Set(nextIngredients.map((entry) => Number(entry.inventoryId)))];
    const inventoryItems =
      inventoryIds.length > 0
        ? await this.inventoryRepo.findBy({ id: In(inventoryIds) })
        : [];
    const inventoryMap = new Map(
      inventoryItems.map((inventory) => [inventory.id, inventory]),
    );

    for (const entry of nextIngredients) {
      const inventoryId = Number(entry.inventoryId);
      const servingsUsed = Number(entry.servingsUsed);

      if (!inventoryMap.has(inventoryId)) {
        throw new BadRequestException(
          `Inventory item ${inventoryId} does not exist.`,
        );
      }
      if (Number.isNaN(servingsUsed) || servingsUsed <= 0) {
        throw new BadRequestException(
          'Each ingredient must use a positive servingsUsed value.',
        );
      }
    }

    const existing = await this.itemIngredientsRepo.find({
      where: { menuItem: { id: menuItemId } },
      relations: ['menuItem', 'inventory'],
    });
    if (existing.length > 0) {
      await this.itemIngredientsRepo.remove(existing);
    }

    const entities = nextIngredients.map((entry) =>
      this.itemIngredientsRepo.create({
        menuItem,
        inventory: inventoryMap.get(Number(entry.inventoryId)),
        servingsUsed: Number(entry.servingsUsed),
        isTopping: Boolean(entry.isTopping),
      }),
    );

    if (entities.length === 0) {
      return [];
    }

    return this.itemIngredientsRepo.save(entities);
  }
}
