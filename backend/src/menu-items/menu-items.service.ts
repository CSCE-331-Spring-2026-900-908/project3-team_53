import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { MenuItem } from './menu-item.entity';
import { UpdateMenuItemDto } from './update-menu-item.dto';
import { basename, join } from 'path';
import { unlink } from 'fs/promises';
import {
  getUploadDirectory,
  UPLOADS_PUBLIC_PREFIX,
} from '../upload/upload.paths';

@Injectable()
export class MenuItemsService {
  constructor(
    @InjectRepository(MenuItem)
    private readonly menuItemRepo: Repository<MenuItem>,
  ) {}

  async findAll(
    category?: string,
    includeUnavailable = false,
  ): Promise<MenuItem[]> {
    const where: FindOptionsWhere<MenuItem> = {};
    if (!includeUnavailable) {
      where.available = true;
    }
    if (category) {
      where.category = category;
    }
    return this.menuItemRepo.find({
      where,
      order: { category: 'ASC', name: 'ASC' },
    });
  }

  async update(id: number, dto: UpdateMenuItemDto): Promise<MenuItem> {
    const item = await this.menuItemRepo.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Menu item ${id} not found`);
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

    return this.menuItemRepo.save(item);
  }

  async attachImage(id: number, publicPath: string): Promise<MenuItem> {
    const item = await this.menuItemRepo.findOne({ where: { id } });
    if (!item) {
      throw new NotFoundException(`Menu item ${id} not found`);
    }

    const previous = item.image;
    item.image = publicPath;
    await this.menuItemRepo.save(item);

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
