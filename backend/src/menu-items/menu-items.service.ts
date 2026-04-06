import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from './menu-item.entity';

const SEED_ITEMS: Partial<MenuItem>[] = [
  { name: 'Classic Milk Tea', category: 'Milk Tea', price: 5.50, available: true },
  { name: 'Taro Milk Tea', category: 'Milk Tea', price: 6.00, available: true },
  { name: 'Brown Sugar Milk Tea', category: 'Milk Tea', price: 6.50, available: true },
  { name: 'Jasmine Milk Tea', category: 'Milk Tea', price: 5.75, available: true },
  { name: 'Chocolate Milk Tea', category: 'Milk Tea', price: 5.50, available: true },
  { name: 'Red Bean Milk Tea', category: 'Milk Tea', price: 5.50, available: true },
  { name: 'Mango Green Tea', category: 'Fruit Tea', price: 5.50, available: true },
  { name: 'Passion Fruit Tea', category: 'Fruit Tea', price: 5.50, available: true },
  { name: 'Lychee Tea', category: 'Fruit Tea', price: 5.75, available: true },
  { name: 'Peach Oolong Tea', category: 'Fruit Tea', price: 5.75, available: true },
  { name: 'Wintermelon Tea', category: 'Fruit Tea', price: 5.75, available: true },
  { name: 'Mango Smoothie', category: 'Smoothies', price: 6.50, available: true },
  { name: 'Strawberry Smoothie', category: 'Smoothies', price: 6.50, available: true },
  { name: 'Matcha Smoothie', category: 'Smoothies', price: 7.00, available: true },
  { name: 'Banana & Blueberry Smoothie', category: 'Smoothies', price: 6.50, available: true },
  { name: 'Taro Slush', category: 'Slush', price: 6.75, available: true },
  { name: 'Watermelon Slush', category: 'Slush', price: 6.50, available: true },
  { name: 'Mango Slush', category: 'Slush', price: 6.50, available: true },
  { name: 'Brown Sugar Boba Latte', category: 'Latte', price: 6.50, available: true },
  { name: 'Matcha Latte', category: 'Latte', price: 5.50, available: true },
  { name: 'Vietnamese Latte', category: 'Latte', price: 4.50, available: true },
  { name: 'Popcorn Chicken', category: 'Snacks', price: 4.50, available: true },
  { name: 'Egg Puffs', category: 'Snacks', price: 3.50, available: true },
  { name: 'Mochi Donuts', category: 'Snacks', price: 4.00, available: true },
];

@Injectable()
export class MenuItemsService implements OnModuleInit {
  private readonly logger = new Logger(MenuItemsService.name);

  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepo: Repository<MenuItem>,
  ) {}

  async onModuleInit() {
    for (const item of SEED_ITEMS) {
      const exists = await this.menuItemRepo.findOneBy({ name: item.name });
      if (!exists) {
        await this.menuItemRepo.save(this.menuItemRepo.create(item));
        this.logger.log(`Inserted menu item: ${item.name}`);
      }
    }
  }

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
