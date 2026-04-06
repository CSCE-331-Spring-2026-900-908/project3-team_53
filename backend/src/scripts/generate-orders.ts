import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Order, OrderItem } from '../orders/orders.entity';
import { MenuItem } from '../menu-items/menu-item.entity';

// TODO: Change this import to match your actual DataSource file
import { AppDataSource } from '../data-source';

const TARGET_REVENUE = 1_250_000;
const WEEKS = 65;
const DAYS = WEEKS * 7;
const PEAK_DAYS_COUNT = 4;

// Topping prices
const TOPPING_PRICES: Record<string, number> = {
  'Boba': 0.75,
  'Popping Boba': 0.75,
  'Grass Jelly': 0.50,
  'Lychee Jelly': 0.50,
  'Pudding': 0.75,
  'Cheese Foam': 1.00,
};

// Random helpers
const SIZES = ['Small', 'Regular', 'Large'] as const;
const SUGAR_LEVELS = ['100%', '75%', '50%', '0%'] as const;
const ICE_LEVELS = ['Regular', 'Less Ice', 'No Ice'] as const;
const ORDER_TYPES = ['dine_in', 'carry_out', 'delivery'] as const;

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomDateBetween(start: Date, end: Date): Date {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function isDrink(menuItem: MenuItem): boolean {
  return menuItem.category !== 'Snacks';
}

function pickSize(menuItem: MenuItem): string {
  if (!isDrink(menuItem)) return 'Regular';

  const r = Math.random();
  if (r < 0.05) return 'Small';
  if (r < 0.75) return 'Regular';
  return 'Large';
}

function pickSugarLevel(menuItem: MenuItem): string {
  return isDrink(menuItem) ? randChoice([...SUGAR_LEVELS]) : '100%';
}

function pickIceLevel(menuItem: MenuItem): string {
  return isDrink(menuItem) ? randChoice([...ICE_LEVELS]) : 'Regular';
}

function pickToppings(menuItem: MenuItem): string[] {
  if (!isDrink(menuItem)) return [];
  const toppingNames = Object.keys(TOPPING_PRICES);
  const count = randInt(0, 2);
  const chosen = new Set<string>();
  while (chosen.size < count) chosen.add(randChoice(toppingNames));
  return [...chosen];
}

function calculateItemPrice(menuItem: MenuItem, size: string, toppings: string[]): number {
  let price = Number(menuItem.price);

  if (size === 'Large') price += 0.50;
  if (size === 'Small') price -= 0.50;

  for (const t of toppings) {
    price += TOPPING_PRICES[t] ?? 0;
  }

  return Math.round(price * 100) / 100;
}

async function main() {
  const dataSource: DataSource = AppDataSource;

  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }

  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    const menuItems = await queryRunner.manager.getRepository(MenuItem).find();
    if (menuItems.length === 0) {
      console.error('No menu_items found. Seed menu_items first.');
      return;
    }

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - DAYS);

    const peakDays = new Set<number>();
    while (peakDays.size < PEAK_DAYS_COUNT) {
      peakDays.add(randInt(0, DAYS - 1));
    }

    console.log('Peak day offsets:', [...peakDays]);

    let totalRevenue = 0;
    let totalOrders = 0;

    for (let dayOffset = 0; dayOffset < DAYS; dayOffset++) {
      const dayDate = new Date(startDate);
      dayDate.setDate(startDate.getDate() + dayOffset);

      let ordersToday = randInt(180, 320);
      if (peakDays.has(dayOffset)) ordersToday = Math.floor(ordersToday * 2.5);

      const dayStart = new Date(dayDate);
      dayStart.setHours(10, 0, 0, 0);

      const dayEnd = new Date(dayDate);
      dayEnd.setHours(22, 0, 0, 0);

      const ordersToInsert: Order[] = [];
      const itemsToInsert: OrderItem[] = [];

      for (let i = 0; i < ordersToday; i++) {
        if (totalRevenue >= TARGET_REVENUE) break;

        const createdAt = randomDateBetween(dayStart, dayEnd);
        const completedAt = new Date(createdAt.getTime() + randInt(2, 15) * 60000);

        const order = queryRunner.manager.create(Order, {
          status: 'completed',
          order_type: randChoice([...ORDER_TYPES]),
          total: 0,
          created_at: createdAt,
          completed_at: completedAt,
        });

        ordersToInsert.push(order);
      }

      const savedOrders = await queryRunner.manager.save(ordersToInsert);

      for (const order of savedOrders) {
        const itemCount = randInt(1, 3);
        let orderTotal = 0;

        for (let j = 0; j < itemCount; j++) {
          const menuItem = randChoice(menuItems);
          const size = pickSize(menuItem);
          const sugar = pickSugarLevel(menuItem);
          const ice = pickIceLevel(menuItem);
          const toppings = pickToppings(menuItem);

          const item_price = calculateItemPrice(menuItem, size, toppings);
          orderTotal += item_price;

          const orderItem = queryRunner.manager.create(OrderItem, {
            order,
            menuItem,
            quantity: 1,
            size,
            sugar_level: sugar,
            ice_level: ice,
            toppings,
            item_price,
          });

          itemsToInsert.push(orderItem);
          totalRevenue += item_price;
        }

        order.total = Math.round(orderTotal * 100) / 100;
        await queryRunner.manager.save(order);
        totalOrders++;

        if (totalRevenue >= TARGET_REVENUE) break;
      }

      await queryRunner.manager.save(itemsToInsert);

      console.log(
        `[Day ${dayOffset + 1}/${DAYS}] Orders: ${ordersToInsert.length}, Revenue: $${totalRevenue.toFixed(2)}`
      );

      if (totalRevenue >= TARGET_REVENUE) {
        console.log('Target revenue reached.');
        break;
      }
    }

    console.log('--------------------------------');
    console.log(`Total orders: ${totalOrders}`);
    console.log(`Total revenue: $${totalRevenue.toFixed(2)}`);
    console.log('Done.');
  } catch (err) {
    console.error(err);
  } finally {
    await queryRunner.release();
    await dataSource.destroy();
  }
}

main();
