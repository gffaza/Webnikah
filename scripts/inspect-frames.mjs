import { readFileSync, statSync } from "node:fs";
import sharp from "sharp";

for (const f of [
  "Frame 39.svg",
  "Frame 43.svg",
  "Frame 44.svg",
  "Frame 41.svg",
  "Frame 45.svg",
  "aset.svg",
  "Frame 38.svg",
]) {
  const p = `public/asset/${f}`;
  const t = readFileSync(p, "utf8");
  const embeds = [...t.matchAll(/href="(data:image\/[^"]+)"/g)];
  const paths = (t.match(/<path /g) || []).length;
  console.log(f, {
    kb: +(statSync(p).size / 1024).toFixed(0),
    embeds: embeds.length,
    paths,
  });
  for (let i = 0; i < embeds.length; i++) {
    const buf = Buffer.from(embeds[i][1].split(",")[1], "base64");
    const m = await sharp(buf).metadata();
    console.log(" ", i, `${m.width}x${m.height}`, Math.round(buf.length / 1024) + "KB");
  }
}
