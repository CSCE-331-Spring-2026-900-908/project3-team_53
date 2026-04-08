import { Controller, Get, Query } from '@nestjs/common';
import { ToppingItemsService } from './topping-items.service';
import { ToppingItem } from './topping-item.entity';

@Controller('topping-items')
export class ToppingItemsController {
  constructor(private readonly toppingService: ToppingItemsService) {}

  @Get()
  findAll(@Query('category') category?: string): Promise<ToppingItem[]> {
    return this.toppingService.findAll(category);
  }
}