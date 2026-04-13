import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('topping_items')
export class ToppingItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  category: string;

  @Column('decimal', { precision: 6, scale: 2 })
  price: number;

  @Column({ nullable: true })
  image: string | null;

  @Column({ default: true })
  available: boolean;
}