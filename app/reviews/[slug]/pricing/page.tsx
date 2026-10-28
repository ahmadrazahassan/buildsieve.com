import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AffiliateNote, VisitButton } from "@/components/affiliate";
import { Breadcrumbs, ResearchBasis, TrueCost } from "@/components/blocks";
import { CostChart } from "@/components/cost-chart";
import { ButtonLink } from "@/components/ui";
import { getTool, getTools, mainCategory } from "@/lib/content";
import { cheapestPaidPlan } from "@/lib/cost";
import { routes } from "@/lib/routes";

export function generateStaticParams() {
  return getTools().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps<"/reviews/[slug]/pricing">): Promise<Metadata> {
  const tool = getTool((await params).slug);
  if (!tool) return {};
  return {
    title: `${tool.name} pricing: intro price, renewal and three-year cost`,
    description: `Every ${tool.name} plan with its intro price, renewal price, year one and year three totals, credits and limits, from the vendor's own pricing page.`,
    alternates: { canonical: routes.toolPricing(tool.slug) },
  };
}

export default async function PricingPage({ params }: PageProps<"/reviews/[slug]/pricing">) {
  const tool = getTool((await params).slug);
  if (!tool) notFound();
  const category = mainCategory(tool);
  const cheapest = cheapestPaidPlan(tool.plans);

  return (
    <div className="container-site py-8">
      <Breadcrumbs
        items={[
          ...(category ? [{ name: category.name, href: routes.category(category.slug) }] : []),
          { name: tool.name, href: routes.tool(tool.slug) },
          { name: "Pricing", href: routes.toolPricing(tool.slug) },
        ]}
      />
      <header className="mt-8 max-w-3xl">
        <h1 className="font-display text-h1 font-medium">What will {tool.name} really cost you?</h1>
        <p className="mt-4 text-body text-muted">
          Every plan with the price you pay today, the price after any intro term, and totals for year one and year
          three. Per-seat plans are shown for one seat.
        </p>
        <div className="mt-4">
          <ResearchBasis tool={tool} />
        </div>
      </header>

      <AffiliateNote className="mt-8" />

      {tool.freePlan && (
        <p className="mt-10 max-w-3xl">
          <strong className="font-medium">Free plan available.</strong> <span className="text-muted">{tool.freePlanLimits}</span>
        </p>
      )}
      {tool.pricingGap && <p className="mt-8 max-w-3xl rounded-card border border-line bg-surface p-6">{tool.pricingGap}</p>}

      {tool.plans.length > 0 && (
        <>
          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {tool.plans.map((p) => (
              <TrueCost key={p.name} plan={p} />
            ))}
          </div>
          <section className="mt-16" aria-labelledby="chart-h">
            <h2 id="chart-h" className="font-display text-h2 font-medium">
              Cumulative cost over 36 months
            </h2>
            <p className="mt-3 text-muted">Running total for one seat. A table with the same numbers follows the chart.</p>
            <CostChart plans={tool.plans} />
          </section>
        </>
      )}

      <div className="mt-12 flex flex-wrap items-start gap-3">
        <VisitButton tool={tool} from="pricing" />
        {cheapest && (
          <ButtonLink href={routes.costCalculator(tool.slug)} variant="outline">
            Calculate with your seats and term
          </ButtonLink>
        )}
        <ButtonLink href={routes.tool(tool.slug)} variant="outline">
          Back to the {tool.name} profile
        </ButtonLink>
      </div>
      <p className="mt-8 text-small text-muted">
        Not sure how intro prices work? Read{" "}
        <Link href={routes.guide("intro-price-vs-renewal-price")} className="underline underline-offset-2">
          Intro price vs. renewal price
        </Link>
        .
      </p>
    </div>
  );
}
