import type { MetadataRoute } from "next";
import { buildDate, getCategories, getComparisons, getGlossary, getGuides, getTools, getUseCases } from "@/lib/content";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/site.config";

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (path: string, lastModified = buildDate) => ({ url: `${siteConfig.url}${path === "/" ? "" : path}`, lastModified });
  return [
    u("/"),
    u(routes.categories()),
    u(routes.compareTool()),
    u(routes.finder()),
    u(routes.costCalculator()),
    u(routes.guides()),
    u(routes.glossary()),
    u(routes.methodology()),
    u(routes.money()),
    u(routes.editorial()),
    u(routes.team()),
    u(routes.about()),
    u(routes.contact()),
    u(routes.privacy()),
    u(routes.terms()),
    u(routes.accessibility()),
    ...getCategories().map((c) => u(routes.category(c.slug))),
    ...getTools().flatMap((t) => [u(routes.tool(t.slug), t.lastReviewed), u(routes.toolPricing(t.slug), t.lastReviewed)]),
    ...getComparisons().map((c) => u(routes.comparison(c.slug), c.updated)),
    ...getUseCases().map((x) => u(routes.useCase(x.slug), x.updated)),
    ...getGuides().map((g) => u(routes.guide(g.slug), g.updated)),
    ...getGlossary().map((g) => u(routes.term(g.slug))),
  ];
}
