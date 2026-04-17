import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './inventory.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
  ) {}

  async findAll(): Promise<Inventory[]> {
    const inventoryItems = await this.inventoryRepo.find({
      order: { id: 'ASC' },
    });

    const updates: Inventory[] = [];
    for (const item of inventoryItems) {
      const isLowStock = item.quantity < item.maxStock * 0.2;
      const desiredStatus = isLowStock ? 'Low Stock' : 'In Stock';
      if (item.status !== desiredStatus) {
        item.status = desiredStatus;
        updates.push(item);
      }
    }

    if (updates.length > 0) {
      await this.inventoryRepo.save(updates);
    }

    return inventoryItems;
  }

  async quickRestockLowStock(): Promise<Inventory[]> {
    const inventoryItems = await this.inventoryRepo.find();
    const lowStockItems = inventoryItems.filter((item) => item.quantity < item.maxStock * 0.2);

    if (lowStockItems.length === 0) {
      return [];
    }

    const updatedItems = lowStockItems.map((item) => ({
      ...item,
      quantity: item.maxStock,
      status: 'In Stock',
    }));

    return this.inventoryRepo.save(updatedItems);
  }

  async updateInventory(
    currentId: number,
    changes: { id?: number; name?: string; supplier?: string },
  ): Promise<Inventory> {
    if (!Number.isInteger(currentId)) {
      throw new BadRequestException('Current inventory ID must be a valid integer.');
    }

    if (changes.id !== undefined && !Number.isInteger(changes.id)) {
      throw new BadRequestException('Updated inventory ID must be a valid integer.');
    }

    const inventoryItem = await this.inventoryRepo.findOneBy({ id: currentId });
    if (!inventoryItem) {
      throw new NotFoundException(`Inventory item with ID ${currentId} not found.`);
    }

    const updatedId = changes.id ?? currentId;
    if (updatedId !== currentId) {
      const existing = await this.inventoryRepo.findOneBy({ id: updatedId });
      if (existing) {
        throw new ConflictException(`Inventory ID ${updatedId} already exists.`);
      }

      await this.inventoryRepo
        .createQueryBuilder()
        .update(Inventory)
        .set({
          id: updatedId,
          name: changes.name ?? inventoryItem.name,
          supplier: changes.supplier ?? inventoryItem.supplier,
        })
        .where('id = :id', { id: currentId })
        .execute();

      const updatedInventory = await this.inventoryRepo.findOneBy({ id: updatedId });
      if (!updatedInventory) {
        throw new NotFoundException(`Failed to update inventory item ID to ${updatedId}.`);
      }
      return updatedInventory;
    }

    inventoryItem.name = changes.name ?? inventoryItem.name;
    inventoryItem.supplier = changes.supplier ?? inventoryItem.supplier;
    return this.inventoryRepo.save(inventoryItem);
  }

  async deleteInventory(currentId: number): Promise<void> {
    if (!Number.isInteger(currentId)) {
      throw new BadRequestException('Inventory ID must be a valid integer.');
    }

    await this.inventoryRepo.delete(currentId);
  }

  async createInventory(
    payload: {
      name: string;
      supplier?: string;
      quantity: number;
      maxStock: number;
    },
  ): Promise<Inventory> {
    const trimmedName = payload.name.trim();

    if (!trimmedName) {
      throw new BadRequestException('Inventory item name cannot be blank.');
    }

    if (!Number.isInteger(payload.quantity) || payload.quantity < 0) {
      throw new BadRequestException('Quantity must be a non-negative integer.');
    }

    if (!Number.isInteger(payload.maxStock) || payload.maxStock <= 0) {
      throw new BadRequestException('Max stock must be a positive integer.');
    }

    const existingItem = await this.inventoryRepo
      .createQueryBuilder('inventory')
      .where('LOWER(inventory.name) = LOWER(:name)', { name: trimmedName })
      .getOne();

    if (existingItem) {
      throw new ConflictException(`Inventory item with name ${trimmedName} already exists.`);
    }

    const status = payload.quantity < payload.maxStock * 0.2 ? 'Low Stock' : 'In Stock';

    await this.inventoryRepo.query(
      `SELECT setval(pg_get_serial_sequence('inventory', 'id'), (SELECT COALESCE(MAX(id), 0) FROM inventory), true)`,
    );

    const newInventory = {
      name: trimmedName,
      supplier: payload.supplier?.trim() ?? undefined,
      quantity: payload.quantity,
      maxStock: payload.maxStock,
      quantityPerServing: 0,
      status,
    };

    return this.inventoryRepo.save(newInventory);
  }

  async swapInventoryIds(
    sourceId: number,
    targetId: number,
    changes: { name?: string; supplier?: string },
  ): Promise<Inventory[]> {
    if (!Number.isInteger(sourceId) || !Number.isInteger(targetId)) {
      throw new BadRequestException('Inventory IDs must be valid integers.');
    }

    const sourceItem = await this.inventoryRepo.findOneBy({ id: sourceId });
    const targetItem = await this.inventoryRepo.findOneBy({ id: targetId });

    if (!sourceItem || !targetItem) {
      throw new NotFoundException('One or both inventory items were not found.');
    }

    const tempId = await this.getTemporaryId();

    await this.inventoryRepo.manager.transaction(async (manager) => {
      await manager
        .createQueryBuilder()
        .update(Inventory)
        .set({ id: tempId })
        .where('id = :id', { id: targetId })
        .execute();

      await manager
        .createQueryBuilder()
        .update(Inventory)
        .set({ id: targetId })
        .where('id = :id', { id: sourceId })
        .execute();

      await manager
        .createQueryBuilder()
        .update(Inventory)
        .set({ id: sourceId })
        .where('id = :id', { id: tempId })
        .execute();

      await manager
        .createQueryBuilder()
        .update(Inventory)
        .set({
          name: changes.name ?? sourceItem.name,
          supplier: changes.supplier ?? sourceItem.supplier,
        })
        .where('id = :id', { id: targetId })
        .execute();
    });

    const updatedSource = await this.inventoryRepo.findOneBy({ id: targetId });
    const updatedTarget = await this.inventoryRepo.findOneBy({ id: sourceId });

    return [updatedSource, updatedTarget].filter(Boolean) as Inventory[];
  }

  private async getTemporaryId(): Promise<number> {
    let tempId = -1;
    let exists = await this.inventoryRepo.findOneBy({ id: tempId });
    while (exists) {
      tempId -= 1;
      exists = await this.inventoryRepo.findOneBy({ id: tempId });
    }
    return tempId;
  }
}