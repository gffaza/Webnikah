import { readdirSync, readFileSync, statSync } from "node:fs";

for (const f of ["public/5.svg", "public/7.svg", "public/bg.svg", "public/bg 2.svg"]) {
  console.log(f, (statSync(f).size / 1024 / 1024).toFixed(1) + "MB");
}

console.log("--- assets ---");
for (const f of readdirSync("public/asset")) {
  const p = `public/asset/${f}`;
  const st = statSync(p);
  const text = readFileSync(p, "utf8");
  const images = [...text.matchAll(/<(?:image|rect)[^>]*(?:xlink:href|href)="([^"]{0,80})/g)].map(
    (m) => m[1].slice(0, 60),
  );
  const viewBox = text.match(/viewBox="([^"]+)"/)?.[1];
  const dims = text.match(/width="([^"]+)"[^>]*height="([^"]+)"/);
  console.log(
    JSON.stringify({
      f,
      kb: +(st.size / 1024).toFixed(1),
      viewBox,
      w: dims?.[1],
      h: dims?.[2],
      imageCount: (text.match(/<image /g) || []).length,
      patternCount: (text.match(/<pattern /g) || []).length,
      pathCount: (text.match(/<path /g) || []).length,
      sampleHref: images[0] ?? null,
    }),
  );
}
