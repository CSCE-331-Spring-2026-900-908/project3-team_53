import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemIngredient } from './item-ingredient.entity';
import { ItemIngredientsService } from './item-ingredients.service';
import { ItemIngredientsController } from './item-ingredients.controller';
import { MenuItem } from '../menu-items/menu-item.entity';
import { Inventory } from '../inventory/inventory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ItemIngredient, MenuItem, Inventory])],
  controllers: [ItemIngredientsController],
  providers: [ItemIngredientsService],
  exports: [ItemIngredientsService],
})
export class ItemIngredientsModule {}

