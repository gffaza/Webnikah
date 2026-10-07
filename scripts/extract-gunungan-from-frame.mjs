/**
 * Pull a full gunungan watermark from Frame 31 (design reference).
 * Isolates darker ornament from the peach pill so we get a complete triangle.
 */
import { mkdirSync } from "node:fs";
import sharp from "sharp";

mkdirSync(".shots", { recursive: true });
mkdirSync("public/images/parts", { recursive: true });

const src = "public/Frame 31.png";
const meta = await sharp(src).metadata();
console.log("frame", meta.width, meta.height);

// Crop center arch region where gunungan lives (approx from Figma frame)
const left = Math.round(meta.width * 0.14);
const top = Math.round(meta.height * 0.12);
const width = Math.round(meta.width * 0.72);
const height = Math.round(meta.height * 0.7);

const { data, info } = await sharp(src)
  .extract({ left, top, width, height })
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

// Peach pill ≈ #EFB3A6 (239,179,166). Keep pixels that differ enough (ornament).
const peach = { r: 239, g: 179, b: 166 };
const out = Buffer.alloc(data.length);
for (let i = 0; i < data.length; i += 4) {
  const r = data[i],
    g = data[i + 1],
    b = data[i + 2];
  const dr = r - peach.r;
  const dg = g - peach.g;
  const db = b - peach.b;
  const dist = Math.sqrt(dr * dr + dg * dg + db * db);
  // Also drop near-white cream outside the pill
  const luma = (r + g + b) / 3;
  const isCream = luma > 235 && Math.abs(r - g) < 20;
  const isPeachish = dist < 28 && r > 200 && g > 140 && b > 130;
  if (isCream || isPeachish) {
    out[i] = out[i + 1] = out[i + 2] = 0;
    out[i + 3] = 0;
  } else {
    out[i] = r;
    out[i + 1] = g;
    out[i + 2] = b;
    // Soften alpha for watermark look
    out[i + 3] = Math.min(220, data[i + 3]);
  }
}

await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
  .png()
  .toFile(".shots/gunungan-extracted.png");

await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
  .resize({ width: 800, withoutEnlargement: true })
  .webp({ quality: 85, alphaQuality: 95 })
  .toFile("public/images/parts/gunungan.webp");

const m = await sharp("public/images/parts/gunungan.webp").metadata();
console.log("wrote gunungan.webp", `${m.width}x${m.height}`);
