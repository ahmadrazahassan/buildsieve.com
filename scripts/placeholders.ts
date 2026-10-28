// Lists open "{{NAME}}" placeholders in site.config.ts and the docs.
import { readFileSync } from "node:fs";

const files = ["site.config.ts"];
const found = new Map<string, string[]>();
for (const f of files) {
  for (const m of readFileSync(f, "utf8").matchAll(/\{\{([A-Z_]+)\}\}/g)) {
    found.set(m[1], [...(found.get(m[1]) ?? []), f]);
  }
}
if (found.size === 0) console.log("No open placeholders.");
else {
  console.log(`${found.size} open placeholder(s):`);
  for (const [name, where] of found) console.log(`  {{${name}}}  (${[...new Set(where)].join(", ")})`);
}
