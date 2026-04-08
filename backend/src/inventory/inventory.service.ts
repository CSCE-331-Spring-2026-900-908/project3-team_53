import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Inventory } from './inventory.entity';

const SEED_INVENTORY: Partial<Inventory>[] = [
{ name: 'Black Tea Base', quantity: 50000, supplier: 'TeaBase Co.', maxStock: 150000, quantityPerServing: 250, status: 'In Stock' },
{ name: 'Green Tea Base', quantity: 50000, supplier: 'TeaBase Co.', maxStock: 150000, quantityPerServing: 250, status: 'In Stock' },
{ name: 'Oolong Tea Base', quantity: 30000, supplier: 'TeaBase Co.', maxStock: 100000, quantityPerServing: 250, status: 'In Stock' },
{ name: 'Jasmine Tea Base', quantity: 30000, supplier: 'TeaBase Co.', maxStock: 100000, quantityPerServing: 250, status: 'In Stock' },
{ name: 'Milk Powder', quantity: 20000, supplier: 'DairyMix Supply', maxStock: 60000, quantityPerServing: 25, status: 'In Stock' },
{ name: 'Fresh Milk', quantity: 40000, supplier: 'DairyMix Supply', maxStock: 120000, quantityPerServing: 200, status: 'In Stock' },
{ name: 'Condensed Milk', quantity: 10000, supplier: 'DairyMix Supply', maxStock: 30000, quantityPerServing: 40, status: 'In Stock' },
{ name: 'Non Dairy Creamer', quantity: 15000, supplier: 'DairyMix Supply', maxStock: 50000, quantityPerServing: 20, status: 'In Stock' },
{ name: 'Sugar Syrup', quantity: 30000, supplier: 'Sweet Syrup Supply', maxStock: 90000, quantityPerServing: 40, status: 'In Stock' },
{ name: 'Brown Sugar Syrup', quantity: 20000, supplier: 'Sweet Syrup Supply', maxStock: 60000, quantityPerServing: 60, status: 'In Stock' },
{ name: 'Wintermelon Syrup', quantity: 15000, supplier: 'Sweet Syrup Supply', maxStock: 45000, quantityPerServing: 50, status: 'In Stock' },
{ name: 'Passion Fruit Syrup', quantity: 12000, supplier: 'FruitPuree Co.', maxStock: 40000, quantityPerServing: 50, status: 'In Stock' },
{ name: 'Peach Syrup', quantity: 12000, supplier: 'FruitPuree Co.', maxStock: 40000, quantityPerServing: 50, status: 'In Stock' },
{ name: 'Lychee Syrup', quantity: 12000, supplier: 'FruitPuree Co.', maxStock: 40000, quantityPerServing: 50, status: 'In Stock' },
{ name: 'Mango Purée', quantity: 20000, supplier: 'FruitPuree Co.', maxStock: 60000, quantityPerServing: 70, status: 'In Stock' },
{ name: 'Strawberry Purée', quantity: 20000, supplier: 'FruitPuree Co.', maxStock: 60000, quantityPerServing: 70, status: 'In Stock' },
{ name: 'Watermelon Purée', quantity: 15000, supplier: 'FruitPuree Co.', maxStock: 50000, quantityPerServing: 80, status: 'In Stock' },
{ name: 'Banana', quantity: 3000, supplier: 'FreshFruit Wholesale', maxStock: 8000, quantityPerServing: 1, status: 'In Stock' },
{ name: 'Blueberries', quantity: 5000, supplier: 'FreshFruit Wholesale', maxStock: 15000, quantityPerServing: 40, status: 'In Stock' },
{ name: 'Taro Powder', quantity: 15000, supplier: 'TeaBase Co.', maxStock: 50000, quantityPerServing: 30, status: 'In Stock' },
{ name: 'Matcha Powder', quantity: 8000, supplier: 'Matcha Imports', maxStock: 25000, quantityPerServing: 20, status: 'In Stock' },
{ name: 'Cocoa Powder', quantity: 6000, supplier: 'FlavorMix Inc.', maxStock: 20000, quantityPerServing: 20, status: 'In Stock' },
{ name: 'Tapioca Pearls', quantity: 20000, supplier: 'BobaWorld Supply', maxStock: 60000, quantityPerServing: 50, status: 'In Stock' },
{ name: 'Cooked Red Beans', quantity: 8000, supplier: 'Asian Dessert Imports', maxStock: 20000, quantityPerServing: 40, status: 'In Stock' },
{ name: 'Ice', quantity: 999999, supplier: 'IceSupply.Co', maxStock: 999999, quantityPerServing: 200, status: 'In Stock' },
{ name: 'Water', quantity: 999999, supplier: 'In House', maxStock: 999999, quantityPerServing: 200, status: 'In Stock' },
{ name: 'Coffee Concentrate', quantity: 10000, supplier: 'CoffeeBean Co.', maxStock: 30000, quantityPerServing: 50, status: 'In Stock' },
{ name: 'Chicken Thigh Meat', quantity: 10000, supplier: 'SnackFoods Wholesale', maxStock: 30000, quantityPerServing: 120, status: 'In Stock' },
{ name: 'Frying Oil', quantity: 50000, supplier: 'SnackFoods Wholesale', maxStock: 150000, quantityPerServing: 30, status: 'In Stock' },
{ name: 'Egg Puff Batter Mix', quantity: 15000, supplier: 'Bakery Supply Co.', maxStock: 50000, quantityPerServing: 80, status: 'In Stock'},
{ name: 'Mochi Donut Mix', quantity: 15000, supplier: 'Bakery Supply Co.', maxStock: 50000, quantityPerServing: 70, status: 'In Stock'},
{ name: 'Straws', quantity: 2000, supplier: 'Restaurant Essentials', maxStock: 8000, quantityPerServing: 1, status: 'In Stock' },
{ name: 'Cups', quantity: 1500, supplier: 'Restaurant Essentials', maxStock: 6000, quantityPerServing: 1, status: 'In Stock' },
{ name: 'Lids', quantity: 1500, supplier: 'Restaurant Essentials', maxStock: 6000, quantityPerServing: 1, status: 'In Stock' },
{ name: 'Paper Bags', quantity: 500, supplier: 'Packaging Depot', maxStock: 2000, quantityPerServing: 1, status: 'In Stock' },
{ name: 'Napkins', quantity: 3000, supplier: 'Restaurant Essentials', maxStock: 10000, quantityPerServing: 1, status: 'In Stock' },
{ name: 'Popping Boba', quantity: 5000, supplier: 'BobaWorld Supply', maxStock: 20000, quantityPerServing: 40, status: 'In Stock' },
{ name: 'Grass Jelly', quantity: 8000, supplier: 'Asian Dessert Imports', maxStock: 25000, quantityPerServing: 60, status: 'In Stock' },
{ name: 'Lychee Jelly', quantity: 8000, supplier: 'Asian Dessert Imports', maxStock: 25000, quantityPerServing: 60, status: 'In Stock' },
{ name: 'Pudding', quantity: 6000, supplier: 'Custard Co.', maxStock: 20000, quantityPerServing: 50, status: 'In Stock' },
{ name: 'Cheese Foam', quantity: 4000, supplier: 'FoamMix Supply', maxStock: 15000, quantityPerServing: 30, status: 'In Stock' },
];

@Injectable()
export class InventoryService implements OnModuleInit {
  private readonly logger = new Logger(InventoryService.name);

  constructor(
    @InjectRepository(Inventory)
    private readonly inventoryRepo: Repository<Inventory>,
  ) {}

  async onModuleInit() {
    for (const item of SEED_INVENTORY) {
      const exists = await this.inventoryRepo.findOneBy({ name: item.name });
      if (!exists) {
        await this.inventoryRepo.save(this.inventoryRepo.create(item));
        this.logger.log(`Inserted inventory item: ${item.name}`);
      }
    }
  }

  async findAll(): Promise<Inventory[]> {
    return this.inventoryRepo.find({
      order: { id: 'ASC' },
    });
  }
}