import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { AffiliateNote } from "@/components/affiliate";
import { JsonLd } from "@/components/blocks";
import { CategoryTabs } from "@/components/category-tabs";
import { GuideCard } from "@/components/guide-card";
import { ToolCard } from "@/components/tool-card";
import { ToolLogo } from "@/components/tool-logo";
import { ButtonLink, Panel, SectionHeading } from "@/components/ui";
import {
  getCategories,
  getComparisons,
  getGuides,
  getTools,
  getUseCases,
  toolsInCategory,
  topTools,
} from "@/lib/content";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/site.config";

export default function HomePage() {
  const categories = getCategories();
  const top = topTools(4);
  const tools = getTools();
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            { "@type": "Organization", name: siteConfig.brandName, url: siteConfig.url },
            {
              "@type": "WebSite",
              name: siteConfig.brandName,
              url: siteConfig.url,
              potentialAction: {
                "@type": "SearchAction",
                target: `${siteConfig.url}/search?q={search_term_string}`,
                "query-input": "required name=search_term_string",
              },
            },
          ],
        }}
      />

      {/* Hero */}
      <section className="container-site pb-16 pt-16 md:pb-24 md:pt-28">
        <h1 className="rise max-w-[16ch] font-display text-display font-medium">
          Pick an AI builder you can afford to keep.
        </h1>
        <p className="rise mt-6 max-w-2xl text-body text-muted md:mt-8">
          Independent research on {tools.length} AI website and app builders, with the price you pay after the intro
          offer ends and a source on every fact.
        </p>
        <form action="/search" method="get" role="search" className="rise mt-10 flex max-w-2xl">
          <label htmlFor="hero-q" className="sr-only">
            Search builders, comparisons and guides
          </label>
          <input
            id="hero-q"
            name="q"
            type="search"
            placeholder="Try Lovable, Squarespace or code export"
            className="h-14 min-w-0 flex-1 border border-r-0 border-ink bg-surface px-4 text-body placeholder:text-muted"
          />
          <button type="submit" className="inline-flex h-14 items-center gap-2 bg-ink px-6 font-medium text-white hover:bg-primary-hover">
            <Search className="size-5" strokeWidth={1.5} aria-hidden="true" />
            <span className="hidden sm:inline">Search</span>
          </button>
        </form>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-small">
          {categories.map((c) => (
            <Link key={c.slug} href={routes.category(c.slug)} className="underline underline-offset-4 hover:text-primary">
              {c.name}
            </Link>
          ))}
          <Link href={routes.finder()} className="underline underline-offset-4 hover:text-primary">
            Builder Finder
          </Link>
        </div>
      </section>

      {/* Builders we cover: official logos in grayscale (sources in docs/LOGOS.md) */}
      <section aria-labelledby="covered" className="container-site border-y border-line py-8">
        <h2 id="covered" className="eyebrow text-muted">
          Builders we cover
        </h2>
        <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-4 font-display text-[1.125rem] font-medium text-muted">
          {tools
            .toSorted((a, b) => a.name.localeCompare(b.name))
            .map((t) => (
              <li key={t.slug}>
                <Link href={routes.tool(t.slug)} className="group inline-flex min-h-11 items-center gap-2.5 hover:text-ink">
                  <ToolLogo tool={t} size={28} grayscale eager className="transition group-hover:opacity-100 group-hover:grayscale-0" />
                  {t.name}
                </Link>
              </li>
            ))}
        </ul>
      </section>

      <Panel tone="surface" className="mt-12 md:mt-16" aria-labelledby="by-category">
        <SectionHeading id="by-category" eyebrow="Categories" title="Builders by category" />
        <CategoryTabs
          tabs={categories.map((c) => ({
            slug: c.slug,
            name: c.name,
            intro: c.intro,
            content: (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {toolsInCategory(c.slug).map((t, i) => (
                  <ToolCard key={t.slug} tool={t} category={c.slug} rank={i + 1} />
                ))}
              </div>
            ),
          }))}
        />
      </Panel>

      <section className="container-site py-16 md:py-24" aria-labelledby="top">
        <SectionHeading
          id="top"
          title="Highest Research Score"
          aside="Top four across both categories, sorted by Research Score only. Each score is computed from sourced facts and prices; commercial interest never changes it."
        />
        <AffiliateNote className="mb-6" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {top.map((t) => (
            <ToolCard key={t.slug} tool={t} />
          ))}
        </div>
      </section>

      <Panel tone="surface" aria-labelledby="popular">
        <div className="grid gap-12 md:grid-cols-2">
          <div className="min-w-0">
            <h2 id="popular" className="font-display text-h3 font-medium">
              Comparisons
            </h2>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {getComparisons().map((c) => (
                <li key={c.slug}>
                  <Link href={routes.comparison(c.slug)} className="flex items-center justify-between gap-4 py-4 hover:text-primary">
                    <span className="min-w-0">{c.title}</span>
                    <ArrowRight className="size-5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                  </Link>
                </li>
              ))}
              <li>
                <Link href={routes.compareTool()} className="flex items-center justify-between gap-4 py-4 hover:text-primary">
                  <span>Compare any two or three tools</span>
                  <ArrowRight className="size-5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </div>
          <div className="min-w-0">
            <h2 className="font-display text-h3 font-medium">Best for</h2>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {getUseCases().map((u) => (
                <li key={u.slug}>
                  <Link href={routes.useCase(u.slug)} className="flex items-center justify-between gap-4 py-4 hover:text-primary">
                    <span className="min-w-0">{u.title}</span>
                    <ArrowRight className="size-5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Panel>

      <section className="container-site py-16 md:py-24" aria-labelledby="guides">
        <SectionHeading
          id="guides"
          title="Guides"
          aside={
            <Link href={routes.guides()} className="underline underline-offset-4">
              All guides
            </Link>
          }
        />
        <div className="grid gap-4 md:grid-cols-3">
          {getGuides()
            .slice(0, 3)
            .map((g) => (
              <GuideCard key={g.slug} guide={g} />
            ))}
        </div>
      </section>

      <Panel tone="ink" aria-labelledby="how">
        <div className="grid gap-10 md:grid-cols-12">
          <h2 id="how" className="font-display text-h2 font-medium md:col-span-5">
            How {siteConfig.brandName} works
          </h2>
          <div className="space-y-6 text-on-ink-muted md:col-span-7">
            <p>
              <strong className="font-medium text-white">Research, not tests.</strong> We read each vendor&apos;s
              pricing pages, documentation and terms, and record every fact with its source and the date we checked
              it. We do not run hands-on tests and never claim to.
            </p>
            <p>
              <strong className="font-medium text-white">A score you can recompute.</strong> The Research Score adds
              up sourced facts and the three-year cost with fixed weights. Every profile shows the full derivation.
            </p>
            <p>
              <strong className="font-medium text-white">Honest money.</strong> We plan to earn affiliate commissions.
              They will be labeled next to every link and can never change a score, a ranking or a Finder result.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <ButtonLink href={routes.methodology()} variant="outline" className="border-white text-white hover:bg-white hover:text-ink">
                Methodology
              </ButtonLink>
              <ButtonLink href={routes.money()} variant="outline" className="border-white text-white hover:bg-white hover:text-ink">
                How we make money
              </ButtonLink>
            </div>
          </div>
        </div>
      </Panel>
    </>
  );
}
