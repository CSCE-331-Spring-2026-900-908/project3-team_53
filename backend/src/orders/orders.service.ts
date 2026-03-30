import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order, OrderItem } from './orders.entity';
import { MenuItem } from '../menu-items/menu-item.entity';
import { CreateOrderDto } from './create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    private readonly dataSource: DataSource,
  ) {}

  async create(dto: CreateOrderDto): Promise<Order> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = queryRunner.manager.create(Order, {
        order_type: dto.order_type,
        total: dto.total,
        status: 'pending',
      });
      const savedOrder = await queryRunner.manager.save(order);

      const orderItems = dto.items.map((item) =>
        queryRunner.manager.create(OrderItem, {
          order: savedOrder,
          menuItem: { id: item.menuItemId } as MenuItem,
          quantity: item.quantity,
          size: item.size,
          sugar_level: item.sugar_level,
          ice_level: item.ice_level,
          toppings: item.toppings,
          item_price: item.item_price,
        }),
      );
      await queryRunner.manager.save(orderItems);

      await queryRunner.commitTransaction();

      const result = await this.orderRepo.findOne({
        where: { id: savedOrder.id },
        relations: ['items', 'items.menuItem'],
      });
      return result as Order;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(): Promise<Order[]> {
    return this.orderRepo.find({ relations: ['items', 'items.menuItem'] });
  }
}
