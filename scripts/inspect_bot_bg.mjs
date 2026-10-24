import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const uploadPath = 'C:/Users/Admin/.gemini/antigravity-ide/brain/0534ff2c-bec7-48f8-b598-9a78fa1922b4/.user_uploaded/media_1792824925821.png';

async function inspectBotBg() {
  const buf = fs.readFileSync(uploadPath);
  const { data, info } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
  const W = info.width;

  // Let's sample pixels at row y=225, 230, 240, 250 across various columns
  const samples = [];
  for (let y of [222, 230, 240, 300, 400, 435]) {
    for (let x of [10, 50, 100, 200, 400, 600, 720]) {
      const idx = (y * W + x) * 4;
      samples.push({ x, y, r: data[idx], g: data[idx+1], b: data[idx+2] });
    }
  }
  console.log('Sample background pixels in bottom half:', samples);
}

inspectBotBg().catch(console.error);
