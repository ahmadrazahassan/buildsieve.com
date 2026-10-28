// Pages read content only through these functions, never from files.
import bundle from "../.generated/content.json";
import { siteConfig } from "../site.config.ts";
import { cheapestPaidPlan } from "./cost.ts";
import type { Category, Comparison, GlossaryTerm, Guide, Tool, UseCase } from "./schema.ts";
import type { ScoreResult } from "./score.ts";

type Bundle = {
  buildDate: string;
  showDrafts: boolean;
  tools: Tool[];
  scores: Record<string, Record<string, ScoreResult>>;
  categories: Category[];
  comparisons: Comparison[];
  useCases: UseCase[];
  guides: Guide[];
  glossary: GlossaryTerm[];
  affiliateTools: string[];
  affiliateAds: Record<string, string[]>;
};

const data = bundle as unknown as Bundle;

export const buildDate = data.buildDate;
export const showDrafts = data.showDrafts;

export const getTools = () => data.tools;
export const getTool = (slug: string) => data.tools.find((t) => t.slug === slug);
export const getCategories = () => data.categories;
export const getCategory = (slug: string) => data.categories.find((c) => c.slug === slug);
export const getComparisons = () => data.comparisons;
export const getComparison = (slug: string) => data.comparisons.find((c) => c.slug === slug);
export const getUseCases = () => data.useCases;
export const getUseCase = (slug: string) => data.useCases.find((u) => u.slug === slug);
export const getGuides = () => data.guides;
export const getGuide = (slug: string) => data.guides.find((g) => g.slug === slug);
export const getGlossary = () => data.glossary;
export const getTerm = (slug: string) => data.glossary.find((g) => g.slug === slug);

/** Main category of a tool that is live on the site. */
export function mainCategory(tool: Tool): Category | undefined {
  return tool.categories.map(getCategory).find(Boolean);
}

export function getScore(tool: Tool, category?: string): ScoreResult | undefined {
  const c = category ?? mainCategory(tool)?.slug ?? tool.categories[0];
  return data.scores[tool.slug]?.[c];
}

export function scoreValue(tool: Tool, category?: string): number {
  return getScore(tool, category)?.score ?? 0;
}

export function toolsInCategory(slug: string): Tool[] {
  return data.tools
    .filter((t) => t.categories.includes(slug))
    .toSorted((a, b) => scoreValue(b, slug) - scoreValue(a, slug) || a.name.localeCompare(b.name));
}

export function topTools(n: number): Tool[] {
  return data.tools.toSorted((a, b) => scoreValue(b) - scoreValue(a) || a.name.localeCompare(b.name)).slice(0, n);
}

/** Alternatives: same main category, ordered by score, never by commercial status. */
export function getAlternatives(slug: string, n = 4): Tool[] {
  const tool = getTool(slug);
  if (!tool) return [];
  const cat = mainCategory(tool)?.slug;
  return cat ? toolsInCategory(cat).filter((t) => t.slug !== slug).slice(0, n) : [];
}

/** "Best for" list computed from the rule, never hand picked. */
export function listUseCaseTools(u: UseCase): Tool[] {
  return data.tools
    .filter((t) => u.rule.build.some((b) => t.build.includes(b)))
    .filter((t) => u.rule.requireFacts.every((f) => !["unknown", "no", undefined].includes(t.facts[f]?.value)))
    .toSorted((a, b) => scoreValue(b) - scoreValue(a) || a.name.localeCompare(b.name));
}

export function comparisonsFor(slug: string): Comparison[] {
  return data.comparisons.filter((c) => c.tools.includes(slug));
}

export const fromPlan = (tool: Tool) => cheapestPaidPlan(tool.plans);

/** True when the visitor's click on this tool's button can earn a commission. */
export const hasAffiliate = (slug: string) => siteConfig.flags.affiliateLinks && data.affiliateTools.includes(slug);
export const anyAffiliate = () => siteConfig.flags.affiliateLinks && data.affiliateTools.length > 0;
/** True when the tool's active program lists this network-hosted ad (banners render only then). */
export const hasAffiliateAd = (slug: string, ad: string) => hasAffiliate(slug) && (data.affiliateAds[slug] ?? []).includes(ad);
export const scoresBySlug = () => Object.fromEntries(data.tools.map((t) => [t.slug, scoreValue(t)]));
