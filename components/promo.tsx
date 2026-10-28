import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { ToolLogo } from "@/components/tool-logo";
import { cn } from "@/lib/cn";
import { getTool, hasAffiliateAd } from "@/lib/content";
import { cheapestPaidPlan } from "@/lib/cost";
import { formatCents } from "@/lib/format";
import { routes, type GoPlace } from "@/lib/routes";

/**
 * Sponsored banners for partner programs. The creative is ours, the tracking is the network's:
 * every click goes to /go/[slug]?ad=<id>, which answers 307 to the network-hosted tracking link
 * (Impact counts the click there) with subId1 = place-slot. Copy states only sourced facts from
 * the tool's content file. A banner renders nothing unless its ad is active in
 * content/affiliate-links, and it never affects scores, rankings or the Finder.
 * Not allowed inside comparison tables, the Finder, the cost calculator or legal pages.
 */

type PromoId = "apps" | "websites" | "competitors" | "crm" | "pricing" | "product";

const SLUG = "base44";

type Copy = { headline: string; body: string; cta: string };

function copyFor(id: PromoId, fromPrice: string): Copy {
  switch (id) {
    case "apps":
      return {
        headline: "Describe an app. Get one with the database and logins already built in.",
        body: "Base44 turns a plain-language description into a working web app. Database, user logins, hosting and payments are included, so there is nothing to wire up.",
        cta: "Start building on Base44",
      };
    case "websites":
      return {
        headline: "Need logins, bookings or payments, not just pages?",
        body: "A website builder gives you pages. Base44 builds a web app from your description, with a database, user logins and payments included.",
        cta: "Build a web app with Base44",
      };
    case "competitors":
      return {
        headline: "Comparing AI app builders? Put Base44 on your list.",
        body: "Base44 includes the database, logins, hosting and payments, and from the Builder plan two-way GitHub sync exports your full source code.",
        cta: "See Base44",
      };
    case "crm":
      return {
        headline: "Build the CRM or tracker your team actually needs.",
        body: "Describe the fields and steps in plain language. Base44 builds the app with a database and user logins and hosts it for you.",
        cta: "Build an internal tool",
      };
    case "pricing":
      return {
        headline: "Start on Base44's free plan.",
        body: `The free plan includes 25 message credits a month and up to 5 apps. Paid plans start at ${fromPrice} a month, billed annually, with a custom domain.`,
        cta: "Try Base44 for free",
      };
    case "product":
      return {
        headline: "Turn your idea into a working prototype.",
        body: "Describe what it should do and keep refining by chat. Base44 handles the database, logins and hosting.",
        cta: "Prototype with Base44",
      };
  }
}

