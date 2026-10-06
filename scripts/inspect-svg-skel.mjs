import { readFileSync } from "node:fs";

for (const f of ["public/5.svg", "public/7.svg", "public/asset/Clip path group-1.svg", "public/asset/Frame 40.svg", "public/asset/5 913261358.svg"]) {
  const t = readFileSync(f, "utf8");
  const stripped = t.replace(/data:image\/[a-z+]+;base64,[A-Za-z0-9+/=]+/g, "DATA");
  console.log("\n===", f, "len", t.length);
  console.log("viewBox", (t.match(/viewBox="[^"]+"/) || [])[0]);
  console.log("data images", (t.match(/data:image/g) || []).length);
  console.log("asset hrefs", [...t.matchAll(/(?:xlink:)?href="([^"]+)"/g)].map((m) => m[1].slice(0, 80)).slice(0, 15));
  console.log("skeleton head:\n", stripped.slice(0, 800));
}
