// One-shot image optimizer for /public/images/.
// Resizes anything wider than MAX_WIDTH down to MAX_WIDTH (preserving aspect),
// and re-encodes at a sane quality. Skips small files and SVGs.
//
// Run: node scripts/optimize-images.mjs

import { readdir, stat, rename, unlink } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
import sharp from 'sharp';

const DIR = 'public/images';
const MAX_WIDTH = 2000;
const JPEG_QUALITY = 82;
const PNG_QUALITY = 80;

const files = await readdir(DIR);

let totalBefore = 0;
let totalAfter = 0;

for (const file of files) {
  const ext = extname(file).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;

  const src = join(DIR, file);
  const tmp = join(DIR, `.tmp-${file}`);
  const before = (await stat(src)).size;

  const img = sharp(src);
  const meta = await img.metadata();
  const resized = meta.width && meta.width > MAX_WIDTH
    ? img.resize({ width: MAX_WIDTH, withoutEnlargement: true })
    : img;

  if (ext === '.png') {
    await resized.png({ quality: PNG_QUALITY, compressionLevel: 9 }).toFile(tmp);
  } else {
    await resized.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(tmp);
  }

  const after = (await stat(tmp)).size;
  await unlink(src);
  await rename(tmp, src);

  totalBefore += before;
  totalAfter += after;

  const pct = ((1 - after / before) * 100).toFixed(0);
  const beforeMb = (before / 1024 / 1024).toFixed(2);
  const afterMb = (after / 1024 / 1024).toFixed(2);
  console.log(`${basename(file).padEnd(36)} ${beforeMb} MB -> ${afterMb} MB  (-${pct}%)`);
}

const pct = ((1 - totalAfter / totalBefore) * 100).toFixed(0);
const beforeMb = (totalBefore / 1024 / 1024).toFixed(2);
const afterMb = (totalAfter / 1024 / 1024).toFixed(2);
console.log(`\nTotal: ${beforeMb} MB -> ${afterMb} MB  (-${pct}%)`);
