import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { ToppingItem } from './topping-item.entity';
import { CreateToppingItemDto } from './create-topping-item.dto';
import { UpdateToppingItemDto } from './update-topping-item.dto';
import { basename, join } from 'path';
import { unlink } from 'fs/promises';
import {
  getUploadDirectory,
  UPLOADS_PUBLIC_PREFIX,
} from '../upload/upload.paths';

@Injectable()
export class ToppingItemsService {
  constructor(
    @InjectRepository(ToppingItem)
    private readonly toppingRepo: Repository<ToppingItem>,
  ) {}

  async findAll(
    category?: string,
    includeUnavailable = false,
  ): Promise<ToppingItem[]> {
    const where: FindOptionsWhere<ToppingItem> = {};
    if (!includeUnavailable) {
      where.available = true;
    }
    if (category) {
      where.category = category;
    }
    return this.toppingRepo.find({
      where,
      order: { category: 'ASC', name: 'ASC' },
    });
  }

  async create(dto: CreateToppingItemDto): Promise<ToppingItem> {
    const name = dto.name?.trim();
    if (!name) {
      throw new BadRequestException('Name is required.');
    }
    const price = Number(dto.price);
    if (Number.isNaN(price) || price < 0) {
      throw new BadRequestException('Price must be a non-negative number.');
    }
    const item = this.toppingRepo.create({
      name,
      category: dto.category?.trim() || undefined,
      price,
    });
    return this.toppingRepo.save(item);
  }

  async remove(id: number): Promise<void> {
    const item = await this.toppingRepo.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Topping item ${id} not found`);
    }

    // Clean up image file if present
    if (item.image?.startsWith(`${UPLOADS_PUBLIC_PREFIX}/`)) {
      const oldName = basename(item.image);
      const oldPath = join(getUploadDirectory(), oldName);
      try {
        await unlink(oldPath);
      } catch {
        // ignore
      }
    }

    await this.toppingRepo.remove(item);
  }

  async update(id: number, dto: UpdateToppingItemDto): Promise<ToppingItem> {
    const item = await this.toppingRepo.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Topping item ${id} not found`);
    }

    if (dto.name !== undefined) {
      const name = dto.name.trim();
      if (!name) {
        throw new BadRequestException('Name cannot be empty.');
      }
      item.name = name;
    }

    if (dto.category !== undefined) {
      const cat = dto.category.trim();
      if (!cat) {
        throw new BadRequestException('Category cannot be empty.');
      }
      item.category = cat;
    }

    if (dto.price !== undefined) {
      const p = Number(dto.price);
      if (Number.isNaN(p) || p < 0) {
        throw new BadRequestException('Price must be a non-negative number.');
      }
      item.price = p;
    }

    if (dto.available !== undefined) {
      item.available = Boolean(dto.available);
    }

    return this.toppingRepo.save(item);
  }

  async attachImage(id: number, publicPath: string): Promise<ToppingItem> {
    const item = await this.toppingRepo.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Topping item ${id} not found`);
    }

    const previous = item.image;
    item.image = publicPath;
    await this.toppingRepo.save(item);

    if (previous?.startsWith(`${UPLOADS_PUBLIC_PREFIX}/`)) {
      const oldName = basename(previous);
      const oldPath = join(getUploadDirectory(), oldName);
      try {
        await unlink(oldPath);
      } catch {
        // File may already be missing; ignore.
      }
    }

    return item;
  }

  async removeImage(id: number): Promise<ToppingItem> {
    const item = await this.toppingRepo.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Topping item ${id} not found`);
    }

    const previous = item.image;
    item.image = null;
    await this.toppingRepo.save(item);

    if (previous?.startsWith(`${UPLOADS_PUBLIC_PREFIX}/`)) {
      const oldName = basename(previous);
      const oldPath = join(getUploadDirectory(), oldName);
      try {
        await unlink(oldPath);
      } catch {
        // File may already be missing; ignore.
      }
    }

    return item;
  }
}
