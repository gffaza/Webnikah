import { readFileSync, readdirSync, statSync } from "node:fs";

const svg = readFileSync("public/bg 2.svg", "utf8");

// Figma export: masked rects with pattern fills — capture geometry
const rects = [...svg.matchAll(/<rect\b([^>]*)\/?>/g)].map((m, i) => {
  const attrs = Object.fromEntries(
    [...m[1].matchAll(/([a-zA-Z_:]+)="([^"]*)"/g)].map((a) => [a[1], a[2]]),
  );
  return {
    i,
    x: +attrs.x || 0,
    y: +attrs.y || 0,
    w: +attrs.width || 0,
    h: +attrs.height || 0,
    fill: attrs.fill || "",
    transform: attrs.transform || "",
  };
});

console.log("bg 2.svg rect count", rects.length);
console.log(
  "large rects (likely layers):",
  rects
    .filter((r) => r.w * r.h > 80_000)
    .sort((a, b) => b.w * b.h - a.w * b.h)
    .slice(0, 20)
    .map((r) => ({
      ...r,
      pct: {
        x: ((r.x / 1080) * 100).toFixed(1) + "%",
        y: ((r.y / 1920) * 100).toFixed(1) + "%",
        w: ((r.w / 1080) * 100).toFixed(1) + "%",
        h: ((r.h / 1920) * 100).toFixed(1) + "%",
      },
    })),
);

// Paths that might be the peach arch
const paths = [...svg.matchAll(/<path\b([^>]*)\/?>/g)].slice(0, 15).map((m) => {
  const fill = m[1].match(/fill="([^"]+)"/)?.[1];
  const d = m[1].match(/d="([^"]{0,80})/)?.[1];
  return { fill, d };
});
console.log("sample paths", paths.filter((p) => p.fill && p.fill !== "none").slice(0, 10));

console.log("\n--- public/asset ---");
for (const f of readdirSync("public/asset").sort()) {
  const p = `public/asset/${f}`;
  const st = statSync(p);
  const t = readFileSync(p, "utf8");
  const vb = t.match(/viewBox="([^"]+)"/)?.[1];
  const wh = t.match(/width="([^"]+)"[^>]*height="([^"]+)"/);
  const images = (t.match(/<image /g) || []).length;
  const patterns = (t.match(/<pattern /g) || []).length;
  console.log(
    JSON.stringify({
      f,
      kb: +(st.size / 1024).toFixed(1),
      viewBox: vb,
      w: wh?.[1],
      h: wh?.[2],
      images,
      patterns,
    }),
  );
}
