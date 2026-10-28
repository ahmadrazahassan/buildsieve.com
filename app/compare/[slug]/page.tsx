import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AffiliateNote, VisitButton } from "@/components/affiliate";
import { Breadcrumbs, Byline, JsonLd, SourceList } from "@/components/blocks";
import { ToolCard } from "@/components/tool-card";
import { ButtonLink } from "@/components/ui";
import { getComparison, getComparisons, getTool } from "@/lib/content";
import { routes } from "@/lib/routes";
import type { Tool } from "@/lib/schema";
import { siteConfig } from "@/site.config";

export function generateStaticParams() {
  return getComparisons().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/compare/[slug]">): Promise<Metadata> {
  const c = getComparison((await params).slug);
  if (!c) return {};
  return { title: c.title, description: c.description, alternates: { canonical: routes.comparison(c.slug) } };
}

export default async function ComparisonPage({ params }: PageProps<"/compare/[slug]">) {
  const c = getComparison((await params).slug);
  if (!c) notFound();
  const tools = c.tools.map(getTool).filter((t): t is Tool => !!t);
  return (
    <article className="container-site py-8">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: c.title,
          datePublished: c.published,
          dateModified: c.updated,
          author: { "@type": "Organization", name: `${siteConfig.brandName} Editorial Team` },
        }}
      />
      <Breadcrumbs items={[{ name: "Compare", href: routes.compareTool() }, { name: c.title, href: routes.comparison(c.slug) }]} />
      <header className="mt-8 max-w-4xl">
        <h1 className="font-display text-h1 font-medium">{c.title}</h1>
        <p className="mt-6 text-body">{c.centralQuestion}</p>
        <div className="mt-4">
          <Byline updated={c.updated} />
        </div>
      </header>
      <AffiliateNote className="mt-8" />
      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {tools.map((t) => (
          <ToolCard key={t.slug} tool={t} />
        ))}
      </div>
      <div className="prose-site measure mt-16 space-y-12">
        <p className="text-body">{c.intro}</p>
        {c.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="font-display text-h3 font-medium">{s.heading}</h2>
            <div className="mt-4">
              {s.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <SourceList sources={s.sources} />
          </section>
        ))}
        <section className="rounded-card border border-ink bg-surface p-6 md:p-8">
          <h2 className="font-display text-h3 font-medium">Our verdict</h2>
          <p className="mt-3">{c.verdict}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {tools.map((t, i) => (
              <VisitButton key={t.slug} tool={t} from="comparison" pos={i + 1} variant={i === 0 ? "primary" : "outline"} />
            ))}
          </div>
        </section>
      </div>
      <div className="mt-12 flex flex-wrap gap-3">
        <ButtonLink href={routes.compareTool(c.tools)} variant="outline">
          Full side-by-side table
        </ButtonLink>
        <ButtonLink href={routes.finder()} variant="outline">
          Try the Builder Finder
        </ButtonLink>
      </div>
    </article>
  );
}
