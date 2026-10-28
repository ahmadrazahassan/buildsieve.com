import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/blocks";
import { FinderResults } from "@/components/finder";
import { getTools, scoresBySlug } from "@/lib/content";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Your Builder Finder shortlist",
  robots: { index: false, follow: true },
};

export default function FinderResultsPage() {
  return (
    <div className="container-site py-8">
      <Breadcrumbs
        items={[
          { name: "Builder Finder", href: routes.finder() },
          { name: "Your shortlist", href: routes.finderResults() },
        ]}
      />
      <h1 className="mt-8 font-display text-h1 font-medium">Your shortlist</h1>
      <p className="mt-4 max-w-2xl text-muted">
        Matched from your answers and the documented facts on each profile. Commercial status never affects this
        result.{" "}
        <Link href={routes.methodology()} className="underline underline-offset-2">
          How matching works
        </Link>
      </p>
      <div className="mt-10">
        <Suspense fallback={<p className="text-muted">Matching your answers.</p>}>
          <FinderResults tools={getTools()} scores={scoresBySlug()} />
        </Suspense>
      </div>
    </div>
  );
}
