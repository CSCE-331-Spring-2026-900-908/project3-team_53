import { Controller, Get } from '@nestjs/common';
import { ItemIngredientsService } from './item-ingredients.service';

@Controller('item-ingredients')
export class ItemIngredientsController {
  constructor(private readonly itemIngredientsService: ItemIngredientsService) {}

  @Get()
  findAll() {
    return this.itemIngredientsService.findAll();
  }
}
