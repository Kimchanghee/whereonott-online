import { existsSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const cache = new Map<string, { width: number; height: number }>();

/** Build-time intrinsic size of a /public image so width/height attributes match the file (no layout shift). */
export async function imgSize(src: string, fallback = { width: 1200, height: 800 }) {
  if (cache.has(src)) return cache.get(src)!;
  const file = join((globalThis as unknown as { process: { cwd(): string } }).process.cwd(), 'public', src.replace(/^\//, ''));
  let out = fallback;
  if (existsSync(file)) {
    try {
      const m = await sharp(file).metadata();
      if (m.width && m.height) out = { width: m.width, height: m.height };
    } catch { /* keep fallback */ }
  }
  cache.set(src, out);
  return out;
}

type Img = { src: string; alt: string; role: string; rights?: string };
/** Card thumbnail: an image whose basename starts with "thumb", else the cover. */
export function thumbOf<T extends Img>(images: T[]): T {
  return images.find((i) => /\/thumb[^/]*$/.test(i.src)) ?? images.find((i) => i.role === 'cover') ?? images[0];
}
/** Older posts used text diagrams (rights: own, PNG) as covers; render them uncropped. */
export const isDiagram = (img: Img) => img.rights === 'own' || /\.png$/i.test(img.src);
