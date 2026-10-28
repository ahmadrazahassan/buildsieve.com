// Copy lint for UI strings: walks string literals and JSX text in app/ and components/
// through the TypeScript AST and applies the same rules as the content lint.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";
import { lintCopy } from "../lib/guards.ts";

// UI strings that must mention testing to say we do not do it.
const allowed = [/not hands-on tested/i, /not hands-on tests/i, /needs hands-on testing/i, /do not run hands-on tests/i, /hands-on testing, which this site does not do/i];

const files: string[] = [];
const walk = (d: string) => {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.tsx?$/.test(p)) files.push(p);
  }
};
["app", "components"].forEach(walk);

const errors: string[] = [];
for (const file of files) {
  const src = ts.createSourceFile(file, readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const visit = (node: ts.Node) => {
    let text: string | undefined;
    if (ts.isJsxText(node)) text = node.text;
    else if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) text = node.text;
    if (text && text.trim() && !allowed.some((r) => r.test(text!))) {
      for (const msg of lintCopy(text)) {
        const { line } = src.getLineAndCharacterOfPosition(node.getStart());
        errors.push(`${file}:${line + 1} ${msg}`);
      }
    }
    ts.forEachChild(node, visit);
  };
  visit(src);
}
if (errors.length) {
  console.error(`lint:copy failed:\n- ${errors.join("\n- ")}`);
  process.exit(1);
}
console.log(`lint:copy OK (${files.length} files).`);
