import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './orders.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private orderRepository: Repository<Order>,
    ) {}

    async createOrder(order: Order): Promise<Order> {
        return this.orderRepository.save(order);
    }

    async getOrders(): Promise<Order[]> {
        return this.orderRepository.find();
    }
}
