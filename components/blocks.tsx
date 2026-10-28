import Link from "next/link";
import { Minus, Plus } from "lucide-react";
import { costBreakdown, hasIntroOffer } from "@/lib/cost";
import { factItems, factLabel } from "@/lib/facts";
import { formatCents, formatDate, termLabel } from "@/lib/format";
import type { Plan, Source, Tool } from "@/lib/schema";
import { cn } from "@/lib/cn";
import { siteConfig } from "@/site.config";
import { ExternalLink } from "./ui";

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  const all = [{ name: "Home", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className="text-small text-muted">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {all.map((item, i) => (
            <li key={item.href} className="flex min-w-0 items-center gap-2">
              {i > 0 && <span aria-hidden="true">/</span>}
              {i === all.length - 1 ? (
                <span aria-current="page" className="text-ink">
                  {item.name}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-ink">
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: all.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            item: `${siteConfig.url}${item.href === "/" ? "" : item.href}`,
          })),
        }}
      />
    </>
  );
}

export function SourceList({ sources, title = "Sources for this section" }: { sources: Source[]; title?: string }) {
  return (
    <div className="mt-5 border-l-2 border-line pl-4 text-small text-muted">
      <p className="font-medium text-ink">{title}</p>
      <ul className="mt-1 space-y-1">
        {sources.map((s) => (
          <li key={s.url + s.title}>
            <ExternalLink href={s.url}>{s.title}</ExternalLink>, accessed {formatDate(s.accessed)}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ProsCons({ pros, cons }: { pros: string[]; cons: string[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="min-w-0 rounded-card border border-line bg-surface p-6">
        <h3 className="font-display text-h3 font-medium">Pros</h3>
        <ul className="mt-4 space-y-3">
          {pros.map((p) => (
            <li key={p} className="flex gap-3">
              <Plus className="mt-1 size-4 shrink-0 text-positive" strokeWidth={1.5} aria-hidden="true" />
              <span>
                <span className="sr-only">Pro: </span>
                {p}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="min-w-0 rounded-card border border-line bg-surface p-6">
        <h3 className="font-display text-h3 font-medium">Cons</h3>
        <ul className="mt-4 space-y-3">
          {cons.map((c) => (
            <li key={c} className="flex gap-3">
              <Minus className="mt-1 size-4 shrink-0 text-negative" strokeWidth={1.5} aria-hidden="true" />
              <span>
                <span className="sr-only">Con: </span>
                {c}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

const valueTone: Record<string, string> = {
  yes: "text-positive",
  no: "text-negative",
  unknown: "text-muted",
};

export function FactTable({ tool, category }: { tool: Tool; category: string }) {
  const items = factItems[category] ?? [];
  const groups = [...new Set(items.map((i) => i.group))];
  return (
    <div className="space-y-10">
      {groups.map((g) => (
        <div key={g}>
          <h3 className="font-display text-[1.25rem] font-medium">{g}</h3>
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {items
              .filter((i) => i.group === g)
              .map((i) => {
                const f = tool.facts[i.id];
                const v = f?.value ?? "unknown";
                return (
                  <li key={i.id} className="grid gap-1 py-3 md:grid-cols-12 md:gap-4">
                    <span className="min-w-0 font-medium md:col-span-4">{i.label}</span>
                    <span className={cn("md:col-span-2", valueTone[v] ?? "text-ink")}>{factLabel[v]}</span>
                    <span className="min-w-0 text-small text-muted md:col-span-6">
                      {f?.note && <span className="block">{f.note}</span>}
                      {f?.source && f.accessed ? (
                        <span className="block">
                          <ExternalLink href={f.source}>Source</ExternalLink>, accessed {formatDate(f.accessed)}
                        </span>
                      ) : (
                        !f?.note && <span>No statement found on the vendor pages we read.</span>
                      )}
                    </span>
                  </li>
                );
              })}
          </ul>
        </div>
      ))}
      <p className="text-small text-muted">
        Unknown means we found no statement on the vendor pages we read. It does not mean the feature is missing.
      </p>
    </div>
  );
}

export function TrueCost({ plan }: { plan: Plan }) {
  const b = costBreakdown(plan);
  const intro = hasIntroOffer(plan);
  return (
    <div className="min-w-0 rounded-card border border-line bg-surface p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-display text-[1.25rem] font-medium">{plan.name}</h3>
        <span className="text-small text-muted">
          {termLabel(plan.termMonths)}
          {plan.perSeat && ", per seat"}
        </span>
      </div>
      <dl className="tabular mt-5 grid grid-cols-2 gap-x-6 gap-y-4 text-small">
        <div>
          <dt className="text-muted">{intro ? "Intro price" : "Price"}</dt>
          <dd className="font-display text-[1.75rem] font-medium leading-tight">{formatCents(plan.introCents)}/mo</dd>
        </div>
        <div>
          <dt className="text-muted">Renewal price</dt>
          <dd className="font-display text-[1.75rem] font-medium leading-tight">
            {plan.renewalCents === null ? "No change" : `${formatCents(plan.renewalCents)}/mo`}
          </dd>
        </div>
        <div>
          <dt className="text-muted">Year one total</dt>
          <dd className="text-[1rem] font-medium">{formatCents(b.year1Cents)}</dd>
        </div>
        <div>
          <dt className="text-muted">Three-year total</dt>
          <dd className="text-[1rem] font-medium">{formatCents(b.year3Cents)}</dd>
        </div>
        {plan.upfrontCents !== undefined && (
          <div className="col-span-2">
            <dt className="text-muted">Charged up front</dt>
            <dd className="font-medium">
              {formatCents(plan.upfrontCents)} for {plan.termMonths} months
            </dd>
          </div>
        )}
      </dl>
      {intro && (
        <p className="mt-4 text-small">
          The intro price applies for {plan.termMonths} months, then {formatCents(plan.renewalCents ?? 0)}/mo.
        </p>
      )}
      {plan.credits && <p className="mt-4 text-small">Included: {plan.credits}</p>}
      {plan.limits.length > 0 && (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-small text-muted">
          {plan.limits.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      )}
      {plan.note && <p className="mt-3 text-small text-muted">Note: {plan.note}</p>}
      <p className="mt-4 border-t border-line pt-3 text-[0.75rem] text-muted">
        Shown as {plan.currencyShown}. <ExternalLink href={plan.source}>Vendor pricing page</ExternalLink>, accessed{" "}
        {formatDate(plan.accessed)}. Prices can change; check at checkout.
      </p>
    </div>
  );
}

export function ResearchBasis({ tool }: { tool: Tool }) {
  return (
    <p className="text-small text-muted">
      Researched, not hands-on tested. Based on the vendor&apos;s own pages as of {formatDate(tool.lastReviewed)}.
    </p>
  );
}

export function Byline({ updated }: { updated: string }) {
  return (
    <p className="text-small text-muted">
      {siteConfig.brandName} Editorial Team · Updated {formatDate(updated)}
    </p>
  );
}
