import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ItemIngredient } from '../item-ingredients/item-ingredient.entity';

@Entity('inventory')
export class Inventory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('int')
  quantity: number;

  @Column({ nullable: true })
  supplier: string;

  @Column('int')
  maxStock: number;

  @Column('decimal', { precision: 6, scale: 2 })
  quantityPerServing: number;

  @Column({ default: 'In Stock' })
  status: string;

  @OneToMany(() => ItemIngredient, (ii) => ii.inventory)
  itemIngredients: ItemIngredient[];
}

