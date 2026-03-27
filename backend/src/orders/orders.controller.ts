import { Controller, Get, Post } from '@nestjs/common';
import { Order } from './orders.entity';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) {}
    @Get('')
    async getOrders(): Promise<Order[]> {
        return this.ordersService.getOrders();
    }

    @Post('')
    async createOrder(order: Order): Promise<Order> {
        return this.ordersService.createOrder(order);
    }
}