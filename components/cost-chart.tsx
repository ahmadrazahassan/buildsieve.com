import { costBreakdown } from "@/lib/cost";
import { formatCents } from "@/lib/format";
import type { Plan } from "@/lib/schema";

/** Hand-made SVG line chart with a table alternative. */
export function CostChart({ plans }: { plans: Plan[] }) {
  const series = plans.map((p) => ({ plan: p, b: costBreakdown(p) }));
  const max = Math.max(...series.map((s) => s.b.year3Cents), 1);
  const W = 720;
  const H = 280;
  const pad = { l: 64, r: 16, t: 16, b: 32 };
  const x = (m: number) => pad.l + ((m - 1) / 35) * (W - pad.l - pad.r);
  const y = (c: number) => H - pad.b - (c / max) * (H - pad.t - pad.b);
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(max * f));

  return (
    <figure className="mt-6">
      <div className="relative overflow-x-auto rounded-card border border-line bg-surface p-4" role="region" aria-label="Cost chart" tabIndex={0}>
        <svg viewBox={`0 0 ${W} ${H}`} className="min-w-[560px]" role="img" aria-label="Cumulative cost per plan over 36 months; see the table below for values">
          {ticks.map((t) => (
            <g key={t}>
              <line x1={pad.l} x2={W - pad.r} y1={y(t)} y2={y(t)} className="stroke-line" />
              <text x={pad.l - 8} y={y(t) + 4} textAnchor="end" className="fill-muted text-[11px]">
                {formatCents(t)}
              </text>
            </g>
          ))}
          {[1, 12, 24, 36].map((m) => (
            <text key={m} x={x(m)} y={H - 10} textAnchor="middle" className="fill-muted text-[11px]">
              Month {m}
            </text>
          ))}
          {series.map((s, i) => (
            <polyline
              key={s.plan.name}
              fill="none"
              strokeWidth={i === 0 ? 2 : 1.5}
              strokeDasharray={i % 3 === 1 ? "6 4" : i % 3 === 2 ? "2 4" : undefined}
              className={i === 0 ? "stroke-primary" : "stroke-ink"}
              points={s.b.months.map((m) => `${x(m.month)},${y(m.cents)}`).join(" ")}
            />
          ))}
        </svg>
      </div>
      <figcaption className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-small text-muted">
        {series.map((s, i) => (
          <span key={s.plan.name}>
            {i === 0 ? "Solid primary line" : i % 3 === 1 ? "Dashed line" : i % 3 === 2 ? "Dotted line" : "Solid line"}:{" "}
            {s.plan.name}
          </span>
        ))}
      </figcaption>
      <div className="relative mt-6 overflow-x-auto" role="region" aria-label="Cost table" tabIndex={0}>
        <table className="tabular w-full min-w-[480px] text-left text-small">
          <caption className="sr-only">Cumulative cost per plan</caption>
          <thead>
            <tr className="border-b border-ink">
              <th scope="col" className="py-2 pr-4 font-medium">Plan</th>
              <th scope="col" className="py-2 pr-4 font-medium">Month 1</th>
              <th scope="col" className="py-2 pr-4 font-medium">Year one</th>
              <th scope="col" className="py-2 pr-4 font-medium">Year two</th>
              <th scope="col" className="py-2 font-medium">Year three</th>
            </tr>
          </thead>
          <tbody>
            {series.map((s) => (
              <tr key={s.plan.name} className="border-b border-line">
                <th scope="row" className="py-2 pr-4 font-normal">{s.plan.name}</th>
                <td className="py-2 pr-4">{formatCents(s.b.months[0].cents)}</td>
                <td className="py-2 pr-4">{formatCents(s.b.months[11].cents)}</td>
                <td className="py-2 pr-4">{formatCents(s.b.months[23].cents)}</td>
                <td className="py-2">{formatCents(s.b.months[35].cents)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}
