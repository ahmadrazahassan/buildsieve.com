import { goPlaces } from "./routes.ts";
import type { AffiliateLink, Tool } from "./schema.ts";

export type GoTarget = { url: string; kind: "affiliate" | "direct" | "unknown" };

/**
 * Pure resolver for /go/[slug]. Every outbound vendor link on the site goes through it.
 * - Active affiliate link and the affiliateLinks flag on: the affiliate URL, or the network-hosted
 *   ad named by `ad` when the link lists it, with a sub id built only from whitelisted `from`
 *   values and a numeric `pos` (never personal data).
 * - Otherwise: the vendor's own website from content data, without tracking.
 * - Unknown slug: the home page. Targets only ever come from content data (no open redirect).
 */
export function resolveGo(input: {
  slug: string;
  from: string | null;
  pos: string | null;
  ad?: string | null;
  tool: Tool | undefined;
  links: AffiliateLink[];
  enabled: boolean;
  origin: string;
}): GoTarget {
  const { slug, tool, links, enabled, origin } = input;
  if (!tool) return { url: `${origin}/`, kind: "unknown" };
  const link = links.find((l) => l.tool === slug && l.active);
  if (!enabled || !link) return { url: tool.website, kind: "direct" };
  const from = (goPlaces as readonly string[]).includes(input.from ?? "") ? input.from : "unknown";
  const pos = /^\d{1,2}$/.test(input.pos ?? "") ? input.pos : "0";
  const ad = link.ads?.find((a) => a.id === input.ad);
  const target = new URL(ad?.url ?? link.url);
  const subIdParam = ad ? ad.subIdParam : link.subIdParam;
  if (subIdParam) target.searchParams.set(subIdParam, `${from}-${pos}`);
  return { url: target.toString(), kind: "affiliate" };
}
