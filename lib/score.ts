import { avgMonthlyThreeYears } from "./cost.ts";
import { criteria, factItems, factPoints, type Criterion } from "./facts.ts";
import type { Tool } from "./schema.ts";

// Average monthly cost over three years at which the cost criterion reaches zero.
export const COST_CEILING_CENTS: Record<string, number> = {
  "ai-website-builders": 6000,
  "ai-app-builders": 15000,
};
// At or below this average monthly cost the cost criterion is full.
export const COST_FLOOR_CENTS = 1000;

export type ScoreLine = { id: string; label: string; value: string; points: number; note?: string };
export type CriterionResult = {
  id: Criterion;
  label: string;
  weight: number;
  ratio: number; // 0..1
  lines: ScoreLine[];
  rule?: string;
};
export type ScoreResult = { score: number; criteria: CriterionResult[]; category: string };

export function costRatio(avgCents: number | null, category: string, freePlan: boolean): { ratio: number; rule: string } {
  const ceiling = COST_CEILING_CENTS[category] ?? 10000;
  const freePart = freePlan ? 0.2 : 0;
  if (avgCents === null) {
    return {
      ratio: freePart,
      rule: `No verified USD price, so the price part scores 0 of 0.8. Free plan: ${freePlan ? "0.2" : "0"} of 0.2.`,
    };
  }
  const span = ceiling - COST_FLOOR_CENTS;
  const pricePart = 0.8 * Math.min(1, Math.max(0, (ceiling - avgCents) / span));
  return {
    ratio: pricePart + freePart,
    rule: `Price part: 0.8 at or below $${COST_FLOOR_CENTS / 100}/mo averaged over 36 months, falling to 0 at $${ceiling / 100}/mo (${pricePart.toFixed(2)}). Free plan: ${freePlan ? "0.2" : "0"} of 0.2.`,
  };
}

/** Research score 0.0 to 10.0, computed from sourced facts and prices only. */
export function researchScore(tool: Tool, category: string): ScoreResult {
  const items = factItems[category] ?? [];
  const results: CriterionResult[] = criteria.map((c) => {
    if (c.id === "cost") {
      const avg = avgMonthlyThreeYears(tool.plans);
      const { ratio, rule } = costRatio(avg, category, tool.freePlan);
      return { ...c, ratio, lines: [], rule };
    }
    const own = items.filter((i) => i.criterion === c.id);
    const lines = own.map((i) => {
      const fact = tool.facts[i.id];
      const value = fact?.value ?? "unknown";
      return { id: i.id, label: i.label, value, points: factPoints[value] ?? 0, note: fact?.note };
    });
    const ratio = lines.length ? lines.reduce((s, l) => s + l.points, 0) / lines.length : 0;
    return { ...c, ratio, lines };
  });
  const raw = results.reduce((s, r) => s + r.ratio * r.weight, 0) * 10;
  return { score: Math.round(raw * 10) / 10, criteria: results, category };
}
