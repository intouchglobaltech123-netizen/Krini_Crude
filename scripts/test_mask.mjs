import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const uploadPath = 'C:/Users/Admin/.gemini/antigravity-ide/brain/0534ff2c-bec7-48f8-b598-9a78fa1922b4/.user_uploaded/media_1792824925821.png';
const root = path.resolve('d:/projects/krini crude/Krini_Crude');
const imgDir = path.join(root, 'public', 'images');

async function testMaskMatch() {
  const bufOld = fs.readFileSync(path.join(imgDir, 'logo-krini-h.webp'));
  const { data: dataOld } = await sharp(bufOld).raw().toBuffer({ resolveWithObject: true });

  const bufNew = fs.readFileSync(uploadPath);
  const { data: dataNew } = await sharp(bufNew).raw().toBuffer({ resolveWithObject: true });

  // For all pixels where dataOld has alpha === 0 (background in old logo):
  // Check the color in dataNew (top half)
  let nonWhiteInOldTransparent = 0;
  for (let y = 0; y < 220; y++) {
    for (let x = 0; x < 739; x++) {
      const a = dataOld[(y * 739 + x) * 4 + 3];
      if (a === 0) {
        const idx = (y * 739 + x) * 4;
        const r = dataNew[idx], g = dataNew[idx + 1], b = dataNew[idx + 2];
        if (r < 240 || g < 240 || b < 240) {
          nonWhiteInOldTransparent++;
        }
      }
    }
  }

  // For all pixels where dataOld has alpha === 255 (fully solid in old logo):
  // Check if dataNew has white
  let whiteInOldSolid = 0;
  for (let y = 0; y < 220; y++) {
    for (let x = 0; x < 739; x++) {
      const a = dataOld[(y * 739 + x) * 4 + 3];
      if (a === 255) {
        const idx = (y * 739 + x) * 4;
        const r = dataNew[idx], g = dataNew[idx + 1], b = dataNew[idx + 2];
        if (r > 250 && g > 250 && b > 250) {
          whiteInOldSolid++;
        }
      }
    }
  }

  console.log(`Non-white in old transparent: ${nonWhiteInOldTransparent} / ${739*220}`);
  console.log(`White in old solid: ${whiteInOldSolid} / ${739*220}`);
}

testMaskMatch().catch(console.error);
