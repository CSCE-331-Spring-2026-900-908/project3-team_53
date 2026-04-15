import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
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
    await this.inventoryRepo.delete(currentId);
  }

  async swapInventoryIds(
    sourceId: number,
    targetId: number,
    changes: { name?: string; supplier?: string },
  ): Promise<Inventory[]> {
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
        .where('id = :id', { id: sourceId })
        .execute();

      await manager
        .createQueryBuilder()
        .update(Inventory)
        .set({ id: sourceId })
        .where('id = :id', { id: targetId })
        .execute();

      await manager
        .createQueryBuilder()
        .update(Inventory)
        .set({ id: targetId })
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
    let tempId = Number.MAX_SAFE_INTEGER;
    let exists = await this.inventoryRepo.findOneBy({ id: tempId });
    while (exists) {
      tempId -= 1;
      exists = await this.inventoryRepo.findOneBy({ id: tempId });
    }
    return tempId;
  }
}