import "server-only";
import links from "@/.generated/affiliate-links.json";
import { resolveGo } from "@/lib/affiliate";
import { getTool } from "@/lib/content";
import type { AffiliateLink } from "@/lib/schema";
import { siteConfig } from "@/site.config";

// Every outbound vendor link on the site goes through this redirect.
export async function GET(request: Request, ctx: RouteContext<"/go/[slug]">) {
  const { slug } = await ctx.params;
  const url = new URL(request.url);
  const from = url.searchParams.get("from");
  const ad = url.searchParams.get("ad");
  const target = resolveGo({
    slug,
    from,
    pos: url.searchParams.get("pos"),
    ad,
    tool: getTool(slug),
    links: links as AffiliateLink[],
    enabled: siteConfig.flags.affiliateLinks,
    origin: url.origin,
  });
  // Anonymous click count: tool, kind and page area only. No IP, cookie or user agent.
  // The network counts its own click when the browser follows the 307 to its tracking URL.
  console.info(JSON.stringify({ event: "outbound_click", tool: slug, kind: target.kind, from, ad }));
  return new Response(null, {
    status: 307,
    headers: {
      Location: target.url,
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "no-store",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
  });
}
