import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, MoreThanOrEqual } from 'typeorm';
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
        payment_type: dto.payment_type ?? 'credit_card',
        customer_name: dto.customer_name || null,
        customer_phone: dto.customer_phone || null,
        status: 'pending',
      });
      const savedOrder = await queryRunner.manager.save(order);

      if (!savedOrder.customer_name) {
        savedOrder.customer_name = `Customer ${savedOrder.id}`;
        await queryRunner.manager.save(savedOrder);
      }

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

  async findPending(): Promise<Order[]> {
    return this.orderRepo.find({
      where: { status: 'pending' },
      relations: ['items', 'items.menuItem'],
      order: { created_at: 'ASC' },
    });
  }

  async complete(id: number): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id },
      relations: ['items', 'items.menuItem'],
    });
    if (!order) {
      throw new NotFoundException(`Order #${id} not found`);
    }
    order.status = 'completed';
    order.completed_at = new Date();
    return this.orderRepo.save(order);
  }

  async todayStats(): Promise<{
    totalOrders: number;
    completedOrders: number;
    avgWaitSeconds: number;
    longestWaitSeconds: number;
  }> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const orders = await this.orderRepo.find({
      where: { created_at: MoreThanOrEqual(startOfDay) },
    });

    if (orders.length === 0) {
      return { totalOrders: 0, completedOrders: 0, avgWaitSeconds: 0, longestWaitSeconds: 0 };
    }

    const now = Date.now();
    let totalWait = 0;
    let longest = 0;
    let completed = 0;

    for (const order of orders) {
      const created = new Date(order.created_at).getTime();
      const wait =
        order.status === 'completed' && order.completed_at
          ? new Date(order.completed_at).getTime() - created
          : now - created;
      const waitSec = Math.max(0, Math.floor(wait / 1000));
      totalWait += waitSec;
      if (waitSec > longest) longest = waitSec;
      if (order.status === 'completed') completed++;
    }

    return {
      totalOrders: orders.length,
      completedOrders: completed,
      avgWaitSeconds: Math.floor(totalWait / orders.length),
      longestWaitSeconds: longest,
    };
  }
}
