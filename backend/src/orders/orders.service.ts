import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, MoreThanOrEqual, QueryFailedError } from 'typeorm';
import { Order, OrderItem } from './orders.entity';
import { MenuItem } from '../menu-items/menu-item.entity';
import { CreateOrderDto } from './create-order.dto';
import { Between } from 'typeorm';

@Injectable()
export class OrdersService {
  private hasRetriedSequenceRepair = false;

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

      // If a PK sequence is behind existing rows, repair once and retry.
      if (this.shouldRepairPkSequence(err) && !this.hasRetriedSequenceRepair) {
        this.hasRetriedSequenceRepair = true;
        await this.repairOrderSequences();
        try {
          return await this.create(dto);
        } finally {
          this.hasRetriedSequenceRepair = false;
        }
      }
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

  private shouldRepairPkSequence(err: unknown): boolean {
    if (!(err instanceof QueryFailedError)) return false;
    const driverError = (err as any).driverError as
      | { code?: string; constraint?: string; table?: string }
      | undefined;
    const table = driverError?.table;
    return (
      driverError?.code === '23505' &&
      (table === 'orders' || table === 'order_items') &&
      driverError?.constraint?.startsWith('PK_') === true
    );
  }

  private async repairOrderSequences(): Promise<void> {
    await this.dataSource.query(`
      SELECT setval(
        pg_get_serial_sequence('"orders"', 'id'),
        COALESCE((SELECT MAX(id) FROM "orders"), 0) + 1,
        false
      );
    `);
    await this.dataSource.query(`
      SELECT setval(
        pg_get_serial_sequence('"order_items"', 'id'),
        COALESCE((SELECT MAX(id) FROM "order_items"), 0) + 1,
        false
      );
    `);
  }

  async findByDate(date: string): Promise<Order[]> {
    const start = new Date(`${date}T00:00:00`);
    const end = new Date(`${date}T23:59:59.999`);

    return this.orderRepo.find({
      where: {
        created_at: Between(start, end),
      },
      relations: ['items', 'items.menuItem'],
      order: { created_at: 'ASC' },
    });
  }


  async calendarSummary() {
    const raw = await this.orderRepo
      .createQueryBuilder('order')
      .select("DATE(order.created_at)", "date")
      .addSelect("COUNT(*)", "count")
      .groupBy("DATE(order.created_at)")
      .orderBy("DATE(order.created_at)", "DESC")
      .getRawMany();

    return raw.map(row => ({
      date: row.date,
      count: Number(row.count),
    }));
  }

}
