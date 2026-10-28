"use client";

import Link from "next/link";
import { parseAsArrayOf, parseAsBoolean, parseAsString, useQueryStates } from "nuqs";
import { cheapestPaidPlan, trueCost } from "@/lib/cost";
import { factItems, factLabel } from "@/lib/facts";
import { formatCents, formatScore } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { Tool } from "@/lib/schema";
import { cn } from "@/lib/cn";
import { ToolLogo } from "./tool-logo";

export type CompareTool = Tool & { score: number; category: string; categoryName: string };

type Row = { label: string; values: (string | null)[]; group: string };

function buildRows(tools: CompareTool[]): Row[] {
  const rows: Row[] = [];
  const cheapest = tools.map((t) => cheapestPaidPlan(t.plans));
  rows.push({ group: "Overview", label: "Category", values: tools.map((t) => t.categoryName) });
  rows.push({ group: "Overview", label: "Research Score", values: tools.map((t) => formatScore(t.score)) });
  rows.push({ group: "Cost", label: "Free plan", values: tools.map((t) => (t.freePlan ? "Yes" : "No")) });
  rows.push({ group: "Cost", label: "Free trial", values: tools.map((t) => (t.trialDays ? `${t.trialDays} days` : "None stated")) });
  rows.push({
    group: "Cost",
    label: "Cheapest paid plan (renewal)",
    values: cheapest.map((p) => (p ? `${p.name}: ${formatCents(p.renewalCents ?? p.introCents)}/mo` : null)),
  });
  rows.push({ group: "Cost", label: "Year one cost", values: cheapest.map((p) => (p ? formatCents(trueCost(p, 12)) : null)) });
  rows.push({ group: "Cost", label: "Three-year cost", values: cheapest.map((p) => (p ? formatCents(trueCost(p, 36)) : null)) });
  const ids = [...new Map(tools.flatMap((t) => factItems[t.category] ?? []).map((i) => [i.id, i])).values()];
  for (const i of ids) {
    rows.push({
      group: i.group,
      label: i.label,
      values: tools.map((t) => {
        const inList = (factItems[t.category] ?? []).some((x) => x.id === i.id);
        return inList ? factLabel[t.facts[i.id]?.value ?? "unknown"] : "Not in this category's list";
      }),
    });
  }
  return rows;
}

function highlights(tools: CompareTool[]) {
  const out: string[] = [];
  const priced = tools.map((t) => ({ t, p: cheapestPaidPlan(t.plans) })).filter((x) => x.p);
  if (priced.length) {
    const best = priced.toSorted((a, b) => trueCost(a.p!, 12) - trueCost(b.p!, 12))[0];
    out.push(`Lowest year one cost: ${best.t.name} (${formatCents(trueCost(best.p!, 12))} on ${best.p!.name})`);
  }
  const noPrice = tools.filter((t) => !cheapestPaidPlan(t.plans));
  if (noPrice.length) out.push(`No verified US price: ${noPrice.map((t) => t.name).join(", ")} (not counted)`);
  const trials = tools.filter((t) => t.trialDays);
  if (trials.length) {
    const longest = trials.toSorted((a, b) => (b.trialDays ?? 0) - (a.trialDays ?? 0))[0];
    out.push(`Longest free trial: ${longest.name} (${longest.trialDays} days)`);
  }
  const top = tools.toSorted((a, b) => b.score - a.score)[0];
  out.push(`Highest Research Score: ${top.name} (${formatScore(top.score)})`);
  return out;
}

