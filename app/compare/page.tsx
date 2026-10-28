import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Breadcrumbs } from "@/components/blocks";
import { CompareToolView, type CompareTool } from "@/components/compare-tool";
import { getComparisons, getTools, mainCategory, scoreValue } from "@/lib/content";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Compare AI builders side by side",
  description: "Compare two or three AI website or app builders on sourced facts, true cost and Research Score, with a differences-only view.",
  alternates: { canonical: routes.compareTool() },
};

export default function ComparePage() {
  const tools: CompareTool[] = getTools()
    .map((t) => {
      const c = mainCategory(t);
      return { ...t, score: scoreValue(t), category: c?.slug ?? t.categories[0], categoryName: c?.name ?? "" };
    })
    .toSorted((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="container-site py-8">
      <Breadcrumbs items={[{ name: "Compare", href: routes.compareTool() }]} />
      <h1 className="mt-8 font-display text-h1 font-medium">Compare any two or three builders</h1>
      <p className="mt-4 max-w-2xl text-body text-muted">
        Pick tools to see sourced facts, true cost and scores side by side. Your selection is saved in the URL, so you
        can share it.
      </p>
      <div className="mt-10">
        <Suspense fallback={<p className="text-muted">Loading the comparison tool.</p>}>
          <CompareToolView tools={tools} />
        </Suspense>
      </div>
      {getComparisons().length > 0 && (
        <section className="mt-16" aria-labelledby="editorial-h">
          <h2 id="editorial-h" className="font-display text-h3 font-medium">
            Editorial comparisons
          </h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {getComparisons().map((c) => (
              <li key={c.slug}>
                <Link href={routes.comparison(c.slug)} className="block py-3 hover:text-primary">
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
