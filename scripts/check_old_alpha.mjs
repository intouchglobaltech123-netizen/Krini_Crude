import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const root = path.resolve('d:/projects/krini crude/Krini_Crude');
const imgDir = path.join(root, 'public', 'images');

async function checkOldAlpha() {
  const bufOld = fs.readFileSync(path.join(imgDir, 'logo-krini-h.webp'));
  const { data: dataOld } = await sharp(bufOld).raw().toBuffer({ resolveWithObject: true });

  // Check the R hole in KRINI (around x=300..325, y=105..120)
  for (let y = 100; y < 130; y++) {
    for (let x = 295; x < 330; x++) {
      const a = dataOld[(y * 739 + x) * 4 + 3];
      if (a === 0) {
        console.log(`Found transparent pixel inside R at (${x}, ${y}) in old logo`);
        return;
      }
    }
  }
}

checkOldAlpha().catch(console.error);
