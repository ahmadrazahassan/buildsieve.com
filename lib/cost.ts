import type { Plan } from "./schema.ts";

export type CostBreakdown = {
  year1Cents: number;
  year3Cents: number;
  months: { month: number; cents: number }[];
  introMonths: number;
};

/**
 * Monthly price for a given month (1-based): intro price during the term, renewal price after it.
 * When the vendor states the up-front charge for the term, that exact amount is spread over the
 * term, so a $250 yearly plan totals $250 rather than 12 x $20.83. May be fractional; totals round.
 */
export function priceForMonth(plan: Plan, month: number): number {
  const exactIntro = plan.upfrontCents !== undefined ? plan.upfrontCents / plan.termMonths : plan.introCents;
  if (month <= plan.termMonths) return exactIntro;
  if (plan.renewalCents === null || plan.renewalCents === plan.introCents) return exactIntro;
  return plan.renewalCents;
}

/**
 * True cost over a number of months for one plan and seat count.
 * Monthly plans renew at the same price unless the vendor shows an intro offer.
 */
export function trueCost(plan: Plan, months: number, seats = 1): number {
  const s = plan.perSeat ? Math.max(1, seats) : 1;
  let total = 0;
  for (let m = 1; m <= months; m++) total += priceForMonth(plan, m) * s;
  return Math.round(total);
}

export function costBreakdown(plan: Plan, seats = 1): CostBreakdown {
  const months = [];
  let running = 0;
  for (let m = 1; m <= 36; m++) {
    running += priceForMonth(plan, m) * (plan.perSeat ? Math.max(1, seats) : 1);
    months.push({ month: m, cents: Math.round(running) });
  }
  return {
    year1Cents: trueCost(plan, 12, seats),
    year3Cents: trueCost(plan, 36, seats),
    months,
    introMonths: Math.min(plan.termMonths, 36),
  };
}

export function hasIntroOffer(plan: Plan): boolean {
  return plan.renewalCents !== null && plan.renewalCents !== plan.introCents;
}

/** Cheapest paid plan by renewal price ("From $X/mo" always means the renewal price). */
export function cheapestPaidPlan(plans: Plan[]): Plan | undefined {
  return plans
    .filter((p) => p.introCents > 0)
    .toSorted((a, b) => (a.renewalCents ?? a.introCents) - (b.renewalCents ?? b.introCents))[0];
}

/** Average monthly cost over 36 months of the cheapest paid plan, or null without verified USD prices. */
export function avgMonthlyThreeYears(plans: Plan[]): number | null {
  const usd = plans.filter((p) => p.currencyShown.startsWith("USD") || p.currencyShown.startsWith("$"));
  const cheapest = cheapestPaidPlan(usd);
  if (!cheapest) return null;
  return Math.round(trueCost(cheapest, 36) / 36);
}
