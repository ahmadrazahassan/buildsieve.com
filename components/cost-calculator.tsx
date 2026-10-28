"use client";

import Link from "next/link";
import { parseAsInteger, parseAsString, useQueryStates } from "nuqs";
import { costBreakdown, hasIntroOffer } from "@/lib/cost";
import { formatCents, formatDate } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { Tool } from "@/lib/schema";

const field = "min-h-12 w-full border border-ink bg-surface px-3 text-body";

export function CostCalculator({ tools }: { tools: Tool[] }) {
  const priced = tools.filter((t) => t.plans.length > 0);
  const [q, setQ] = useQueryStates(
    { tool: parseAsString.withDefault(priced[0]?.slug ?? ""), plan: parseAsInteger.withDefault(0), seats: parseAsInteger.withDefault(1), extra: parseAsInteger.withDefault(0) },
    { history: "replace" },
  );
  const tool = priced.find((t) => t.slug === q.tool) ?? priced[0];
  const plan = tool?.plans[q.plan] ?? tool?.plans[0];
  if (!tool || !plan) return null;
  const seats = plan.perSeat ? Math.max(1, Math.min(q.seats, 100)) : 1;
  const b = costBreakdown(plan, seats);
  const extra = Math.max(0, q.extra) * 100;
  const y1 = b.year1Cents + extra * 12;
  const y3 = b.year3Cents + extra * 36;

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <form className="space-y-5 lg:col-span-5" onSubmit={(e) => e.preventDefault()} aria-label="Cost inputs">
        <label className="block text-small">
          <span className="text-muted">Tool</span>
          <select className={field} value={tool.slug} onChange={(e) => setQ({ tool: e.target.value, plan: 0 })}>
            {priced.map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-small">
          <span className="text-muted">Plan and billing term</span>
          <select className={field} value={q.plan} onChange={(e) => setQ({ plan: Number(e.target.value) })}>
            {tool.plans.map((p, i) => (
              <option key={p.name} value={i}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        {plan.perSeat && (
          <label className="block text-small">
            <span className="text-muted">Seats</span>
            <input type="number" min={1} max={100} className={field} value={seats} onChange={(e) => setQ({ seats: Number(e.target.value) || 1 })} />
          </label>
        )}
        <label className="block text-small">
          <span className="text-muted">Expected extra spend per month on credits or add-ons (USD)</span>
          <input
            type="number"
            min={0}
            step={1}
            className={field}
            value={q.extra}
            onChange={(e) => setQ({ extra: Math.max(0, Number(e.target.value) || 0) })}
            aria-describedby="extra-help"
          />
          <span id="extra-help" className="mt-1 block text-muted">
            Your own estimate. We do not know your usage, so this is added as you enter it.
          </span>
        </label>
      </form>

      <div className="min-w-0 lg:col-span-7" aria-live="polite">
        <div className="rounded-card border border-line bg-surface p-6 md:p-8">
          <dl className="tabular grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-small text-muted">First 12 months</dt>
              <dd className="font-display text-h2 font-medium">{formatCents(y1)}</dd>
            </div>
            <div>
              <dt className="text-small text-muted">First 36 months</dt>
              <dd className="font-display text-h2 font-medium">{formatCents(y3)}</dd>
            </div>
          </dl>
          <p className="mt-6">
            {hasIntroOffer(plan)
              ? `You pay the intro price of ${formatCents(plan.introCents)} a month for ${plan.termMonths} months${seats > 1 ? ` per seat` : ""}, then the renewal price of ${formatCents(plan.renewalCents ?? 0)} a month.`
              : `${plan.name} costs ${formatCents(plan.introCents)} a month${seats > 1 ? " per seat" : ""} and the vendor page shows no intro discount.`}
            {seats > 1 && ` With ${seats} seats the plan price is multiplied by ${seats}.`}
            {plan.upfrontCents !== undefined && ` The vendor charges ${formatCents(plan.upfrontCents)} up front for the term.`}
            {extra > 0 && ` Your estimate adds ${formatCents(extra)} a month.`}
          </p>
          {plan.credits && <p className="mt-3 text-small text-muted">Included: {plan.credits}.</p>}
          <p className="mt-6 border-t border-line pt-4 text-small text-muted">
            Price from the{" "}
            <a href={plan.source} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">
              vendor pricing page
            </a>
            , accessed {formatDate(plan.accessed)}, shown as {plan.currencyShown}. Taxes are not included.{" "}
            <Link href={routes.toolPricing(tool.slug)} className="underline underline-offset-2">
              All {tool.name} plans
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
