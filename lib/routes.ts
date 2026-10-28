// The one URL builder for every internal link.

export const routes = {
  home: () => "/",
  categories: () => "/categories",
  category: (slug: string) => `/best/${slug}`,
  tool: (slug: string) => `/reviews/${slug}`,
  toolPricing: (slug: string) => `/reviews/${slug}/pricing`,
  toolAlternatives: (slug: string) => `/reviews/${slug}/alternatives`,
  compareTool: (slugs: string[] = []) => (slugs.length ? `/compare?tools=${slugs.join(",")}` : "/compare"),
  comparison: (slug: string) => `/compare/${slug}`,
  useCase: (slug: string) => `/best-for/${slug}`,
  finder: () => "/builder-finder",
  finderResults: () => "/builder-finder/results",
  costCalculator: (tool?: string) => (tool ? `/cost-calculator?tool=${tool}` : "/cost-calculator"),
  guides: () => "/guides",
  guide: (slug: string) => `/guides/${slug}`,
  glossary: () => "/glossary",
  term: (slug: string) => `/glossary/${slug}`,
  methodology: () => "/methodology",
  money: () => "/how-we-make-money",
  editorial: () => "/editorial-policy",
  team: () => "/team",
  about: () => "/about",
  contact: () => "/contact",
  newsletter: () => "/newsletter",
  privacy: () => "/privacy",
  terms: () => "/terms",
  cookies: () => "/cookie-settings",
  accessibility: () => "/accessibility",
  search: (q?: string) => (q ? `/search?q=${encodeURIComponent(q)}` : "/search"),
  go: (slug: string, from: GoPlace, pos?: number, ad?: string) =>
    `/go/${slug}?from=${from}${pos !== undefined ? `&pos=${pos}` : ""}${ad ? `&ad=${ad}` : ""}`,
} as const;

export const goPlaces = [
  "profile",
  "pricing",
  "category",
  "compare",
  "finder",
  "home",
  "usecase",
  "comparison",
  "alternatives",
  "guide",
  "glossary",
] as const;
export type GoPlace = (typeof goPlaces)[number];
