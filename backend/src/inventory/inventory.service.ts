import { Injectable } from '@nestjs/common';
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
}