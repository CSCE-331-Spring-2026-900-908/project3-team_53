import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ToppingItem } from './topping-item.entity';

@Injectable()
export class ToppingItemsService {
  constructor(
    @InjectRepository(ToppingItem)
    private readonly toppingRepo: Repository<ToppingItem>,
  ) {}

  async findAll(category?: string): Promise<ToppingItem[]> {
    const where: Record<string, unknown> = { available: true };

    if (category) {
      where.category = category;
    }

    return this.toppingRepo.find({
      where,
      order: { category: 'ASC', name: 'ASC' },
    });
  }
}