import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ToppingItem } from './topping-item.entity';

const SEED_TOPPINGS: Partial<ToppingItem>[] = [
  { name: 'Boba', category: 'Pearls', price: 0.75, available: true },
  { name: 'Popping Boba', category: 'Pearls', price: 0.75, available: true },
  { name: 'Grass Jelly', category: 'Jellies', price: 0.50, available: true },
  { name: 'Lychee Jelly', category: 'Jellies', price: 0.50, available: true },
  { name: 'Pudding', category: 'Custard', price: 0.75, available: true },
  { name: 'Cheese Foam', category: 'Foam', price: 1.00, available: true },
];

@Injectable()
export class ToppingItemsService implements OnModuleInit {
  private readonly logger = new Logger(ToppingItemsService.name);

  constructor(
    @InjectRepository(ToppingItem)
    private readonly toppingRepo: Repository<ToppingItem>,
  ) {}

  async onModuleInit() {
    for (const topping of SEED_TOPPINGS) {
      const exists = await this.toppingRepo.findOneBy({ name: topping.name });
      if (!exists) {
        await this.toppingRepo.save(this.toppingRepo.create(topping));
        this.logger.log(`Inserted topping: ${topping.name}`);
      }
    }
  }

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