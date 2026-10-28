// Fails on any font family other than the two brand fonts, on gradients, and on colors outside the tokens.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const dir = ".next/static";
const files: string[] = [];
const walk = (d: string) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith(".css")) files.push(p);
  }
};
walk(dir);

// next/font/local names the two brand faces after their variables (inter, googleSansFlex)
// and adds a metric-matched "<name> Fallback" face for each.
const allowedFonts = /^(var\(--font-[a-z]+\)|inherit|"?(inter|googleSansFlex)( Fallback)?"?)$/;
const tokens = new Set(["#0e7490", "#0b5a70", "#e3eff3", "#191919", "#f1f1f1", "#fff", "#ffffff", "#5c5c5c", "#dcdcdc", "#1e7a3a", "#b42318", "#a3a3a3"]);
const errors: string[] = [];

for (const f of files) {
  const css = readFileSync(f, "utf8");
  for (const m of css.matchAll(/font-family:([^;}]+)/g)) {
    for (const fam of m[1].split(",").map((s) => s.trim())) {
      if (!allowedFonts.test(fam)) errors.push(`${f}: font-family "${fam}"`);
    }
  }
  if (/gradient\(/.test(css)) errors.push(`${f}: gradient found`);
  for (const m of css.matchAll(/#[0-9a-fA-F]{3,8}\b/g)) {
    const hex = m[0].toLowerCase();
    if (hex === "#0000") continue; // transparent
    // Opacity variants of a token (for example ink at 40%) are allowed.
    const base = hex.length === 5 ? hex.slice(0, 4) : hex.length === 9 ? hex.slice(0, 7) : hex;
    if (!tokens.has(base)) errors.push(`${f}: color ${hex} is not a token`);
  }
}

if (errors.length) {
  console.error(`check:css failed:\n- ${[...new Set(errors)].join("\n- ")}`);
  process.exit(1);
}
console.log(`check:css OK (${files.length} file(s)).`);
