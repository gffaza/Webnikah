import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import sharp from "sharp";

mkdirSync("public/images/parts", { recursive: true });

const text = readFileSync("public/7.svg", "utf8");
const matches = [...text.matchAll(/href="(data:image\/(?:png|jpeg|webp);base64,[^"]+)"/g)];
console.log("7.svg images", matches.length);

const seen = new Map();
for (let i = 0; i < matches.length; i++) {
  const buf = Buffer.from(matches[i][1].split(",")[1], "base64");
  const meta = await sharp(buf).metadata();
  const key = `${meta.width}x${meta.height}:${buf.length}`;
  if (seen.has(key)) continue;
  seen.set(key, true);
  const out = `public/images/parts/from7-${meta.width}x${meta.height}-${i}.png`;
  await sharp(buf).png().toFile(out);
  console.log(out, meta.hasAlpha ? "A" : "RGB", (buf.length / 1024).toFixed(0) + "kb");
}

// Also dump unique from 5.svg
const text5 = readFileSync("public/5.svg", "utf8");
const matches5 = [...text5.matchAll(/href="(data:image\/(?:png|jpeg|webp);base64,[^"]+)"/g)];
console.log("5.svg images", matches5.length);
const seen5 = new Map();
for (let i = 0; i < matches5.length; i++) {
  const buf = Buffer.from(matches5[i][1].split(",")[1], "base64");
  const meta = await sharp(buf).metadata();
  const key = `${meta.width}x${meta.height}:${buf.length}`;
  if (seen5.has(key)) continue;
  seen5.set(key, true);
  const out = `public/images/parts/from5-${meta.width}x${meta.height}-${i}.png`;
  await sharp(buf).png().toFile(out);
  console.log(out, meta.hasAlpha ? "A" : "RGB", (buf.length / 1024).toFixed(0) + "kb");
}
