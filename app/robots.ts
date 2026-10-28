import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/go/", "/internal/", "/search", "/builder-finder/results", "/newsletter/confirm"];
  return {
    // Indexing stays off until launch content is published (launch checklist).
    rules: siteConfig.flags.indexing ? { userAgent: "*", allow: "/", disallow } : { userAgent: "*", disallow: "/" },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