export function CompareToolView({ tools }: { tools: CompareTool[] }) {
  const [q, setQ] = useQueryStates(
    { tools: parseAsArrayOf(parseAsString).withDefault([]), diff: parseAsBoolean.withDefault(false) },
    { history: "replace" },
  );
  const selected = q.tools.map((s) => tools.find((t) => t.slug === s)).filter((t): t is CompareTool => !!t).slice(0, 3);
  const rows = selected.length >= 2 ? buildRows(selected) : [];
  const shown = q.diff ? rows.filter((r) => new Set(r.values).size > 1) : rows;
  const groups = [...new Set(shown.map((r) => r.group))];

  const setSlot = (i: number, slug: string) => {
    const next = [...q.tools];
    if (slug) next[i] = slug;
    else next.splice(i, 1);
    setQ({ tools: [...new Set(next.filter(Boolean))] });
  };

  return (
    <div>
      <div className="grid gap-3 md:grid-cols-3" role="group" aria-label="Choose tools to compare">
        {[0, 1, 2].map((i) => (
          <label key={i} className="flex flex-col gap-1 text-small">
            <span className="text-muted">Tool {i + 1}{i === 2 && " (optional)"}</span>
            <select
              className="min-h-12 border border-ink bg-surface px-3 text-body"
              value={q.tools[i] ?? ""}
              disabled={i > q.tools.length}
              onChange={(e) => setSlot(i, e.target.value)}
            >
              <option value="">Choose a tool</option>
              {tools.map((t) => (
                <option key={t.slug} value={t.slug} disabled={q.tools.includes(t.slug) && q.tools[i] !== t.slug}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      {selected.length < 2 ? (
        <p className="mt-10 rounded-card border border-line bg-surface p-6 text-muted">
          Choose at least two tools to see them side by side.
        </p>
      ) : (
        <>
          <div className="mt-8 rounded-card border border-line bg-surface p-6">
            <h2 className="font-medium">Highlights</h2>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-small">
              {highlights(selected).map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
            <p className="mt-3 text-small text-muted">Computed from stored values only. Tools without a stated value are never counted as winners.</p>
          </div>

          <label className="mt-8 inline-flex min-h-11 cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              role="switch"
              checked={q.diff}
              onChange={(e) => setQ({ diff: e.target.checked || null })}
              className="size-5 accent-primary"
            />
            <span>Highlight differences only</span>
          </label>

          {/* Desktop table with sticky header and first column */}
          <div className="relative mt-6 hidden max-h-[80vh] overflow-auto border border-line bg-surface md:block" role="region" aria-label="Comparison table" tabIndex={0}>
            <table className="w-full text-left text-small">
              <thead className="sticky top-0 z-10 bg-surface">
                <tr className="border-b border-ink">
                  <th scope="col" className="sticky left-0 bg-surface p-4 font-medium">Fact</th>
                  {selected.map((t) => (
                    <th key={t.slug} scope="col" className="p-4">
                      <Link href={routes.tool(t.slug)} className="inline-flex items-center gap-3 font-display text-[1.25rem] font-medium hover:text-primary">
                        <ToolLogo tool={t} size={32} />
                        {t.name}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              {groups.map((g) => (
                <tbody key={g}>
                  <tr>
                    <th colSpan={selected.length + 1} scope="colgroup" className="bg-bg px-4 py-2 text-[0.75rem] font-medium uppercase tracking-[0.08em] text-muted">
                      {g}
                    </th>
                  </tr>
                  {shown
                    .filter((r) => r.group === g)
                    .map((r) => (
                      <tr key={r.label} className="border-b border-line">
                        <th scope="row" className="sticky left-0 bg-surface p-4 font-normal">{r.label}</th>
                        {r.values.map((v, i) => (
                          <td key={i} className={cn("tabular p-4", (v === "Unknown" || v === null) && "text-muted")}>
                            {v ?? "No verified US price"}
                          </td>
                        ))}
                      </tr>
                    ))}
                </tbody>
              ))}
            </table>
          </div>

          {/* Phones: each row is a label with the values side by side */}
          <div className="mt-6 space-y-6 md:hidden">
            {groups.map((g) => (
              <section key={g}>
                <h3 className="eyebrow text-muted">{g}</h3>
                <dl className="mt-2 divide-y divide-line border-y border-line">
                  {shown
                    .filter((r) => r.group === g)
                    .map((r) => (
                      <div key={r.label} className="py-3">
                        <dt className="font-medium">{r.label}</dt>
                        <dd className="mt-1 grid gap-2" style={{ gridTemplateColumns: `repeat(${selected.length}, minmax(0, 1fr))` }}>
                          {r.values.map((v, i) => (
                            <span key={i} className="min-w-0 text-small break-words">
                              <span className="block text-[0.75rem] text-muted">{selected[i].name}</span>
                              {v ?? "No verified US price"}
                            </span>
                          ))}
                        </dd>
                      </div>
                    ))}
                </dl>
              </section>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
