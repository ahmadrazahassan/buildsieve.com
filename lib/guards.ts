// Build guards and copy lint. Each guard is proven by a unit test in guards.test.ts.
import type { AffiliateLink, Category, Comparison, GlossaryTerm, Guide, Tool, UseCase } from "./schema.ts";

export const STALE_PRICE_DAYS = 60;
export const STALE_FACT_DAYS = 120;

export const bannedPhrases = [
  "revolutionary",
  "game-changer",
  "game changer",
  "game changing",
  "seamless",
  "seamlessly",
  "in today's digital age",
  "in today's fast-paced world",
  "let's dive in",
  "dive into",
  "delve",
  "unleash",
  "unlock the power",
  "elevate",
  "supercharge",
  "cutting-edge",
  "robust",
  "harness",
  "effortless",
  "tapestry",
  "look no further",
  "best-in-class",
  "world-class",
  "it's worth noting",
  "in conclusion",
  "guaranteed",
  "100% free",
];

// Research only: no test or experience claims in content.
export const testClaims = [
  /\bwe tested\b/i,
  /\btested\b/i,
  /\bhands-on\b/i,
  /\bwe tried\b/i,
  /\bin our test/i,
  /\bwe built a (site|app) with\b/i,
  /\bafter using it for\b/i,
  /\bour experience\b/i,
];

const britishSpellings = [/\bcolour/i, /\boptimis/i, /\borganis/i, /\bcatalogue\b/i, /\bfavourite/i, /\blicence\b/i, /\bcentre\b/i];

export function lintCopy(text: string): string[] {
  const out: string[] = [];
  const lower = text.toLowerCase();
  for (const p of bannedPhrases) if (lower.includes(p)) out.push(`banned phrase "${p}"`);
  for (const r of testClaims) if (r.test(text)) out.push(`test claim matches ${r}`);
  for (const r of britishSpellings) if (r.test(text)) out.push(`British spelling matches ${r}`);
  if (text.includes("—")) out.push("em dash found; use a comma, colon or period");
  if (/\p{Extended_Pictographic}/u.test(text)) out.push("emoji found");
  if (/heading:\s*"[^"]*!/.test(text)) out.push("exclamation mark in a heading");
  return out;
}

export function daysBetween(fromIso: string, toIso: string): number {
  return Math.round((Date.parse(`${toIso}T00:00:00Z`) - Date.parse(`${fromIso}T00:00:00Z`)) / 86_400_000);
}

type All = {
  tools: Tool[];
  categories: Category[];
  comparisons: Comparison[];
  useCases: UseCase[];
  guides: Guide[];
  glossary: GlossaryTerm[];
  today: string;
};

export function checkGuards({ tools, categories, comparisons, useCases, guides, glossary, today }: All): string[] {
  const e: string[] = [];
  const slugs = new Set<string>();
  const dup = (kind: string, s: string) => {
    const key = `${kind}:${s}`;
    if (slugs.has(key)) e.push(`duplicate ${kind} slug "${s}"`);
    slugs.add(key);
  };
  const future = (where: string, d: string) => {
    if (daysBetween(today, d) > 0) e.push(`${where}: date ${d} is in the future (UTC today ${today})`);
  };
  const categorySlugs = new Set(categories.map((c) => c.slug));
  const toolSlugs = new Set(tools.map((t) => t.slug));

  for (const t of tools) {
    const w = `tool ${t.slug}`;
    dup("tool", t.slug);
    future(w, t.published);
    future(w, t.lastReviewed);
    for (const c of t.categories) if (!categorySlugs.has(c)) e.push(`${w}: unknown category "${c}"`);
    if (t.status === "published") {
      for (const p of t.plans) {
        future(`${w} plan ${p.name}`, p.accessed);
        if (daysBetween(p.accessed, today) > STALE_PRICE_DAYS)
          e.push(`${w}: price "${p.name}" is older than ${STALE_PRICE_DAYS} days (${p.accessed}), re-verify it`);
      }
      for (const [id, f] of Object.entries(t.facts)) {
        if (f.accessed && daysBetween(f.accessed, today) > STALE_FACT_DAYS)
          e.push(`${w}: fact "${id}" is older than ${STALE_FACT_DAYS} days`);
        if (f.accessed) future(`${w} fact ${id}`, f.accessed);
      }
      if (t.plans.length === 0 && !t.pricingGap) e.push(`${w}: no plans and no pricingGap explanation`);
    }
    for (const c of t.changelog) future(`${w} changelog`, c.date);
  }
  for (const c of comparisons) {
    dup("comparison", c.slug);
    future(`comparison ${c.slug}`, c.published);
    for (const s of c.tools) if (!toolSlugs.has(s)) e.push(`comparison ${c.slug}: unknown tool "${s}"`);
  }
  for (const u of useCases) {
    dup("usecase", u.slug);
    future(`best-for ${u.slug}`, u.published);
  }
  for (const g of guides) {
    dup("guide", g.slug);
    future(`guide ${g.slug}`, g.published);
    for (const s of g.sections.flatMap((x) => x.tools ?? []))
      if (!toolSlugs.has(s)) e.push(`guide ${g.slug}: unknown tool "${s}"`);
  }
  const termSlugs = new Set(glossary.map((g) => g.slug));
  for (const g of glossary) {
    dup("term", g.slug);
    for (const r of g.related) if (!termSlugs.has(r)) e.push(`term ${g.slug}: unknown related term "${r}"`);
  }
  for (const c of categories) {
    dup("category", c.slug);
    for (const r of c.related) if (!categorySlugs.has(r)) e.push(`category ${c.slug}: unknown related "${r}"`);
  }
  return e;
}

/** Affiliate links: known tool, one link per tool, checked recently when active. */
export function checkAffiliateLinks(links: AffiliateLink[], tools: Tool[], today: string): string[] {
  const e: string[] = [];
  const seen = new Set<string>();
  for (const l of links) {
    const w = `affiliate link ${l.tool}`;
    if (!tools.some((t) => t.slug === l.tool)) e.push(`${w}: unknown tool`);
    if (seen.has(l.tool)) e.push(`${w}: more than one link for this tool`);
    seen.add(l.tool);
    if (daysBetween(today, l.checked) > 0 || daysBetween(today, l.added) > 0) e.push(`${w}: date is in the future`);
    if (l.active && daysBetween(l.checked, today) > STALE_PRICE_DAYS)
      e.push(`${w}: active link not checked for more than ${STALE_PRICE_DAYS} days`);
    const host = new URL(l.url).hostname;
    const ids = new Set<string>();
    for (const ad of l.ads ?? []) {
      if (ids.has(ad.id)) e.push(`${w}: duplicate ad id "${ad.id}"`);
      ids.add(ad.id);
      // Ads must use the same tracking domain as the program link, so ?ad= can never point elsewhere.
      if (new URL(ad.url).hostname !== host) e.push(`${w}: ad "${ad.id}" is not on the program's tracking domain ${host}`);
    }
  }
  return e;
}
