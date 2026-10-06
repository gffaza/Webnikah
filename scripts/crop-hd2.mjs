import sharp from "sharp";
import { readFileSync } from "node:fs";

await sharp(".shots/hd2-cover.png")
  .extract({ left: 280, top: 20, width: 400, height: 280 })
  .toFile(".shots/hd2-bf.png");
await sharp(".shots/hd2-cover.png")
  .extract({ left: 0, top: 1400, width: 420, height: 400 })
  .toFile(".shots/hd2-lily.png");
await sharp("public/images/parts/pink-butterfly.png")
  .extract({ left: 400, top: 200, width: 400, height: 400 })
  .toFile(".shots/src-bf-detail.png");

const h = readFileSync(".shots/page.html", "utf8");
const m = [...h.matchAll(/src="([^"]+)"/g)]
  .map((x) => x[1])
  .filter((s) => /parts|asset/.test(s));
console.log([...new Set(m)].sort().join("\n"));
