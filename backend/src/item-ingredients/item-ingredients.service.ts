import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemIngredient } from './item-ingredient.entity';

@Injectable()
export class ItemIngredientsService {
  constructor(
    @InjectRepository(ItemIngredient)
    private readonly itemIngredientsRepo: Repository<ItemIngredient>,
  ) {}

  findAll() {
    return this.itemIngredientsRepo.find({
      relations: ['menuItem', 'inventory'],
      order: { id: 'ASC' },
    });
  }
}
