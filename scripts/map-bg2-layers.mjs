/**
 * Map bg 2.svg pattern fills → embed dimensions + estimated role,
 * and dump mask/group structure for layout rebuild.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import sharp from "sharp";

mkdirSync(".shots", { recursive: true });
const svg = readFileSync("public/bg 2.svg", "utf8");

// pattern id → image href
const patterns = new Map();
for (const m of svg.matchAll(/<pattern id="([^"]+)"[^>]*>([\s\S]*?)<\/pattern>/g)) {
  const id = m[1];
  const href = m[2].match(/href="(data:image\/[^"]+)"/)?.[1];
  const iw = m[2].match(/width="([^"]+)"/)?.[1];
  const ih = m[2].match(/height="([^"]+)"/)?.[1];
  patterns.set(id, { href, iw, ih });
}

const embeds = new Map(); // key size+len → buffer meta
async function embedMeta(href) {
  if (!href?.startsWith("data:")) return null;
  const buf = Buffer.from(href.split(",")[1], "base64");
  const key = `${buf.length}`;
  if (embeds.has(key)) return embeds.get(key);
  const meta = await sharp(buf).metadata();
  const info = {
    w: meta.width,
    h: meta.height,
    kb: Math.round(buf.length / 1024),
    hasAlpha: meta.hasAlpha,
    key,
  };
  embeds.set(key, info);
  return info;
}

// Collect unique pattern image sizes
const patternInfo = [];
for (const [id, p] of patterns) {
  const meta = await embedMeta(p.href);
  patternInfo.push({ id, patternWH: `${p.iw}x${p.ih}`, ...meta });
}
console.log("unique embeds by size:");
const bySize = new Map();
for (const p of patternInfo) {
  if (!p.w) continue;
  const k = `${p.w}x${p.h}`;
  if (!bySize.has(k)) bySize.set(k, { ...p, count: 0, ids: [] });
  bySize.get(k).count++;
  bySize.get(k).ids.push(p.id);
}
for (const [k, v] of bySize) {
  console.log(k, "x" + v.count, v.kb + "KB", "alpha=" + v.hasAlpha);
}

// Asset folder dims for matching
const assetDims = {
  "Frame 38": "707x562", // faint vine
  "Frame 40": "420x431", // lilies (viewBox) but embed larger
  "Frame 41": "604x611", // hanging vine svg paths
  "Frame 42": "993x616", // joglo
  "Frame 46": "167x189", // side butterfly
  "Clip path group-1": "353x283", // pink butterfly
  "aset": "416x639", // flower vine
  "Frame 44": "1296x2304", // possibly gunungan/full
  "Frame 39": "934x1080",
  "Frame 43": "427x308",
  "Frame 45": "431x160",
};
console.log("\nasset viewBoxes", assetDims);

// Dump every masked image-ish rect with fill pattern + transform for layout JSON
const layers = [];
for (const m of svg.matchAll(/<rect\b([^>]*)\/?>/g)) {
  const attrs = Object.fromEntries(
    [...m[1].matchAll(/([a-zA-Z_:]+)="([^"]*)"/g)].map((a) => [a[1], a[2]]),
  );
  const fill = attrs.fill || "";
  const pid = fill.match(/url\(#([^)]+)\)/)?.[1];
  if (!pid) continue;
  const p = patterns.get(pid);
  const meta = p ? await embedMeta(p.href) : null;
  layers.push({
    x: +attrs.x || 0,
    y: +attrs.y || 0,
    w: +attrs.width || 0,
    h: +attrs.height || 0,
    transform: attrs.transform || "",
    pattern: pid,
    embed: meta ? `${meta.w}x${meta.h}` : null,
    kb: meta?.kb,
  });
}

// Deduplicate mask+color pairs (consecutive same geom)
const unique = [];
for (const L of layers) {
  const prev = unique[unique.length - 1];
  if (prev && prev.x === L.x && prev.y === L.y && prev.w === L.w && prev.h === L.h && prev.transform === L.transform) {
    prev.pair = true; // mask+color
    continue;
  }
  unique.push({ ...L, pair: false });
}

writeFileSync(".shots/bg2-layers.json", JSON.stringify(unique, null, 2));
console.log("\nunique visual layers", unique.length);
for (const L of unique) {
  const cx = L.x + L.w / 2;
  const cy = L.y + L.h / 2;
  // rough role guess by embed size + position
  let role = "?";
  if (L.embed === "1462x1170" || (L.w > 350 && L.w < 400 && L.y < 0)) role = "pink-butterfly";
  else if (L.w > 700 || L.embed?.startsWith("1892")) role = "faint-vine";
  else if (L.w > 600 && L.h > 600) role = "lilies";
  else if (L.w > 280 && L.w < 320) role = "flower-vine";
  else if (L.embed?.includes("800") || L.embed?.includes("760")) role = "gunungan?";
  console.log(
    role.padEnd(16),
    `embed=${L.embed || "-"}`.padEnd(18),
    `xy=${L.x.toFixed(0)},${L.y.toFixed(0)}`.padEnd(16),
    `wh=${L.w.toFixed(0)}x${L.h.toFixed(0)}`.padEnd(14),
    L.transform ? L.transform.slice(0, 60) : "no-transform",
  );
}
