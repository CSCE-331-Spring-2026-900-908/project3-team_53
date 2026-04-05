import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { MenuItemsModule } from './menu-items/menu-items.module';
import { OrdersModule } from './orders/orders.module';
import { EmployeesModule } from './employees/employees.module';
import { ToppingItemsModule } from './topping-items/topping-items.module';
import { InventoryModule } from './inventory/inventory.modules';
import { ItemIngredientsModule } from './item-ingredients/item-ingredients.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    MenuItemsModule,
    OrdersModule,
    EmployeesModule,
    ToppingItemsModule,
    InventoryModule,
    ItemIngredientsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
