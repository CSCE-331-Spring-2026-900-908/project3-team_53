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
import { ToppingItemsService } from './topping-items.service';
import { ToppingItem } from './topping-item.entity';
import { CreateToppingItemDto } from './create-topping-item.dto';
import { UpdateToppingItemDto } from './update-topping-item.dto';
import { imageUploadMulterOptions } from '../upload/image-upload.multer';
import {
  getUploadDirectory,
  UPLOADS_PUBLIC_PREFIX,
} from '../upload/upload.paths';

@Controller('topping-items')
export class ToppingItemsController {
  constructor(private readonly toppingService: ToppingItemsService) {}

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('includeUnavailable') includeUnavailable?: string,
  ): Promise<ToppingItem[]> {
    return this.toppingService.findAll(category, includeUnavailable === 'true');
  }

  @Post()
  create(@Body() dto: CreateToppingItemDto): Promise<ToppingItem> {
    return this.toppingService.create(dto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.toppingService.remove(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateToppingItemDto,
  ): Promise<ToppingItem> {
    return this.toppingService.update(id, dto);
  }

  @Post(':id/image')
  @UseInterceptors(FileInterceptor('image', imageUploadMulterOptions))
  async uploadImage(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File | undefined,
  ): Promise<ToppingItem> {
    if (!file) {
      throw new BadRequestException(
        'Image file is required (form field name: image).',
      );
    }
    const publicPath = `${UPLOADS_PUBLIC_PREFIX}/${file.filename}`;
    try {
      return await this.toppingService.attachImage(id, publicPath);
    } catch (err) {
      if (err instanceof NotFoundException) {
        await unlink(join(getUploadDirectory(), file.filename)).catch(() => {});
      }
      throw err;
    }
  }

  @Delete(':id/image')
  async deleteImage(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ToppingItem> {
    return this.toppingService.removeImage(id);
  }
}
