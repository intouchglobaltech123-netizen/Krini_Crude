import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const imgDir = path.join(root, 'public', 'images');

async function checkAndFix() {
  const filePath = path.join(imgDir, 'logo-krini.webp');
  const fileBuffer = fs.readFileSync(filePath);
  const { data, info } = await sharp(fileBuffer).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const pixels = Buffer.from(data);

  // KRINI in logo-krini.webp is in the bottom area: y from 0.85 * height to height, x from 0 to 0.52 * width
  const xMin = 0;
  const xMax = Math.floor(width * 0.52);
  const yMin = Math.floor(height * 0.85);

  const colDeep = [122, 88, 10];
  const colDark = [184, 146, 30];
  const colBase = [212, 175, 55];
  const colHi   = [238, 212, 124];
  const colSpec = [255, 248, 215];

  let fixed = 0;
  for (let y = yMin; y < height; y++) {
    for (let x = xMin; x < xMax; x++) {
      const idx = (y * width + x) * channels;
      const r = pixels[idx];
      const g = pixels[idx + 1];
      const b = pixels[idx + 2];
      const a = channels === 4 ? pixels[idx + 3] : 255;

      // If there is any leftover reddish pixel (R > 1.2 * G and R > 70)
      if (a > 5 && r > g * 1.15 && r > 60) {
        const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255.0;
        let nr, ng, nb;

        if (lum < 0.25) {
          const t = lum / 0.25;
          nr = colDeep[0] + (colDark[0] - colDeep[0]) * t;
          ng = colDeep[1] + (colDark[1] - colDeep[1]) * t;
          nb = colDeep[2] + (colDark[2] - colDeep[2]) * t;
        } else if (lum < 0.50) {
          const t = (lum - 0.25) / 0.25;
          nr = colDark[0] + (colBase[0] - colDark[0]) * t;
          ng = colDark[1] + (colBase[1] - colDark[1]) * t;
          nb = colDark[2] + (colBase[2] - colDark[2]) * t;
        } else if (lum < 0.75) {
          const t = (lum - 0.50) / 0.25;
          nr = colBase[0] + (colHi[0] - colBase[0]) * t;
          ng = colBase[1] + (colHi[1] - colBase[1]) * t;
          nb = colBase[2] + (colHi[2] - colBase[2]) * t;
        } else {
          const t = Math.min(1.0, (lum - 0.75) / 0.25);
          nr = colHi[0] + (colSpec[0] - colHi[0]) * t;
          ng = colHi[1] + (colSpec[1] - colHi[1]) * t;
          nb = colHi[2] + (colSpec[2] - colHi[2]) * t;
        }

        pixels[idx]     = Math.min(255, Math.max(0, Math.round(nr)));
        pixels[idx + 1] = Math.min(255, Math.max(0, Math.round(ng)));
        pixels[idx + 2] = Math.min(255, Math.max(0, Math.round(nb)));
        fixed++;
      }
    }
  }

  console.log(`Fixed ${fixed} pixels in logo-krini.webp`);
  if (fixed > 0) {
    const outBuffer = await sharp(pixels, { raw: { width, height, channels } })
      .webp({ quality: 95 })
      .toBuffer();
    fs.writeFileSync(filePath, outBuffer);

    const nestedPath = path.join(root, 'Krini_Crude', 'public', 'images', 'logo-krini.webp');
    if (fs.existsSync(path.dirname(nestedPath))) {
      fs.writeFileSync(nestedPath, outBuffer);
    }
  }
}

checkAndFix().catch(console.error);
