import { readFileSync, writeFileSync } from "node:fs";

const t = readFileSync("public/5.svg", "utf8").replace(/href="data:[^"]+"/g, 'href="DATA"');
const parts = [...t.matchAll(/<(?:g|image|rect|use|path|mask|clipPath|pattern)\b[^>]{0,500}/g)].slice(0, 150);
writeFileSync(
  "public/5.tags.txt",
  parts.map((m, i) => `${i} ${m[0].replace(/\s+/g, " ").slice(0, 300)}`).join("\n"),
);
console.log("wrote public/5.tags.txt", parts.length, "tags");

const t7 = readFileSync("public/7.svg", "utf8").replace(/href="data:[^"]+"/g, 'href="DATA"');
const parts7 = [...t7.matchAll(/<(?:g|image|rect|use|path|mask|clipPath|pattern)\b[^>]{0,500}/g)].slice(0, 150);
writeFileSync(
  "public/7.tags.txt",
  parts7.map((m, i) => `${i} ${m[0].replace(/\s+/g, " ").slice(0, 300)}`).join("\n"),
);
console.log("wrote public/7.tags.txt", parts7.length, "tags");
