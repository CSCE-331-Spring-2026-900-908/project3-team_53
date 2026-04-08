import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MenuItem } from './menu-item.entity';
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
