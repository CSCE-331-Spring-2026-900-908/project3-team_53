import { Controller, Get, Query } from '@nestjs/common';
import { MenuItemsService } from './menu-items.service';
import { MenuItem } from './menu-item.entity';

@Controller('api/menu-items')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Get()
  findAll(@Query('category') category?: string): Promise<MenuItem[]> {
    return this.menuItemsService.findAll(category);
  }
}
