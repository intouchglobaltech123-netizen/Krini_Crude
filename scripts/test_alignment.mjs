import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const uploadPath = 'C:/Users/Admin/.gemini/antigravity-ide/brain/0534ff2c-bec7-48f8-b598-9a78fa1922b4/.user_uploaded/media_1792824925821.png';
const root = path.resolve('d:/projects/krini crude/Krini_Crude');
const imgDir = path.join(root, 'public', 'images');

async function testAlignment() {
  const bufNew = fs.readFileSync(uploadPath);
  const { data: dataNew } = await sharp(bufNew).raw().toBuffer({ resolveWithObject: true });

  const bufOld = fs.readFileSync(path.join(imgDir, 'logo-krini-h.webp'));
  const { data: dataOld } = await sharp(bufOld).raw().toBuffer({ resolveWithObject: true });

  // Compare emblem center or text position
  // In old logo, where is alpha > 0?
  let minX = 739, maxX = 0, minY = 220, maxY = 0;
  for (let y = 0; y < 220; y++) {
    for (let x = 0; x < 739; x++) {
      const a = dataOld[(y * 739 + x) * 4 + 3];
      if (a > 10) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  console.log(`Old logo non-transparent bounds: x=${minX}..${maxX}, y=${minY}..${maxY}`);

  // In new logo top half, where is pixel != (255, 255, 255)?
  let nMinX = 739, nMaxX = 0, nMinY = 220, nMaxY = 0;
  for (let y = 0; y < 220; y++) {
    for (let x = 0; x < 739; x++) {
      const idx = (y * 739 + x) * 4;
      const r = dataNew[idx], g = dataNew[idx + 1], b = dataNew[idx + 2];
      if (r < 250 || g < 250 || b < 250) {
        if (x < nMinX) nMinX = x;
        if (x > nMaxX) nMaxX = x;
        if (y < nMinY) nMinY = y;
        if (y > nMaxY) nMaxY = y;
      }
    }
  }
  console.log(`New logo top half non-white bounds: x=${nMinX}..${nMaxX}, y=${nMinY}..${nMaxY}`);

  // In new logo bottom half, where is pixel != (15, 23, 43)?
  let bMinX = 739, bMaxX = 0, bMinY = 220, bMaxY = 0;
  for (let y = 220; y < 440; y++) {
    for (let x = 0; x < 739; x++) {
      const idx = (y * 739 + x) * 4;
      const r = dataNew[idx], g = dataNew[idx + 1], b = dataNew[idx + 2];
      const diff = Math.abs(r - 15) + Math.abs(g - 23) + Math.abs(b - 43);
      if (diff > 15) {
        if (x < bMinX) bMinX = x;
        if (x > bMaxX) bMaxX = x;
        const ly = y - 220;
        if (ly < bMinY) bMinY = ly;
        if (ly > bMaxY) bMaxY = ly;
      }
    }
  }
  console.log(`New logo bot half non-navy bounds: x=${bMinX}..${bMaxX}, y=${bMinY}..${bMaxY}`);
}

testAlignment().catch(console.error);
