import { BadRequestException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { mkdirSync } from 'fs';
import { getUploadDirectory } from '../upload/upload.paths';

const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
]);

const EXT_FOR_MIME: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
  'image/webp': '.webp',
};

export const MENU_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

export const menuImageMulterOptions = {
  storage: diskStorage({
    destination: (_req, _file, cb) => {
      const dir = getUploadDirectory();
      mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (_req, file, cb) => {
      const ext =
        extname(file.originalname).toLowerCase() ||
        EXT_FOR_MIME[file.mimetype] ||
        '.img';
      cb(null, `${randomUUID()}${ext}`);
    },
  }),
  limits: { fileSize: MENU_IMAGE_MAX_BYTES },
  fileFilter: (
    _req: Express.Request,
    file: Express.Multer.File,
    cb: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    if (!file.mimetype || !ALLOWED_MIME.has(file.mimetype)) {
      return cb(
        new BadRequestException(
          'Only JPEG, PNG, GIF, and WebP images are allowed.',
        ),
        false,
      );
    }
    cb(null, true);
  },
};
