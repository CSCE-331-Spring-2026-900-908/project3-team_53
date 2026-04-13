import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
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
import { CreateMenuItemDto } from './create-menu-item.dto';
import { UpdateMenuItemDto } from './update-menu-item.dto';
import { imageUploadMulterOptions } from '../upload/image-upload.multer';
import {
  getUploadDirectory,
  UPLOADS_PUBLIC_PREFIX,
} from '../upload/upload.paths';

@Controller('menu-items')
export class MenuItemsController {
  constructor(private readonly menuItemsService: MenuItemsService) {}

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('includeUnavailable') includeUnavailable?: string,
  ): Promise<MenuItem[]> {
    return this.menuItemsService.findAll(
      category,
      includeUnavailable === 'true',
    );
  }

  @Post()
  create(@Body() dto: CreateMenuItemDto): Promise<MenuItem> {
    return this.menuItemsService.create(dto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMenuItemDto,
  ): Promise<MenuItem> {
    return this.menuItemsService.update(id, dto);
  }

  @Post(':id/image')
  @UseInterceptors(FileInterceptor('image', imageUploadMulterOptions))
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

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.menuItemsService.remove(id);
  }

  @Delete(':id/image')
  async deleteImage(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MenuItem> {
    return this.menuItemsService.removeImage(id);
  }
}
