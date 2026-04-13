import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ItemIngredient } from '../item-ingredients/item-ingredient.entity';

@Entity('menu_items')
export class MenuItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  category: string;

  @Column('decimal', { precision: 6, scale: 2 })
  price: number;

  @Column({ nullable: true })
  image: string | null;

  @Column({ default: true })
  available: boolean;

  @OneToMany(() => ItemIngredient, (ii) => ii.menuItem)
  itemIngredients: ItemIngredient[];
}
