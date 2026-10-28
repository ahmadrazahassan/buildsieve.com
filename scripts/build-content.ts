// Validates every content file, runs the build guards and writes the typed bundle
// the app imports. Any error fails the build: nothing is skipped silently.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";
import { parse } from "yaml";
import type { ZodType } from "zod";
import { factItems } from "../lib/facts.ts";
import { checkAffiliateLinks, checkGuards, lintCopy } from "../lib/guards.ts";
import {
  affiliateLinkSchema,
  categorySchema,
  comparisonSchema,
  glossarySchema,
  guideSchema,
  toolSchema,
  useCaseSchema,
} from "../lib/schema.ts";
import { researchScore } from "../lib/score.ts";

const root = process.cwd();
const errors: string[] = [];
const today = process.env.BUILD_DATE ?? new Date().toISOString().slice(0, 10); // UTC
const showDrafts = process.argv.includes("--drafts");

function load<T>(dir: string, schema: ZodType<T>, key = "slug"): T[] {
  const full = join(root, "content", dir);
  if (!existsSync(full)) return [];
  return readdirSync(full)
    .filter((f) => f.endsWith(".yaml"))
    .flatMap((file) => {
      const path = `content/${dir}/${file}`;
      const text = readFileSync(join(full, file), "utf8");
      // Flow style splits values at commas, so content YAML is block style only.
      text.split("\n").forEach((line, i) => {
        if (/^\s*(-\s+)?[\w-]*:?\s*[[{]/.test(line) && !/^\s*(-\s+)?[\w-]+:\s*"/.test(line)) {
          errors.push(`${path}:${i + 1} flow style YAML is not allowed`);
        }
      });
      const result = schema.safeParse(parse(text));
      if (!result.success) {
        for (const issue of result.error.issues) errors.push(`${path}: ${issue.path.join(".")} ${issue.message}`);
        return [];
      }
      const data = result.data as T & Record<string, string>;
      if (data[key] !== basename(file, ".yaml")) errors.push(`${path}: file name must equal ${key} "${data[key]}"`);
      for (const msg of lintCopy(text)) errors.push(`${path}: ${msg}`);
      return [data];
    });
}

const tools = load("tools", toolSchema);
const categories = load("categories", categorySchema);
const comparisons = load("comparisons", comparisonSchema);
const useCases = load("use-cases", useCaseSchema);
const guides = load("guides", guideSchema);
const glossary = load("glossary", glossarySchema);
const affiliateLinks = load("affiliate-links", affiliateLinkSchema, "tool");

errors.push(...checkGuards({ tools, categories, comparisons, useCases, guides, glossary, today }));
errors.push(...checkAffiliateLinks(affiliateLinks, tools, today));

// Logos: the file must exist and be listed with its source in docs/LOGOS.md.
const logosDoc = readFileSync(join(root, "docs", "LOGOS.md"), "utf8");
for (const t of tools) {
  if (!t.logo) continue;
  if (t.logo.accessed > today) errors.push(`content/tools/${t.slug}.yaml: logo date ${t.logo.accessed} is in the future (UTC today ${today})`);
  if (!existsSync(join(root, "public", t.logo.file))) errors.push(`content/tools/${t.slug}.yaml: logo file public${t.logo.file} does not exist`);
  if (!logosDoc.includes(`public${t.logo.file}`)) errors.push(`content/tools/${t.slug}.yaml: logo ${t.logo.file} is not listed in docs/LOGOS.md`);
}

for (const t of tools) {
  for (const id of Object.keys(t.facts)) {
    const known = t.categories.some((c) => factItems[c]?.some((i) => i.id === id));
    if (!known) errors.push(`content/tools/${t.slug}.yaml: fact "${id}" is not in the item list of its categories`);
  }
}

if (errors.length) {
  console.error(`Content validation failed with ${errors.length} error(s):\n- ${errors.join("\n- ")}`);
  process.exit(1);
}

const visible = <T extends { status: string }>(items: T[]) => items.filter((i) => showDrafts || i.status === "published");
const pubTools = visible(tools).filter((t) => showDrafts || t.verification === "verified");

const scores: Record<string, Record<string, ReturnType<typeof researchScore>>> = {};
for (const t of pubTools) {
  scores[t.slug] = {};
  for (const c of t.categories) scores[t.slug][c] = researchScore(t, c);
}

const bundle = {
  buildDate: today,
  showDrafts,
  tools: pubTools,
  scores,
  categories: visible(categories)
    .filter((c) => showDrafts || pubTools.filter((t) => t.categories.includes(c.slug)).length >= 5)
    .toSorted((a, b) => a.order - b.order),
  comparisons: visible(comparisons).filter((c) => c.tools.every((s) => pubTools.some((t) => t.slug === s))),
  useCases: visible(useCases),
  guides: visible(guides).toSorted((a, b) => b.published.localeCompare(a.published)),
  glossary: visible(glossary).toSorted((a, b) => a.term.localeCompare(b.term)),
  // Only which tools have an active program; the affiliate URLs themselves stay server side.
  affiliateTools: affiliateLinks.filter((l) => l.active).map((l) => l.tool),
};

const searchIndex = [
  ...bundle.tools.map((t) => ({ type: "Tool", title: t.name, text: t.summary, href: `/reviews/${t.slug}` })),
  ...bundle.categories.map((c) => ({ type: "Category", title: c.name, text: c.intro, href: `/best/${c.slug}` })),
  ...bundle.comparisons.map((c) => ({ type: "Comparison", title: c.title, text: c.description, href: `/compare/${c.slug}` })),
  ...bundle.useCases.map((u) => ({ type: "Best for", title: u.title, text: u.description, href: `/best-for/${u.slug}` })),
  ...bundle.guides.map((g) => ({ type: "Guide", title: g.title, text: g.description, href: `/guides/${g.slug}` })),
  ...bundle.glossary.map((g) => ({ type: "Glossary", title: g.term, text: g.definition[0], href: `/glossary/${g.slug}` })),
];

mkdirSync(join(root, ".generated"), { recursive: true });
writeFileSync(join(root, ".generated", "content.json"), JSON.stringify(bundle));
writeFileSync(join(root, ".generated", "search-index.json"), JSON.stringify(searchIndex));
// Read only by the /go route handler.
writeFileSync(join(root, ".generated", "affiliate-links.json"), JSON.stringify(affiliateLinks));
console.log(
  `Content OK: ${bundle.tools.length} tools, ${bundle.categories.length} categories, ${bundle.comparisons.length} comparisons, ` +
    `${bundle.useCases.length} best-for pages, ${bundle.guides.length} guides, ${bundle.glossary.length} terms, ${bundle.affiliateTools.length} active affiliate links (date ${today}).`,
);
