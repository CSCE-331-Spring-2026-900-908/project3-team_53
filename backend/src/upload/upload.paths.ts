import { join } from 'path';

/** Public URL path segment (served by Express static middleware). */
export const UPLOADS_PUBLIC_PREFIX = '/uploads';

export function getUploadDirectory(): string {
  const fromEnv = process.env.UPLOAD_DIR?.trim();
  return fromEnv && fromEnv.length > 0 ? fromEnv : join(process.cwd(), 'uploads');
}
