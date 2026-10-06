import { mkdirSync, readFileSync, writeFileSync, readdirSync } from "node:fs";
import sharp from "sharp";

mkdirSync("public/images/parts", { recursive: true });

async function extractEmbedded(svgPath, outBase) {
  const text = readFileSync(svgPath, "utf8");
  const matches = [...text.matchAll(/href="(data:image\/(?:png|jpeg|webp);base64,[^"]+)"/g)];
  console.log(svgPath, "embedded images:", matches.length);
  for (let i = 0; i < matches.length; i++) {
    const dataUrl = matches[i][1];
    const buf = Buffer.from(dataUrl.split(",")[1], "base64");
    const meta = await sharp(buf).metadata();
    const out = `public/images/parts/${outBase}-${i}.webp`;
    await sharp(buf).webp({ quality: 95 }).toFile(out);
    console.log(" ", out, `${meta.width}x${meta.height}`, meta.hasAlpha ? "alpha" : "no-alpha");
  }
}

for (const f of readdirSync("public/asset")) {
  if (!f.endsWith(".svg")) continue;
  const safe = f.replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/-+$/g, "");
  await extractEmbedded(`public/asset/${f}`, safe);
}
