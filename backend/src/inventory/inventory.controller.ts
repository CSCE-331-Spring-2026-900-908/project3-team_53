import { Controller, Get, Patch } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Inventory } from './inventory.entity';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  findAll(): Promise<Inventory[]> {
    return this.inventoryService.findAll();
  }

  @Patch('quick-restock')
  quickRestockLowStock(): Promise<Inventory[]> {
    return this.inventoryService.quickRestockLowStock();
  }
}
