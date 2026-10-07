/**
 * Downscale HD PNG parts → lean WebP for layered, independently animated backdrops.
 * Run: node scripts/optimize-parts.mjs
 */
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const parts = path.join(root, "public/images/parts");
mkdirSync(parts, { recursive: true });

/** maxWidth keeps phone decode cheap while staying sharp on 2–3x DPR. */
const jobs = [
  { src: "floral-frame.png", out: "floral-frame.webp", maxW: 1080, quality: 78 },
  { src: "lilies.png", out: "lilies.webp", maxW: 900, quality: 82 },
  { src: "pink-butterfly.png", out: "pink-butterfly.webp", maxW: 640, quality: 82 },
  { src: "side-butterfly.png", out: "side-butterfly.webp", maxW: 420, quality: 82 },
  { src: "joglo-house.png", out: "joglo-house.webp", maxW: 1000, quality: 82 },
  { src: "flower-vine.png", out: "flower-vine.webp", maxW: 480, quality: 82 },
  { src: "faint-vine.png", out: "faint-vine.webp", maxW: 800, quality: 80 },
  { src: "gunungan-raster.webp", out: "gunungan.webp", maxW: 700, quality: 80 },
];

for (const job of jobs) {
  const input = path.join(parts, job.src);
  const output = path.join(parts, job.out);
  const img = sharp(input);
  const meta = await img.metadata();
  const width = Math.min(job.maxW, meta.width || job.maxW);
  await sharp(input)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: job.quality, alphaQuality: 90 })
    .toFile(output);
  const outMeta = await sharp(output).metadata();
  const { size } = await import("node:fs").then((fs) => fs.statSync(output));
  console.log(
    job.out,
    `${meta.width}x${meta.height} → ${outMeta.width}x${outMeta.height}`,
    `${Math.round(size / 1024)}KB`,
  );
}

console.log("done");
