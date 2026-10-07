/**
 * Compress public/galery/*.jpg → sibling .webp (max width 1200).
 * Run: node scripts/optimize-gallery.mjs
 */
import { readdirSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const dir = "public/galery";
const files = readdirSync(dir).filter((f) => /\.jpe?g$/i.test(f));

for (const file of files) {
  const src = path.join(dir, file);
  const out = path.join(dir, file.replace(/\.jpe?g$/i, ".webp"));
  const meta = await sharp(src).metadata();
  await sharp(src)
    .rotate()
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 78 })
    .toFile(out);
  const outMeta = await sharp(out).metadata();
  const { size: inSize } = await import("node:fs").then((fs) => fs.statSync(src));
  const { size: outSize } = await import("node:fs").then((fs) => fs.statSync(out));
  console.log(
    file,
    `${meta.width}x${meta.height}`,
    `${Math.round(inSize / 1024)}KB →`,
    `${outMeta.width}x${outMeta.height}`,
    `${Math.round(outSize / 1024)}KB`,
  );
}

console.log("done — update content/wedding.ts paths to .webp if desired");
