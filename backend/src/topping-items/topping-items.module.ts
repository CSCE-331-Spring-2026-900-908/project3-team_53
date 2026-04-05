import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToppingItem } from './topping-item.entity';
import { ToppingItemsService } from './topping-items.service';
import { ToppingItemsController } from './topping-items.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ToppingItem])],
  controllers: [ToppingItemsController],
  providers: [ToppingItemsService],
  exports: [ToppingItemsService],
})
export class ToppingItemsModule {}