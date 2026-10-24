import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const uploadPath = 'C:/Users/Admin/.gemini/antigravity-ide/brain/0534ff2c-bec7-48f8-b598-9a78fa1922b4/.user_uploaded/media_1792824925821.png';
const root = path.resolve('d:/projects/krini crude/Krini_Crude');
const imgDir = path.join(root, 'public', 'images');

async function processLogos() {
  const bufNew = fs.readFileSync(uploadPath);
  const { data: rawNew, info: infoNew } = await sharp(bufNew).raw().toBuffer({ resolveWithObject: true });
  const W = infoNew.width; // 739
  const H_half = 220;

  // Let's create two 739x220 RGBA buffers:
  // 1. topLogo (light bg version)
  // 2. botLogo (dark bg version)
  const topPixels = Buffer.alloc(W * H_half * 4);
  const botPixels = Buffer.alloc(W * H_half * 4);

  // --- Process Top Logo (White background) ---
  // Using flood fill from borders to identify background pixels
  const isBgTop = new Uint8Array(W * H_half);
  const queueTop = [];

  // Seed borders
  for (let x = 0; x < W; x++) {
    queueTop.push(0 * W + x); // top row
    queueTop.push((H_half - 1) * W + x); // bottom row of top half
  }
  for (let y = 0; y < H_half; y++) {
    queueTop.push(y * W + 0); // left col
    queueTop.push(y * W + (W - 1)); // right col
  }

  // A pixel is white-ish background if R > 240 && G > 240 && B > 240
  // and color difference is small (white)
  for (let i = 0; i < queueTop.length; i++) {
    const p = queueTop[i];
    if (isBgTop[p]) continue;
    const px = p % W;
    const py = Math.floor(p / W);
    const idx = (py * W + px) * 4;
    const r = rawNew[idx], g = rawNew[idx + 1], b = rawNew[idx + 2];
    if (r > 245 && g > 245 && b > 245) {
      isBgTop[p] = 1;
    }
  }

  // BFS flood fill
  let head = 0;
  // Initialize queue with verified seeds
  const bfsQueue = [];
  for (let p = 0; p < W * H_half; p++) {
    if (isBgTop[p]) bfsQueue.push(p);
  }

  while (head < bfsQueue.length) {
    const curr = bfsQueue[head++];
    const cx = curr % W;
    const cy = Math.floor(curr / W);

    const neighbors = [
      [cx + 1, cy], [cx - 1, cy], [cx, cy + 1], [cx, cy - 1]
    ];
    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < W && ny >= 0 && ny < H_half) {
        const np = ny * W + nx;
        if (!isBgTop[np]) {
          const idx = (ny * W + nx) * 4;
          const r = rawNew[idx], g = rawNew[idx + 1], b = rawNew[idx + 2];
          // Background threshold
          if (r > 242 && g > 242 && b > 242) {
            isBgTop[np] = 1;
            bfsQueue.push(np);
          }
        }
      }
    }
  }

  // Fill topPixels with anti-aliasing
  for (let y = 0; y < H_half; y++) {
    for (let x = 0; x < W; x++) {
      const p = y * W + x;
      const srcIdx = (y * W + x) * 4;
      const dstIdx = p * 4;
      const r = rawNew[srcIdx];
      const g = rawNew[srcIdx + 1];
      const b = rawNew[srcIdx + 2];

      if (isBgTop[p]) {
        topPixels[dstIdx] = 255;
        topPixels[dstIdx + 1] = 255;
        topPixels[dstIdx + 2] = 255;
        topPixels[dstIdx + 3] = 0; // completely transparent
      } else {
        // Check if neighbor to background for anti-aliasing
        let hasBgNeighbor = false;
        for (const [dx, dy] of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,1],[-1,1],[1,-1]]) {
          const nx = x + dx, ny = y + dy;
          if (nx >= 0 && nx < W && ny >= 0 && ny < H_half) {
            if (isBgTop[ny * W + nx]) {
              hasBgNeighbor = true;
              break;
            }
          }
        }

        if (hasBgNeighbor) {
          // Distance from pure white
          const whiteness = Math.min(r, g, b) / 255.0;
          const alpha = Math.max(0, Math.min(255, Math.round((1 - Math.pow(whiteness, 3)) * 255)));
          // Unmultiply white
          const aNorm = Math.max(0.01, alpha / 255.0);
          const ur = Math.max(0, Math.min(255, Math.round((r - (1 - aNorm) * 255) / aNorm)));
          const ug = Math.max(0, Math.min(255, Math.round((g - (1 - aNorm) * 255) / aNorm)));
          const ub = Math.max(0, Math.min(255, Math.round((b - (1 - aNorm) * 255) / aNorm)));

          topPixels[dstIdx] = ur;
          topPixels[dstIdx + 1] = ug;
          topPixels[dstIdx + 2] = ub;
          topPixels[dstIdx + 3] = alpha;
        } else {
          topPixels[dstIdx] = r;
          topPixels[dstIdx + 1] = g;
          topPixels[dstIdx + 2] = b;
          topPixels[dstIdx + 3] = 255;
        }
      }
    }
  }

  // --- Process Bottom Logo (Dark navy background: ~15, 23, 43) ---
  const isBgBot = new Uint8Array(W * H_half);
  const bfsQueueBot = [];

  // Seed borders
  for (let x = 0; x < W; x++) {
    bfsQueueBot.push(0 * W + x);
    bfsQueueBot.push((H_half - 1) * W + x);
  }
  for (let y = 0; y < H_half; y++) {
    bfsQueueBot.push(y * W + 0);
    bfsQueueBot.push(y * W + (W - 1));
  }

  const bgNavy = [15, 23, 43];
  for (let i = 0; i < bfsQueueBot.length; i++) {
    const p = bfsQueueBot[i];
    const px = p % W;
    const py = Math.floor(p / W);
    const idx = ((py + H_half) * W + px) * 4;
    const r = rawNew[idx], g = rawNew[idx + 1], b = rawNew[idx + 2];
    const diff = Math.abs(r - bgNavy[0]) + Math.abs(g - bgNavy[1]) + Math.abs(b - bgNavy[2]);
    if (diff < 15) {
      isBgBot[p] = 1;
    }
  }

  let headBot = 0;
  const activeQueueBot = [];
  for (let p = 0; p < W * H_half; p++) {
    if (isBgBot[p]) activeQueueBot.push(p);
  }

  while (headBot < activeQueueBot.length) {
    const curr = activeQueueBot[headBot++];
    const cx = curr % W;
    const cy = Math.floor(curr / W);

    for (const [nx, ny] of [[cx+1, cy], [cx-1, cy], [cx, cy+1], [cx, cy-1]]) {
      if (nx >= 0 && nx < W && ny >= 0 && ny < H_half) {
        const np = ny * W + nx;
        if (!isBgBot[np]) {
          const idx = ((ny + H_half) * W + nx) * 4;
          const r = rawNew[idx], g = rawNew[idx + 1], b = rawNew[idx + 2];
          const diff = Math.abs(r - bgNavy[0]) + Math.abs(g - bgNavy[1]) + Math.abs(b - bgNavy[2]);
          if (diff < 16) {
            isBgBot[np] = 1;
            activeQueueBot.push(np);
          }
        }
      }
    }
  }

  // Fill botPixels with anti-aliasing
  for (let y = 0; y < H_half; y++) {
    for (let x = 0; x < W; x++) {
      const p = y * W + x;
      const srcIdx = ((y + H_half) * W + x) * 4;
      const dstIdx = p * 4;
      const r = rawNew[srcIdx];
      const g = rawNew[srcIdx + 1];
      const b = rawNew[srcIdx + 2];

      if (isBgBot[p]) {
        botPixels[dstIdx] = 0;
        botPixels[dstIdx + 1] = 0;
        botPixels[dstIdx + 2] = 0;
        botPixels[dstIdx + 3] = 0;
      } else {
        let hasBgNeighbor = false;
        for (const [dx, dy] of [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,1],[-1,1],[1,-1]]) {
          const nx = x + dx, ny = y + dy;
          if (nx >= 0 && nx < W && ny >= 0 && ny < H_half) {
            if (isBgBot[ny * W + nx]) {
              hasBgNeighbor = true;
              break;
            }
          }
        }

        if (hasBgNeighbor) {
          const diff = Math.abs(r - bgNavy[0]) + Math.abs(g - bgNavy[1]) + Math.abs(b - bgNavy[2]);
          const alpha = Math.max(0, Math.min(255, Math.round(Math.min(1.0, diff / 50.0) * 255)));
          const aNorm = Math.max(0.01, alpha / 255.0);
          const ur = Math.max(0, Math.min(255, Math.round((r - (1 - aNorm) * bgNavy[0]) / aNorm)));
          const ug = Math.max(0, Math.min(255, Math.round((g - (1 - aNorm) * bgNavy[1]) / aNorm)));
          const ub = Math.max(0, Math.min(255, Math.round((b - (1 - aNorm) * bgNavy[2]) / aNorm)));

          botPixels[dstIdx] = ur;
          botPixels[dstIdx + 1] = ug;
          botPixels[dstIdx + 2] = ub;
          botPixels[dstIdx + 3] = alpha;
        } else {
          botPixels[dstIdx] = r;
          botPixels[dstIdx + 1] = g;
          botPixels[dstIdx + 2] = b;
          botPixels[dstIdx + 3] = 255;
        }
      }
    }
  }

  // Save preview images first
  const topWebp = await sharp(topPixels, { raw: { width: W, height: H_half, channels: 4 } }).webp({ quality: 98 }).toBuffer();
  const botWebp = await sharp(botPixels, { raw: { width: W, height: H_half, channels: 4 } }).webp({ quality: 98 }).toBuffer();

  const previewDir = path.resolve('C:/Users/Admin/.gemini/antigravity-ide/brain/0534ff2c-bec7-48f8-b598-9a78fa1922b4');
  fs.writeFileSync(path.join(previewDir, 'preview-top.webp'), topWebp);
  fs.writeFileSync(path.join(previewDir, 'preview-bot.webp'), botWebp);

  console.log('Saved preview-top.webp and preview-bot.webp to brain directory!');
}

processLogos().catch(console.error);
