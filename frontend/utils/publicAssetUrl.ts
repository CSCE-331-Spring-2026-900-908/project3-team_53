/**
 * Turns API-relative paths (e.g. `/uploads/file.jpg`) into absolute URLs using
 * the same host as `NEXT_PUBLIC_API_URL`, with any trailing `/api` stripped.
 */
export function publicAssetUrl(
  storedPath: string | null | undefined,
): string | null {
  if (storedPath == null || storedPath === '') return null;
  if (/^https?:\/\//i.test(storedPath)) return storedPath;

  const raw = process.env.NEXT_PUBLIC_API_URL ?? '';
  const origin = raw.replace(/\/?api\/?$/i, '').replace(/\/$/, '');
  if (!origin) return storedPath;

  const path = storedPath.startsWith('/') ? storedPath : `/${storedPath}`;
  return `${origin}${path}`;
}
