import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const filePath = path.join(root, 'public', 'images', 'logo-krini-h.webp');

async function checkH() {
  const fileBuffer = fs.readFileSync(filePath);
  const { data, info } = await sharp(fileBuffer).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  // In horizontal 739x220, find where CRUDE is (b > r + 30)
  let crudeMinX = width, crudeMinY = height, crudeMaxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = Math.floor(width * 0.45); x < width; x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = channels === 4 ? data[idx + 3] : 255;
      if (a > 20 && b > r + 30) {
        if (x < crudeMinX) crudeMinX = x;
        if (y < crudeMinY) crudeMinY = y;
        if (y > crudeMaxY) crudeMaxY = y;
      }
    }
  }
  console.log(`Horizontal CRUDE: x starts at ${crudeMinX}, y=${crudeMinY} to ${crudeMaxY}`);
}

checkH().catch(console.error);
