import Link from "next/link";
import { factLabel } from "@/lib/facts";
import { formatScore } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { ScoreResult } from "@/lib/score";
import { cn } from "@/lib/cn";
import { siteConfig } from "@/site.config";

export function ScoreBadge({ score, size = "md" }: { score: number; size?: "sm" | "md" | "lg" }) {
  return (
    <span className="inline-flex flex-col">
      <span
        className={cn(
          "tabular font-display font-medium leading-none tracking-[-0.03em]",
          size === "sm" && "text-[1.5rem]",
          size === "md" && "text-[2.25rem]",
          size === "lg" && "text-[4rem]",
        )}
      >
        {formatScore(score)}
        <span className="text-[0.45em] text-muted"> / 10</span>
      </span>
      <span className="mt-1 text-[0.75rem] text-muted">Research Score</span>
    </span>
  );
}

function Bar({ ratio, label }: { ratio: number; label: string }) {
  return (
    <div className="h-1.5 w-full bg-line" role="img" aria-label={label}>
      <div className="h-full bg-primary" style={{ width: `${Math.round(ratio * 100)}%` }} />
    </div>
  );
}

export function ScoreSummary({ result }: { result: ScoreResult }) {
  return (
    <div>
      <ScoreBadge score={result.score} size="lg" />
      <dl className="mt-8 space-y-4">
        {result.criteria.map((c) => (
          <div key={c.id}>
            <div className="mb-1.5 flex justify-between gap-4 text-small">
              <dt>
                {c.label} <span className="text-muted">({Math.round(c.weight * 100)}%)</span>
              </dt>
              <dd className="tabular text-muted">{Math.round(c.ratio * 100)}%</dd>
            </div>
            <Bar ratio={c.ratio} label={`${c.label}: ${Math.round(c.ratio * 100)}% of the possible points`} />
          </div>
        ))}
        <div className="flex justify-between gap-4 border-t border-line pt-4 text-small">
          <dt>Ease of use</dt>
          <dd className="text-muted">Not scored: needs hands-on testing</dd>
        </div>
      </dl>
      <p className="mt-6 text-small text-muted">
        {siteConfig.scoreName}, method {siteConfig.scoreMethodVersion}.{" "}
        <Link href={routes.methodology()} className="underline underline-offset-2">
          How the score works
        </Link>
      </p>
    </div>
  );
}

/** Full derivation: each fact with its points and the price rule. */
export function ScoreDerivation({ result }: { result: ScoreResult }) {
  return (
    <div className="space-y-8">
      {result.criteria.map((c) => (
        <div key={c.id}>
          <h4 className="font-display text-[1.125rem] font-medium">
            {c.label}{" "}
            <span className="tabular text-small font-normal text-muted">
              weight {Math.round(c.weight * 100)}%, earned {Math.round(c.ratio * 100)}%, adds{" "}
              {(c.ratio * c.weight * 10).toFixed(2)} points
            </span>
          </h4>
          {c.rule && <p className="mt-2 text-small text-muted">{c.rule}</p>}
          {c.lines.length > 0 && (
            <ul className="mt-3 divide-y divide-line border-y border-line text-small">
              {c.lines.map((l) => (
                <li key={l.id} className="grid grid-cols-[1fr_auto_auto] gap-4 py-2">
                  <span className="min-w-0">{l.label}</span>
                  <span className="text-muted">{factLabel[l.value]}</span>
                  <span className="tabular w-10 text-right">{l.points}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
      <p className="text-small text-muted">
        Total: sum of earned share times weight, times 10, rounded to one decimal ={" "}
        <strong className="tabular text-ink">{formatScore(result.score)}</strong>.
      </p>
    </div>
  );
}
