import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";

async function skim(file, maxLines = 80) {
  console.log("\n====", file, "====");
  const rl = createInterface({ input: createReadStream(file, { encoding: "utf8" }), crlfDelay: Infinity });
  let i = 0;
  let depth = 0;
  for await (const line of rl) {
    // Skip enormous base64 lines
    if (line.length > 500) {
      const tag = line.match(/<\/?[a-zA-Z0-9:_-]+/)?.[0] ?? "[long]";
      if (i < maxLines) console.log(`${String(i).padStart(4)} ${"  ".repeat(Math.min(depth, 8))}${tag}... (${line.length} chars)`);
      i++;
      continue;
    }
    const open = (line.match(/<[a-zA-Z]/g) || []).length;
    const close = (line.match(/<\//g) || []).length;
    const self = (line.match(/\/>/g) || []).length;
    if (i < maxLines || /<(svg|g |image |use |rect |path |defs)/.test(line)) {
      if (i < maxLines) console.log(`${String(i).padStart(4)} ${line.slice(0, 200)}`);
    }
    depth += open - close - self;
    if (depth < 0) depth = 0;
    i++;
    if (i > 2000) break;
  }
}

await skim("public/5.svg", 60);
await skim("public/7.svg", 60);
