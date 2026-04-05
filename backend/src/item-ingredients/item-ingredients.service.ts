import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemIngredient } from './item-ingredient.entity';
import { SEED_ITEM_INGREDIENTS } from './item-ingredients.seed';

@Injectable()
export class ItemIngredientsService implements OnModuleInit {
  private readonly logger = new Logger(ItemIngredientsService.name);

  constructor(
    @InjectRepository(ItemIngredient)
    private readonly itemIngredientsRepo: Repository<ItemIngredient>,
  ) {}

  async onModuleInit() {
    for (const row of SEED_ITEM_INGREDIENTS) {
      const exists = await this.itemIngredientsRepo.findOne({
        where: {
          menuItem: { id: row.menu_item_id },
          inventory: { id: row.inventory_id },
        },
      });

      if (!exists) {
        await this.itemIngredientsRepo.save(
          this.itemIngredientsRepo.create({
            menuItem: { id: row.menu_item_id },
            inventory: { id: row.inventory_id },
            servingsUsed: row.servingsUsed,
            isTopping: row.isTopping,
          }),
        );

        this.logger.log(
          `Linked menu item ${row.menu_item_id} to ingredient ${row.inventory_id}`,
        );
      }
    }
  }

  findAll() {
    return this.itemIngredientsRepo.find({
      relations: ['menuItem', 'inventory'],
      order: { id: 'ASC' },
    });
  }
}
