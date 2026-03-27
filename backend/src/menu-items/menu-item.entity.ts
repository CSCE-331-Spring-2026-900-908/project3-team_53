import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

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
  image: string;

  @Column({ default: true })
  available: boolean;
}
