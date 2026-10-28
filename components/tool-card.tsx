import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { getCategory, getScore } from "@/lib/content";
import { cheapestPaidPlan, hasIntroOffer } from "@/lib/cost";
import { formatCents } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { Tool } from "@/lib/schema";
import { ScoreBadge } from "./score";
import { ToolLogo } from "./tool-logo";

export function FromPrice({ tool }: { tool: Tool }) {
  const p = cheapestPaidPlan(tool.plans);
  if (!p) return <span className="text-small text-muted">No verified US price</span>;
  const renewal = p.renewalCents ?? p.introCents;
  return (
    <span className="text-small">
      From <strong className="tabular font-medium">{formatCents(renewal)}/mo</strong>
      {hasIntroOffer(p) && <span className="text-muted"> (intro {formatCents(p.introCents)}/mo)</span>}
    </span>
  );
}

function KeyFact({ ok, label }: { ok: boolean | null; label: string }) {
  return (
    <li className="flex items-center gap-2 text-small">
      {ok ? (
        <Check className="size-4 text-positive" strokeWidth={1.5} aria-hidden="true" />
      ) : (
        <Minus className="size-4 text-muted" strokeWidth={1.5} aria-hidden="true" />
      )}
      <span className={ok ? "" : "text-muted"}>
        {label}
        {ok === null ? ": unknown" : ok ? "" : ": no"}
      </span>
    </li>
  );
}

const fact = (t: Tool, id: string): boolean | null => {
  const v = t.facts[id]?.value;
  if (!v || v === "unknown") return null;
  return v !== "no";
};

export function ToolCard({ tool, category, rank }: { tool: Tool; category?: string; rank?: number }) {
  const score = getScore(tool, category);
  const cat = getCategory(category ?? tool.categories[0]);
  return (
    <article className="relative flex h-full min-w-0 flex-col rounded-card border border-line bg-surface p-6 transition-colors hover:border-ink">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-4 flex items-center gap-3">
            <ToolLogo tool={tool} size={40} />
            {rank !== undefined && <p className="tabular text-small text-muted">No. {rank}</p>}
          </div>
          <h3 className="font-display text-h3 font-medium break-words">
            <Link href={routes.tool(tool.slug)} className="after:absolute after:inset-0">
              {tool.name}
            </Link>
          </h3>
          {cat && <p className="mt-1 text-small text-muted">{cat.singular}</p>}
        </div>
        {score && <ScoreBadge score={score.score} size="sm" />}
      </div>
      <p className="mt-4 text-small text-muted">{tool.summary}</p>
      <ul className="mt-5 space-y-1.5">
        <KeyFact ok={tool.freePlan} label="Free plan" />
        <KeyFact ok={fact(tool, "custom_domain")} label="Custom domain" />
        <KeyFact ok={fact(tool, "code_export")} label="Code export" />
      </ul>
      <div className="mt-auto border-t border-line pt-4">
        <FromPrice tool={tool} />
      </div>
    </article>
  );
}
