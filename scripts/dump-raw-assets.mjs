import { mkdirSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import sharp from "sharp";

mkdirSync("public/images/parts/raw", { recursive: true });

for (const f of readdirSync("public/asset")) {
  if (!f.endsWith(".svg")) continue;
  const text = readFileSync(`public/asset/${f}`, "utf8");
  const safe = f.replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/-+$/g, "");
  const viewBox = text.match(/viewBox="([^"]+)"/)?.[1];
  const matches = [...text.matchAll(/href="(data:image\/(?:png|jpeg|webp);base64,[^"]+)"/g)];
  const pathCount = (text.match(/<path /g) || []).length;
  console.log(safe, { viewBox, images: matches.length, paths: pathCount, kb: +(Buffer.byteLength(text) / 1024).toFixed(0) });

  for (let i = 0; i < matches.length; i++) {
    const buf = Buffer.from(matches[i][1].split(",")[1], "base64");
    const meta = await sharp(buf).metadata();
    const out = `public/images/parts/raw/${safe}-${i}.png`;
    await sharp(buf).png().toFile(out);
    console.log(" ", out, `${meta.width}x${meta.height}`, meta.hasAlpha ? "A" : "RGB");
  }
}
