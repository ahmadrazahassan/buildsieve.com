import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AffiliateNote } from "@/components/affiliate";
import { Breadcrumbs, JsonLd } from "@/components/blocks";
import { CategoryList, type ListItem } from "@/components/category-list";
import { CategoryArt } from "@/components/category-art";
import { ToolCard } from "@/components/tool-card";
import { ButtonLink, Panel } from "@/components/ui";
import { getCategories, getCategory, getComparisons, getGuides, scoreValue, toolsInCategory } from "@/lib/content";
import { cheapestPaidPlan } from "@/lib/cost";
import { criteria } from "@/lib/facts";
import { routes } from "@/lib/routes";
import type { Tool } from "@/lib/schema";
import { siteConfig } from "@/site.config";

export function generateStaticParams() {
  return getCategories().map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/best/[category]">): Promise<Metadata> {
  const c = getCategory((await params).category);
  if (!c) return {};
  return {
    title: `Best ${c.name}, ranked by Research Score`,
    description: `${toolsInCategory(c.slug).length} ${c.name.toLowerCase()} ranked on sourced facts and true cost, including renewal prices.`.slice(0, 155),
    alternates: { canonical: routes.category(c.slug) },
  };
}

const yes = (t: Tool, id: string) => ["yes", "paid-add-on", "partly"].includes(t.facts[id]?.value ?? "");

export default async function CategoryPage({ params }: PageProps<"/best/[category]">) {
  const c = getCategory((await params).category);
  if (!c) notFound();
  const tools = toolsInCategory(c.slug);
  const items: ListItem[] = tools.map((t, i) => {
    const p = cheapestPaidPlan(t.plans);
    return {
      slug: t.slug,
      name: t.name,
      score: scoreValue(t, c.slug),
      renewalCents: p ? (p.renewalCents ?? p.introCents) : null,
      freePlan: t.freePlan,
      trial: !!t.trialDays,
      codeExport: yes(t, "code_export") || yes(t, "github_sync"),
      customDomain: yes(t, "custom_domain"),
      ecommerce: yes(t, "ecommerce") || yes(t, "payments"),
      build: t.build,
      level: t.technicalLevel,
      card: <ToolCard tool={t} category={c.slug} rank={i + 1} />,
    };
  });
  const builds = [...new Set(tools.flatMap((t) => t.build))];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `Best ${c.name}`,
          itemListElement: tools.map((t, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${siteConfig.url}${routes.tool(t.slug)}`,
            name: t.name,
          })),
        }}
      />
      <div className="container-site pt-8">
        <Breadcrumbs items={[{ name: "Categories", href: routes.categories() }, { name: c.name, href: routes.category(c.slug) }]} />
        <header className="mt-8 grid gap-8 pb-10 md:grid-cols-12 md:items-end">
          <div className="min-w-0 md:col-span-8">
            <h1 className="rise font-display text-h1 font-medium">Best {c.name.toLowerCase()}</h1>
            <p className="mt-6 max-w-2xl text-body text-muted">{c.intro}</p>
          </div>
          <div className="hidden md:col-span-4 md:block">
            <CategoryArt slug={c.slug} />
          </div>
        </header>
        <div className="rounded-card border border-line bg-surface p-6">
          <h2 className="font-medium">How this list is ranked</h2>
          <p className="mt-2 text-small text-muted">
            Default order is the {siteConfig.scoreName}:{" "}
            {criteria.map((k) => `${k.label.toLowerCase()} ${Math.round(k.weight * 100)}%`).join(", ")}. Each tool is
            scored against the fact list for {c.name.toLowerCase()}. Affiliate relationships never change the order.{" "}
            <Link href={routes.methodology()} className="underline underline-offset-2">
              Methodology
            </Link>
          </p>
        </div>
        <AffiliateNote className="mt-6" />
        <div className="mt-8">
          <Suspense fallback={<StaticList tools={tools} category={c.slug} />}>
            <CategoryList items={items} builds={builds} />
          </Suspense>
        </div>
      </div>

      <Panel tone="surface" className="mt-16" aria-labelledby="buying-guide">
        <div className="grid gap-10 md:grid-cols-12">
          <h2 id="buying-guide" className="font-display text-h2 font-medium md:col-span-4">
            {c.centralQuestion}
          </h2>
          <div className="space-y-10 md:col-span-8">
            {c.guide.map((g) => (
              <section key={g.heading}>
                <h3 className="font-display text-h3 font-medium">{g.heading}</h3>
                {g.body.map((p) => (
                  <p key={p} className="measure mt-3 text-muted">
                    {p}
                  </p>
                ))}
              </section>
            ))}
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={routes.finder()}>Find your builder</ButtonLink>
              <ButtonLink href={routes.compareTool()} variant="outline">
                Compare tools
              </ButtonLink>
            </div>
          </div>
        </div>
      </Panel>

      <section className="container-site mt-16 grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="font-display text-h3 font-medium">Related comparisons</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {getComparisons()
              .filter((x) => x.tools.some((s) => tools.some((t) => t.slug === s)))
              .map((x) => (
                <li key={x.slug}>
                  <Link href={routes.comparison(x.slug)} className="block py-3 hover:text-primary">
                    {x.title}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
        <div>
          <h2 className="font-display text-h3 font-medium">Guides</h2>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {getGuides().map((g) => (
              <li key={g.slug}>
                <Link href={routes.guide(g.slug)} className="block py-3 hover:text-primary">
                  {g.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

function StaticList({ tools, category }: { tools: Tool[]; category: string }) {
  return (
    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {tools.map((t, i) => (
        <li key={t.slug}>
          <ToolCard tool={t} category={category} rank={i + 1} />
        </li>
      ))}
    </ol>
  );
}
