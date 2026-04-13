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

  @Column({ type: 'varchar', nullable: true })
  image: string | null;

  @Column('int', { default: 50 })
  imageFocusX: number;

  @Column('int', { default: 50 })
  imageFocusY: number;

  @Column({ default: true })
  available: boolean;

  @OneToMany(() => ItemIngredient, (ii) => ii.menuItem)
  itemIngredients: ItemIngredient[];
}
