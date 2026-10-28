import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateNote, VisitButton } from "@/components/affiliate";
import {
  Breadcrumbs,
  FactTable,
  JsonLd,
  ProsCons,
  ResearchBasis,
  SourceList,
  TrueCost,
} from "@/components/blocks";
import { ProfileTabs } from "@/components/profile-tabs";
import { Promo } from "@/components/promo";
import { ScoreDerivation, ScoreSummary } from "@/components/score";
import { FromPrice, ToolCard } from "@/components/tool-card";
import { ToolLogo } from "@/components/tool-logo";
import { ButtonLink, ExternalLink, Tag } from "@/components/ui";
import { comparisonsFor, getAlternatives, getScore, getTool, getTools, mainCategory } from "@/lib/content";
import { cheapestPaidPlan } from "@/lib/cost";
import { formatDate } from "@/lib/format";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/site.config";

export function generateStaticParams() {
  return getTools().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/reviews/[slug]">): Promise<Metadata> {
  const tool = getTool((await params).slug);
  if (!tool) return {};
  return {
    title: `${tool.name} review: features, true cost, pros and cons`,
    description: tool.summary,
    alternates: { canonical: routes.tool(tool.slug) },
  };
}

const sections = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Features" },
  { id: "pricing", label: "Pricing" },
  { id: "pros-cons", label: "Pros and cons" },
  { id: "score", label: "Score" },
  { id: "alternatives", label: "Alternatives" },
];

