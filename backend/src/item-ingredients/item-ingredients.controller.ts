import { Body, Controller, Get, Param, ParseIntPipe, Put } from '@nestjs/common';
import { ItemIngredientsService } from './item-ingredients.service';
import { UpdateItemIngredientsDto } from './update-item-ingredients.dto';

@Controller('item-ingredients')
export class ItemIngredientsController {
  constructor(private readonly itemIngredientsService: ItemIngredientsService) {}

  @Get()
  findAll() {
    return this.itemIngredientsService.findAll();
  }

  @Get('menu-item/:menuItemId')
  findByMenuItem(@Param('menuItemId', ParseIntPipe) menuItemId: number) {
    return this.itemIngredientsService.findByMenuItem(menuItemId);
  }

  @Put('menu-item/:menuItemId')
  replaceForMenuItem(
    @Param('menuItemId', ParseIntPipe) menuItemId: number,
    @Body() dto: UpdateItemIngredientsDto,
  ) {
    return this.itemIngredientsService.replaceForMenuItem(menuItemId, dto);
  }
}
