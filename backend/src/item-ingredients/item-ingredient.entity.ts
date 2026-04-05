import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { MenuItem } from '../menu-items/menu-item.entity';
import { Inventory } from '../inventory/inventory.entity';

@Entity('item_ingredients')
export class ItemIngredient {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => MenuItem, (menuItem) => menuItem.itemIngredients, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'menu_item_id' })
  menuItem: MenuItem;

  @ManyToOne(() => Inventory, (inventory) => inventory.itemIngredients, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'inventory_id' })
  inventory: Inventory;

  @Column('decimal', { precision: 6, scale: 2 })
  servingsUsed: number;

  @Column({ default: false })
  isTopping: boolean;
}
