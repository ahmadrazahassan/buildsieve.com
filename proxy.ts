import { NextResponse, type NextRequest } from "next/server";
import bundle from "./.generated/content.json";

// With Cache Components, notFound() after streaming started keeps status 200.
// Unknown slugs are rewritten to a path with no route so they return a real 404.
const known: Record<string, Set<string>> = {
  reviews: new Set(bundle.tools.map((t) => t.slug)),
  best: new Set(bundle.categories.map((c) => c.slug)),
  compare: new Set(bundle.comparisons.map((c) => c.slug)),
  "best-for": new Set(bundle.useCases.map((u) => u.slug)),
  guides: new Set(bundle.guides.map((g) => g.slug)),
  glossary: new Set(bundle.glossary.map((g) => g.slug)),
};
const toolSubpages = new Set(["pricing", "alternatives"]);

export function proxy(request: NextRequest) {
  const [section, slug, sub, ...rest] = request.nextUrl.pathname.split("/").filter(Boolean);
  const set = known[section];
  if (!set || !slug) return NextResponse.next();
  const ok = set.has(slug) && rest.length === 0 && (!sub || (section === "reviews" && toolSubpages.has(sub)));
  if (ok) return NextResponse.next();
  return NextResponse.rewrite(new URL("/__not-found", request.url));
}

export const config = {
  matcher: ["/reviews/:path+", "/best/:path+", "/compare/:path+", "/best-for/:path+", "/guides/:path+", "/glossary/:path+"],
};
