import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from './menu-item.entity';

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepo: Repository<MenuItem>,
  ) {}

  async findAll(category?: string): Promise<MenuItem[]> {
    const where: Record<string, unknown> = { available: true };
    if (category) {
      where.category = category;
    }
    return this.menuItemRepo.find({
      where,
      order: { category: 'ASC', name: 'ASC' },
    });
  }
}