export function Promo({
  ad,
  from,
  pos,
  layout = "band",
  className,
}: {
  ad: PromoId;
  from: GoPlace;
  /** Slot number on the page; becomes part of Impact's subId1 so each slot can be measured. */
  pos: number;
  layout?: "band" | "card" | "strip";
  className?: string;
}) {
  const tool = getTool(SLUG);
  if (!tool || !hasAffiliateAd(SLUG, ad)) return null;
  const cheapest = cheapestPaidPlan(tool.plans);
  const fromPrice = cheapest ? formatCents(cheapest.renewalCents ?? cheapest.introCents) : "";
  const copy = copyFor(ad, fromPrice);
  const href = routes.go(SLUG, from, pos, ad);
  const points = [
    "Free plan: 25 message credits a month",
    cheapest ? `Paid plans from ${fromPrice}/mo, billed annually` : "Paid plans billed annually",
    "Full code export via GitHub from Builder",
  ];
  // Plain <a>, never next/link: a prefetch must not fire a tracked click.
  const linkProps = { href, target: "_blank", rel: "sponsored nofollow noopener" } as const;

  const label = (
    <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.75rem]">
      <span className="eyebrow">Sponsored</span>
      <Link href={routes.money()} className="underline underline-offset-2">
        Affiliate link
      </Link>
      <Link href={routes.tool(SLUG)} className="underline underline-offset-2">
        Read our Base44 research
      </Link>
    </span>
  );

  if (layout === "strip") {
    return (
      <aside aria-label="Sponsored" className={cn("rounded-card border border-primary bg-primary-tint p-4 md:p-5", className)}>
        <a {...linkProps} className="group flex items-center gap-4">
          <span className="grid size-12 shrink-0 place-items-center bg-surface">
            <ToolLogo tool={tool} size={32} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-medium group-hover:text-primary">{copy.headline}</span>
            <span className="mt-1 block text-small text-muted">{points[0]}. {points[1]}.</span>
          </span>
          <span className="hidden shrink-0 items-center gap-2 bg-primary px-4 py-3 text-small font-medium text-white group-hover:bg-primary-hover sm:inline-flex">
            {copy.cta}
            <ArrowUpRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <ArrowUpRight className="size-5 shrink-0 text-primary sm:hidden" strokeWidth={1.5} aria-hidden="true" />
        </a>
        <div className="mt-3 text-muted">{label}</div>
      </aside>
    );
  }

  if (layout === "card") {
    return (
      <aside aria-label="Sponsored" className={cn("rounded-card border border-line bg-surface p-6", className)}>
        <div className="text-muted">{label}</div>
        <a {...linkProps} className="group mt-4 block">
          <span className="flex items-center gap-3">
            <ToolLogo tool={tool} size={40} />
            <span className="font-display text-[1.25rem] font-medium">Base44</span>
          </span>
          <span className="mt-4 block font-display text-[1.25rem] font-medium leading-snug group-hover:text-primary">
            {copy.headline}
          </span>
          <span className="mt-3 block text-small text-muted">{copy.body}</span>
          <ul className="mt-4 space-y-2 text-small">
            {points.map((p) => (
              <li key={p} className="flex gap-2">
                <Check className="mt-0.5 size-4 shrink-0 text-positive" strokeWidth={2} aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
          <span className="mt-5 flex min-h-11 w-full items-center justify-center gap-2 bg-primary px-5 text-[0.9375rem] font-medium text-white group-hover:bg-primary-hover">
            {copy.cta}
            <ArrowUpRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
          </span>
        </a>
      </aside>
    );
  }

  return (
    <aside aria-label="Sponsored" className={cn("mx-3 md:mx-4", className)}>
      <div className="rounded-panel-sm bg-ink text-white md:rounded-panel">
        <a {...linkProps} className="group container-site grid gap-10 py-12 md:grid-cols-12 md:items-center md:py-16">
          <span className="block md:col-span-7">
            <span className="flex items-center gap-3">
              <span className="grid size-14 place-items-center bg-surface">
                <ToolLogo tool={tool} size={40} />
              </span>
              <span className="font-display text-h3 font-medium">Base44</span>
            </span>
            <span className="mt-6 block max-w-[22ch] font-display text-h2 font-medium">{copy.headline}</span>
            <span className="mt-5 block max-w-xl text-body text-on-ink-muted">{copy.body}</span>
          </span>
          <span className="block md:col-span-5">
            <ul className="space-y-3">
              {points.map((p) => (
                <li key={p} className="flex gap-3 border-b border-white/15 pb-3">
                  <Check className="mt-1 size-5 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                  {p}
                </li>
              ))}
            </ul>
            <span className="mt-8 flex min-h-14 w-full items-center justify-between gap-3 bg-white px-6 text-[1.0625rem] font-medium text-ink transition-colors group-hover:bg-primary group-hover:text-white">
              {copy.cta}
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" strokeWidth={1.5} aria-hidden="true" />
            </span>
          </span>
        </a>
        <div className="container-site border-t border-white/15 py-4 text-on-ink-muted">{label}</div>
      </div>
    </aside>
  );
}
