import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const uploadPath = 'C:/Users/Admin/.gemini/antigravity-ide/brain/0534ff2c-bec7-48f8-b598-9a78fa1922b4/.user_uploaded/media_1792824925821.png';

async function checkBackground() {
  const buf = fs.readFileSync(uploadPath);
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  console.log(`Channels: ${channels}, width: ${width}, height: ${height}`);

  // Check top-left corner (pixel 0,0)
  console.log(`Top-left (0,0): R=${data[0]}, G=${data[1]}, B=${data[2]}, A=${data[3]}`);

  // Check top-right corner (width-1, 0)
  const trIdx = (0 * width + (width - 1)) * channels;
  console.log(`Top-right (${width-1},0): R=${data[trIdx]}, G=${data[trIdx+1]}, B=${data[trIdx+2]}, A=${data[trIdx+3]}`);

  // Check bottom-left corner (0, height-1)
  const blIdx = ((height - 1) * width + 0) * channels;
  console.log(`Bottom-left (0,${height-1}): R=${data[blIdx]}, G=${data[blIdx+1]}, B=${data[blIdx+2]}, A=${data[blIdx+3]}`);

  // Check bottom-right corner (width-1, height-1)
  const brIdx = ((height - 1) * width + (width - 1)) * channels;
  console.log(`Bottom-right (${width-1},${height-1}): R=${data[brIdx]}, G=${data[brIdx+1]}, B=${data[brIdx+2]}, A=${data[brIdx+3]}`);
}

checkBackground().catch(console.error);
