import type { Metadata } from "next";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/blocks";
import { SearchResults } from "@/components/search-results";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

export default function SearchPage() {
  return (
    <div className="container-site py-8">
      <Breadcrumbs items={[{ name: "Search", href: routes.search() }]} />
      <h1 className="mt-8 font-display text-h1 font-medium">Search</h1>
      <div className="mt-8">
        <Suspense fallback={<p className="text-muted">Loading search.</p>}>
          <SearchResults />
        </Suspense>
      </div>
    </div>
  );
}
