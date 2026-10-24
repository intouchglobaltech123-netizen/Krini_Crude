import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const imgDir = path.join(root, 'public', 'images');

async function recolorImage(file, bbox) {
  const filePath = path.join(imgDir, file);
  if (!fs.existsSync(filePath)) return;

  const fileBuffer = fs.readFileSync(filePath);
  const { data, info } = await sharp(fileBuffer).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const pixels = Buffer.from(data);

  const { xMin, xMax, yMin, yMax } = bbox;

  // The website's metallic gold palette matching Image 2:
  // #7A580A deep shadow bevel
  // #B8921E darker gold
  // #D4AF37 base metallic gold (median of Image 2)
  // #ECD27A bright gold highlight
  // #FFF6D0 top shine
  const colDeep = [122, 88, 10];
  const colDark = [184, 146, 30];
  const colBase = [212, 175, 55];
  const colHi   = [238, 212, 124];
  const colSpec = [255, 248, 215];

  for (let y = yMin; y <= yMax && y < height; y++) {
    for (let x = xMin; x <= xMax && x < width; x++) {
      const idx = (y * width + x) * channels;
      const r = pixels[idx];
      const g = pixels[idx + 1];
      const b = pixels[idx + 2];
      const a = channels === 4 ? pixels[idx + 3] : 255;

      // Inside this tight bounding box, any pixel with alpha belongs to KRINI
      if (a > 10) {
        // Luminance preserving bevels, reflections and 3D depth
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
      }
    }
  }

  const outBuffer = await sharp(pixels, { raw: { width, height, channels } })
    .webp({ quality: 95 })
    .toBuffer();

  fs.writeFileSync(filePath, outBuffer);
  console.log(`Updated ${file}`);

  const nestedPath = path.join(root, 'Krini_Crude', 'public', 'images', file);
  if (fs.existsSync(path.dirname(nestedPath))) {
    fs.writeFileSync(nestedPath, outBuffer);
    console.log(`Updated nested ${file}`);
  }
}

async function run() {
  // Horizontal logos (739x220): KRINI is strictly x: 208..450, y: 82..150
  const hBbox = { xMin: 208, xMax: 450, yMin: 82, yMax: 150 };
  await recolorImage('logo-krini-h.webp', hBbox);
  await recolorImage('logo-krini-h-light.webp', hBbox);

  // Vertical logo (401x519): KRINI is strictly x: 0..184, y: 468..518
  const vBbox = { xMin: 0, xMax: 184, yMin: 468, yMax: 518 };
  await recolorImage('logo-krini.webp', vBbox);

  console.log('All logo images recolored with pixel-perfect precision.');
}

run().catch(console.error);
