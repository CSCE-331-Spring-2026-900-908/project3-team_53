import { Controller, Post, Get, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './create-order.dto';
import { Order } from './orders.entity';

@Controller('api/orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() dto: CreateOrderDto): Promise<Order> {
    return this.ordersService.create(dto);
  }

  @Get()
  findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }
}
