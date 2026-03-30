import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MenuItem } from '../menu-items/menu-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'pending' })
  status: string;

  @Column()
  order_type: string;

  @Column('decimal', { precision: 8, scale: 2 })
  total: number;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];
}

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => MenuItem, { eager: true })
  @JoinColumn({ name: 'menu_item_id' })
  menuItem: MenuItem;

  @Column()
  quantity: number;

  @Column({ default: 'Regular' })
  size: string;

  @Column({ default: '100%' })
  sugar_level: string;

  @Column({ default: 'Regular' })
  ice_level: string;

  @Column('jsonb', { default: [] })
  toppings: string[];

  @Column('decimal', { precision: 6, scale: 2 })
  item_price: number;
}
