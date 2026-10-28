import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/blocks";
import { CategoryArt } from "@/components/category-art";
import { getCategories, toolsInCategory } from "@/lib/content";
import { routes } from "@/lib/routes";

export const metadata: Metadata = {
  title: "Categories of AI builders",
  description: "The kinds of AI builders we research: AI website builders and AI app builders, with how many tools each covers.",
  alternates: { canonical: routes.categories() },
};

export default function CategoriesPage() {
  return (
    <div className="container-site py-8">
      <Breadcrumbs items={[{ name: "Categories", href: routes.categories() }]} />
      <h1 className="mt-8 font-display text-h1 font-medium">Which kinds of AI builders exist?</h1>
      <p className="mt-4 max-w-2xl text-body text-muted">
        Two kinds of tool answer two different jobs. Website builders host a site for you. App builders generate a
        working app with a backend, and often code you can take with you.
      </p>
      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {getCategories().map((c) => (
          <article key={c.slug} className="relative rounded-card border border-line bg-surface p-8 hover:border-ink">
            <div className="mb-6 max-w-[220px]">
              <CategoryArt slug={c.slug} />
            </div>
            <h2 className="font-display text-h2 font-medium">
              <Link href={routes.category(c.slug)} className="after:absolute after:inset-0">
                {c.name}
              </Link>
            </h2>
            <p className="mt-3 text-muted">{c.intro}</p>
            <p className="mt-6 text-small">{toolsInCategory(c.slug).length} tools researched</p>
          </article>
        ))}
      </div>
    </div>
  );
}
