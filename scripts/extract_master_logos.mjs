import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const uploadPath = 'C:/Users/Admin/.gemini/antigravity-ide/brain/0534ff2c-bec7-48f8-b598-9a78fa1922b4/.user_uploaded/media_1792824925821.png';
const root = path.resolve('d:/projects/krini crude/Krini_Crude');
const imgDir = path.join(root, 'public', 'images');
const brainDir = path.resolve('C:/Users/Admin/.gemini/antigravity-ide/brain/0534ff2c-bec7-48f8-b598-9a78fa1922b4');

async function extractLogos() {
  const bufNew = fs.readFileSync(uploadPath);
  const { data: rawNew } = await sharp(bufNew).raw().toBuffer({ resolveWithObject: true });

  const bufOldLight = fs.readFileSync(path.join(imgDir, 'logo-krini-h.webp'));
  const { data: rawOldLight } = await sharp(bufOldLight).raw().toBuffer({ resolveWithObject: true });

  const bufOldDark = fs.readFileSync(path.join(imgDir, 'logo-krini-h-light.webp'));
  const { data: rawOldDark } = await sharp(bufOldDark).raw().toBuffer({ resolveWithObject: true });

  const W = 739;
  const H = 220;

  const topOut = Buffer.alloc(W * H * 4);
  const botOut = Buffer.alloc(W * H * 4);

  // --- 1. Top Logo (Light Background version) ---
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = (y * W + x) * 4;
      const r = rawNew[idx];
      const g = rawNew[idx + 1];
      const b = rawNew[idx + 2];
      const oldA = rawOldLight[idx + 3];

      // Whiteness distance
      const whiteness = Math.min(r, g, b) / 255.0;
      const colDiff = (255 - r) + (255 - g) + (255 - b);

      if (colDiff < 6 && oldA === 0) {
        // Pure background
        topOut[idx] = 255;
        topOut[idx + 1] = 255;
        topOut[idx + 2] = 255;
        topOut[idx + 3] = 0;
      } else if (colDiff < 45 && oldA === 0) {
        // Edge transition on background
        const alpha = Math.min(255, Math.max(0, Math.round((colDiff / 45.0) * 255)));
        const aNorm = Math.max(0.01, alpha / 255.0);
        const ur = Math.max(0, Math.min(255, Math.round((r - (1 - aNorm) * 255) / aNorm)));
        const ug = Math.max(0, Math.min(255, Math.round((g - (1 - aNorm) * 255) / aNorm)));
        const ub = Math.max(0, Math.min(255, Math.round((b - (1 - aNorm) * 255) / aNorm)));
        topOut[idx] = ur;
        topOut[idx + 1] = ug;
        topOut[idx + 2] = ub;
        topOut[idx + 3] = alpha;
      } else {
        // Logo body / edge
        // If oldA had partial transparency at boundary, blend smoothly
        let a = 255;
        if (oldA > 0 && oldA < 255 && colDiff < 100) {
          a = Math.max(oldA, Math.round((colDiff / 100.0) * 255));
        } else if (colDiff < 20) {
          a = 0;
        }
        topOut[idx] = r;
        topOut[idx + 1] = g;
        topOut[idx + 2] = b;
        topOut[idx + 3] = a;
      }
    }
  }

  // --- 2. Bottom Logo (Dark Background version) ---
  const bgNavy = [15, 23, 43];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const srcIdx = ((y + H) * W + x) * 4;
      const dstIdx = (y * W + x) * 4;
      const r = rawNew[srcIdx];
      const g = rawNew[srcIdx + 1];
      const b = rawNew[srcIdx + 2];
      const oldA = rawOldDark[dstIdx + 3];

      const diff = Math.abs(r - bgNavy[0]) + Math.abs(g - bgNavy[1]) + Math.abs(b - bgNavy[2]);

      if (diff < 8 && oldA === 0) {
        botOut[dstIdx] = 0;
        botOut[dstIdx + 1] = 0;
        botOut[dstIdx + 2] = 0;
        botOut[dstIdx + 3] = 0;
      } else if (diff < 40 && oldA === 0) {
        const alpha = Math.min(255, Math.max(0, Math.round((diff / 40.0) * 255)));
        const aNorm = Math.max(0.01, alpha / 255.0);
        const ur = Math.max(0, Math.min(255, Math.round((r - (1 - aNorm) * bgNavy[0]) / aNorm)));
        const ug = Math.max(0, Math.min(255, Math.round((g - (1 - aNorm) * bgNavy[1]) / aNorm)));
        const ub = Math.max(0, Math.min(255, Math.round((b - (1 - aNorm) * bgNavy[2]) / aNorm)));
        botOut[dstIdx] = ur;
        botOut[dstIdx + 1] = ug;
        botOut[dstIdx + 2] = ub;
        botOut[dstIdx + 3] = alpha;
      } else {
        let a = 255;
        if (oldA > 0 && oldA < 255 && diff < 80) {
          a = Math.max(oldA, Math.round((diff / 80.0) * 255));
        } else if (diff < 15) {
          a = 0;
        }
        botOut[dstIdx] = r;
        botOut[dstIdx + 1] = g;
        botOut[dstIdx + 2] = b;
        botOut[dstIdx + 3] = a;
      }
    }
  }

  const topWebp = await sharp(topOut, { raw: { width: W, height: H, channels: 4 } })
    .webp({ quality: 98, effort: 6 })
    .toBuffer();

  const botWebp = await sharp(botOut, { raw: { width: W, height: H, channels: 4 } })
    .webp({ quality: 98, effort: 6 })
    .toBuffer();

  fs.writeFileSync(path.join(brainDir, 'preview-top-clean.webp'), topWebp);
  fs.writeFileSync(path.join(brainDir, 'preview-bot-clean.webp'), botWebp);

  console.log('Saved clean previews to brain directory!');
}

extractLogos().catch(console.error);
