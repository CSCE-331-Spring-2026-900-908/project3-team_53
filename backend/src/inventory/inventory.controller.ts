import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Inventory } from './inventory.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('inventory')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('manager')
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

  @Patch(':id')
  updateInventory(
    @Param('id') id: string,
    @Body() payload: { id?: number; name?: string; supplier?: string },
  ): Promise<Inventory> {
    return this.inventoryService.updateInventory(Number(id), payload);
  }

  @Delete(':id')
  deleteInventory(@Param('id') id: string): Promise<void> {
    return this.inventoryService.deleteInventory(Number(id));
  }

  @Patch('swap-ids')
  swapInventoryIds(
    @Body()
    payload: {
      sourceId: number;
      targetId: number;
      name?: string;
      supplier?: string;
    },
  ): Promise<Inventory[]> {
    return this.inventoryService.swapInventoryIds(payload.sourceId, payload.targetId, {
      name: payload.name,
      supplier: payload.supplier,
    });
  }
}
