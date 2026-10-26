import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const imgDir = path.join(root, 'public', 'images');
const uploadPath = 'C:/Users/Admin/.gemini/antigravity-ide/brain/0534ff2c-bec7-48f8-b598-9a78fa1922b4/.user_uploaded/media_1792824925821.png';

async function main() {
  console.log('Loading uploaded image from:', uploadPath);
  const buf = fs.readFileSync(uploadPath);
  const meta = await sharp(buf).metadata();
  console.log('Uploaded image metadata:', meta);

  const { width, height } = meta;
  const halfH = Math.floor(height / 2);

  // Top half: light background version
  const topHalf = await sharp(buf)
    .extract({ left: 0, top: 0, width, height: halfH })
    .png()
    .toBuffer();

  // Bottom half: dark background version
  const botHalf = await sharp(buf)
    .extract({ left: 0, top: halfH, width, height: height - halfH })
    .png()
    .toBuffer();

  console.log('Extracted top and bottom halves successfully.');

  // Let's inspect logo-krini-h.webp
  const hPath = path.join(imgDir, 'logo-krini-h.webp');
  const hMeta = await sharp(fs.readFileSync(hPath)).metadata();
  console.log('Current logo-krini-h.webp metadata:', hMeta);
}

main().catch(console.error);
