import { Controller, Post, Get, Patch, Param, Body, ParseIntPipe } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './create-order.dto';
import { Order } from './orders.entity';

@Controller('orders')
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

  @Get('pending')
  findPending(): Promise<Order[]> {
    return this.ordersService.findPending();
  }

  @Get('today-stats')
  todayStats() {
    return this.ordersService.todayStats();
  }

  @Patch(':id/complete')
  complete(@Param('id', ParseIntPipe) id: number): Promise<Order> {
    return this.ordersService.complete(id);
  }
}