export default async function ToolPage({ params }: PageProps<"/reviews/[slug]">) {
  const tool = getTool((await params).slug);
  if (!tool) notFound();
  const category = mainCategory(tool);
  const score = getScore(tool);
  const alternatives = getAlternatives(tool.slug, 3);
  const comparisons = comparisonsFor(tool.slug);
  const cheapest = cheapestPaidPlan(tool.plans);
  const shownPlans = tool.plans.filter((p) => p.billing !== "monthly" || !tool.plans.some((q) => q.billing === "yearly" && q.name.split(" (")[0] === p.name.split(" (")[0])).slice(0, 3);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: tool.name,
          applicationCategory: "WebApplication",
          operatingSystem: "Web",
          url: tool.website,
          ...(tool.plans.length && {
            offers: tool.plans
              .filter((p) => p.currencyShown.startsWith("USD"))
              .map((p) => ({ "@type": "Offer", name: p.name, price: (p.introCents / 100).toFixed(2), priceCurrency: "USD" })),
          }),
        }}
      />
      <div className="container-site pt-8">
        <Breadcrumbs
          items={[
            ...(category ? [{ name: category.name, href: routes.category(category.slug) }] : []),
            { name: tool.name, href: routes.tool(tool.slug) },
          ]}
        />
        <header className="mt-8 grid gap-8 border-b border-line pb-10 md:grid-cols-12 md:items-end">
          <div className="min-w-0 md:col-span-8">
            {tool.status === "draft" && <Tag tone="draft">Draft</Tag>}
            <p className="text-small text-muted">{category?.singular}</p>
            <div className="mt-3 flex items-center gap-4 md:gap-6">
              <ToolLogo tool={tool} size={64} eager className="size-12 md:size-16" />
              <h1 className="min-w-0 font-display text-h1 font-medium break-words">{tool.name}</h1>
            </div>
            {tool.logo && (
              <p className="mt-2 text-[0.75rem] text-muted">
                Logo from the <ExternalLink href={tool.logo.page}>vendor&apos;s website</ExternalLink>, used for identification only.
              </p>
            )}
            <p className="mt-4 max-w-2xl text-body text-muted">{tool.summary}</p>
            <div className="mt-4">
              <ResearchBasis tool={tool} />
            </div>
          </div>
          <div className="flex flex-col items-start gap-4 md:col-span-4 md:items-end">
            {score && <Link href="#score" aria-label="Research Score details" className="hover:text-primary"><ScoreSummaryCompact score={score.score} /></Link>}
            <FromPrice tool={tool} />
            <VisitButton tool={tool} from="profile" />
          </div>
        </header>
      </div>

      <ProfileTabs sections={sections} />

      <div className="container-site grid gap-12 py-12 lg:grid-cols-12">
        <div className="min-w-0 space-y-20 lg:col-span-8">
          <AffiliateNote />

          <section id="overview" aria-labelledby="overview-h">
            <h2 id="overview-h" className="font-display text-h2 font-medium">
              {tool.centralQuestion}
            </h2>
            <p className="measure mt-6 text-body">{tool.editorial}</p>
            <dl className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="rounded-card border border-line bg-surface p-6">
                <dt className="font-medium">Best for</dt>
                <dd className="mt-2 text-muted">{tool.bestFor}</dd>
              </div>
              <div className="rounded-card border border-line bg-surface p-6">
                <dt className="font-medium">Not ideal for</dt>
                <dd className="mt-2 text-muted">{tool.notIdealFor}</dd>
              </div>
            </dl>
            <div className="prose-site measure mt-12 space-y-12">
              {tool.review.map((s) => (
                <section key={s.id} aria-labelledby={`r-${s.id}`}>
                  <h3 id={`r-${s.id}`} className="font-display text-h3 font-medium">
                    {s.heading}
                  </h3>
                  <div className="mt-4">
                    {s.body.map((p) => (
                      <p key={p}>{p}</p>
                    ))}
                  </div>
                  <SourceList sources={s.sources} />
                </section>
              ))}
            </div>
          </section>

          <section id="features" aria-labelledby="features-h">
            <h2 id="features-h" className="mb-8 font-display text-h2 font-medium">
              Features, with sources
            </h2>
            {category && <FactTable tool={tool} category={category.slug} />}
          </section>

          <section id="pricing" aria-labelledby="pricing-h">
            <h2 id="pricing-h" className="font-display text-h2 font-medium">
              True cost
            </h2>
            {tool.freePlan && (
              <p className="mt-4 text-muted">
                <strong className="font-medium text-ink">Free plan available.</strong> {tool.freePlanLimits}
              </p>
            )}
            {tool.pricingGap && <p className="mt-4 rounded-card border border-line bg-surface p-6">{tool.pricingGap}</p>}
            {shownPlans.length > 0 && (
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {shownPlans.map((p) => (
                  <TrueCost key={p.name} plan={p} />
                ))}
              </div>
            )}
            {tool.plans.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href={routes.toolPricing(tool.slug)} variant="outline">
                  All {tool.name} plans
                </ButtonLink>
                {cheapest && (
                  <ButtonLink href={routes.costCalculator(tool.slug)} variant="outline">
                    Calculate your cost
                  </ButtonLink>
                )}
              </div>
            )}
          </section>

          <section id="pros-cons" aria-labelledby="pc-h">
            <h2 id="pc-h" className="mb-8 font-display text-h2 font-medium">
              Pros and cons
            </h2>
            <ProsCons pros={tool.pros} cons={tool.cons} />
          </section>

          {tool.slug !== "base44" && <Promo ad="apps" from="profile" pos={3} layout="strip" />}

          {score && (
            <section id="score" aria-labelledby="score-h">
              <h2 id="score-h" className="font-display text-h2 font-medium">
                How the score is derived
              </h2>
              <p className="measure mt-4 text-muted">
                Every point below comes from a sourced fact or price. Pros and cons are not counted. Commercial
                interest never changes the score.
              </p>
              <div className="mt-8 grid gap-10 md:grid-cols-2">
                <ScoreSummary result={score} />
                <ScoreDerivation result={score} />
              </div>
            </section>
          )}

          {tool.changelog.length > 0 && (
            <section aria-labelledby="changes-h">
              <h2 id="changes-h" className="font-display text-h2 font-medium">
                What changed recently
              </h2>
              <ul className="mt-6 divide-y divide-line border-y border-line">
                {tool.changelog
                  .toSorted((a, b) => b.date.localeCompare(a.date))
                  .map((c) => (
                    <li key={c.date + c.change} className="grid gap-2 py-4 md:grid-cols-[10rem_1fr]">
                      <span className="text-small text-muted">{formatDate(c.date)}</span>
                      <span>
                        {c.change} <ExternalLink href={c.source} className="text-small text-muted">Source</ExternalLink>
                      </span>
                    </li>
                  ))}
              </ul>
            </section>
          )}

          <section id="alternatives" aria-labelledby="alt-h">
            <h2 id="alt-h" className="font-display text-h2 font-medium">
              Alternatives to {tool.name}
            </h2>
            <p className="mt-4 text-muted">Same category, ordered by Research Score.</p>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {alternatives.map((t) => (
                <ToolCard key={t.slug} tool={t} category={category?.slug} />
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href={routes.compareTool([tool.slug, ...alternatives.slice(0, 2).map((a) => a.slug)])} variant="dark">
                Compare side by side
              </ButtonLink>
              <ButtonLink href={routes.finder()} variant="outline">
                Try the Builder Finder
              </ButtonLink>
            </div>
          </section>
        </div>

        <aside className="min-w-0 lg:col-span-4" aria-label="Related">
          <div className="space-y-8 lg:sticky lg:top-40">
            <Promo
              ad={tool.slug === "base44" ? "pricing" : tool.categories.includes("ai-app-builders") ? "competitors" : "websites"}
              from="profile"
              pos={2}
              layout="card"
            />
            <div className="rounded-card border border-line bg-surface p-6">
              <h2 className="font-medium">Quick facts</h2>
              <dl className="mt-4 space-y-3 text-small">
                <Row label="Technical level" value={levelLabel[tool.technicalLevel]} />
                <Row label="Output" value={outputLabel[tool.output]} />
                <Row label="Free plan" value={tool.freePlan ? "Yes" : "No"} />
                <Row label="Free trial" value={tool.trialDays ? `${tool.trialDays} days` : "None stated"} />
                <Row label="Refund window" value={tool.refundDays ? `${tool.refundDays} days` : "Unknown"} />
                {tool.vendor.legalName && <Row label="Company" value={tool.vendor.legalName} />}
                {tool.vendor.parent && <Row label="Parent" value={tool.vendor.parent} />}
                <Row label="Last reviewed" value={formatDate(tool.lastReviewed)} />
              </dl>
            </div>
            {comparisons.length > 0 && (
              <div>
                <h2 className="font-medium">Comparisons</h2>
                <ul className="mt-3 divide-y divide-line border-y border-line">
                  {comparisons.map((c) => (
                    <li key={c.slug}>
                      <Link href={routes.comparison(c.slug)} className="block py-3 hover:text-primary">
                        {c.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-small text-muted">
              Spotted an outdated fact? Tell us at the editorial address on our{" "}
              <Link href={routes.contact()} className="underline underline-offset-2">
                contact page
              </Link>
              . {siteConfig.brandName} corrects errors and notes the date.
            </p>
          </div>
        </aside>
      </div>
    </>
  );
}

const levelLabel: Record<string, string> = { "no-code": "No code", "low-code": "Low code", "code-first": "Code first" };

const outputLabel: Record<string, string> = {
  "hosted-site": "Hosted on the vendor",
  "hosted-site-plus-export": "Hosted, with code export",
  "code-in-your-repo": "Code in your repository",
};

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right">{value}</dd>
    </div>
  );
}

function ScoreSummaryCompact({ score }: { score: number }) {
  return (
    <span className="flex items-baseline gap-2">
      <span className="tabular font-display text-[3rem] font-medium leading-none tracking-[-0.03em]">{score.toFixed(1)}</span>
      <span className="text-small text-muted">/ 10 Research Score</span>
    </span>
  );
}
