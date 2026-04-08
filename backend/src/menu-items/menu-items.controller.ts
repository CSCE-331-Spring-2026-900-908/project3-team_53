import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { unlink } from 'fs/promises';
import { join } from 'path';
import { MenuItemsService } from './menu-items.service';
import { MenuItem } from './menu-item.entity';
import { menuImageMulterOptions } from './menu-image.multer';
import {
  getUploadDirectory,
  UPLOADS_PUBLIC_PREFIX,
} from '../upload/upload.paths';

@Controller('menu-items')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Get()
  findAll(@Query('category') category?: string): Promise<MenuItem[]> {
    return this.menuItemsService.findAll(category);
  }

  @Post(':id/image')
  @UseInterceptors(FileInterceptor('image', menuImageMulterOptions))
  async uploadImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File | undefined,
  ): Promise<MenuItem> {
    if (!file) {
      throw new BadRequestException(
        'Image file is required (form field name: image).',
      );
    }
    const publicPath = `${UPLOADS_PUBLIC_PREFIX}/${file.filename}`;
    try {
      return await this.menuItemsService.attachImage(id, publicPath);
    } catch (err) {
      if (err instanceof NotFoundException) {
        await unlink(join(getUploadDirectory(), file.filename)).catch(() => {});
      }
      throw err;
    }
  }
}
