"use client";

import { parseAsBoolean, parseAsString, parseAsStringLiteral, useQueryStates } from "nuqs";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type ListItem = {
  slug: string;
  name: string;
  score: number;
  renewalCents: number | null;
  freePlan: boolean;
  trial: boolean;
  codeExport: boolean;
  customDomain: boolean;
  ecommerce: boolean;
  build: string[];
  level: string;
  card: ReactNode;
};

const sorts = ["score", "price", "name"] as const;
const sortText: Record<(typeof sorts)[number], string> = {
  score: "Sorted by Research Score, highest first. Ties are sorted by name.",
  price: "Sorted by the renewal price of the cheapest paid plan, lowest first. Tools without a verified US price come last.",
  name: "Sorted alphabetically by name.",
};

const buildLabels: Record<string, string> = {
  "business-site": "Business site",
  portfolio: "Portfolio",
  "online-store": "Online store",
  "landing-page": "Landing page",
  blog: "Blog",
  "web-app": "Web app",
  "internal-tool": "Internal tool",
  "mobile-app": "Mobile app",
};

const parsers = {
  sort: parseAsStringLiteral(sorts).withDefault("score"),
  build: parseAsString.withDefault(""),
  level: parseAsString.withDefault(""),
  max: parseAsString.withDefault(""),
  free: parseAsBoolean.withDefault(false),
  trial: parseAsBoolean.withDefault(false),
  export: parseAsBoolean.withDefault(false),
  domain: parseAsBoolean.withDefault(false),
  store: parseAsBoolean.withDefault(false),
};

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={cn(
        "min-h-11 border px-3 text-small transition-colors",
        on ? "border-ink bg-ink text-white" : "border-line bg-surface hover:border-ink",
      )}
    >
      {children}
    </button>
  );
}

const select = "min-h-11 border border-line bg-surface px-3 text-small";

export function CategoryList({ items, builds }: { items: ListItem[]; builds: string[] }) {
  const [q, setQ] = useQueryStates(parsers, { history: "replace", scroll: false });

  const filtered = items
    .filter((i) => !q.build || i.build.includes(q.build))
    .filter((i) => !q.level || i.level === q.level)
    .filter((i) => !q.max || (i.renewalCents !== null && i.renewalCents <= Number(q.max) * 100))
    .filter((i) => !q.free || i.freePlan)
    .filter((i) => !q.trial || i.trial)
    .filter((i) => !q.export || i.codeExport)
    .filter((i) => !q.domain || i.customDomain)
    .filter((i) => !q.store || i.ecommerce)
    .toSorted((a, b) => {
      if (q.sort === "name") return a.name.localeCompare(b.name);
      if (q.sort === "price") return (a.renewalCents ?? Infinity) - (b.renewalCents ?? Infinity) || a.name.localeCompare(b.name);
      return b.score - a.score || a.name.localeCompare(b.name);
    });

  const active = q.build || q.level || q.max || q.free || q.trial || q.export || q.domain || q.store;

  return (
    <div>
      <div className="flex flex-col gap-4 border-y border-line py-5" role="group" aria-label="Filters">
        <div className="flex flex-wrap gap-3">
          <label className="flex flex-col gap-1 text-small">
            <span className="text-muted">What you build</span>
            <select className={select} value={q.build} onChange={(e) => setQ({ build: e.target.value || null })}>
              <option value="">Anything</option>
              {builds.map((b) => (
                <option key={b} value={b}>
                  {buildLabels[b] ?? b}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-small">
            <span className="text-muted">Technical level</span>
            <select className={select} value={q.level} onChange={(e) => setQ({ level: e.target.value || null })}>
              <option value="">Any</option>
              <option value="no-code">No code</option>
              <option value="low-code">Low code</option>
              <option value="code-first">Code first</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-small">
            <span className="text-muted">Renewal price up to</span>
            <select className={select} value={q.max} onChange={(e) => setQ({ max: e.target.value || null })}>
              <option value="">Any price</option>
              <option value="15">$15/mo</option>
              <option value="30">$30/mo</option>
              <option value="60">$60/mo</option>
              <option value="100">$100/mo</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-small">
            <span className="text-muted">Sort by</span>
            <select className={select} value={q.sort} onChange={(e) => setQ({ sort: e.target.value as (typeof sorts)[number] })}>
              <option value="score">Research Score</option>
              <option value="price">Lowest renewal price</option>
              <option value="name">Name</option>
            </select>
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip on={q.free} onClick={() => setQ({ free: !q.free || null })}>Free plan</Chip>
          <Chip on={q.trial} onClick={() => setQ({ trial: !q.trial || null })}>Free trial</Chip>
          <Chip on={q.export} onClick={() => setQ({ export: !q.export || null })}>Code export documented</Chip>
          <Chip on={q.domain} onClick={() => setQ({ domain: !q.domain || null })}>Custom domain</Chip>
          <Chip on={q.store} onClick={() => setQ({ store: !q.store || null })}>Online store</Chip>
          {active && (
            <button
              type="button"
              className="min-h-11 px-3 text-small underline underline-offset-2"
              onClick={() => setQ({ build: null, level: null, max: null, free: null, trial: null, export: null, domain: null, store: null })}
            >
              Clear filters
            </button>
          )}
        </div>
      </div>
      <p className="mt-4 text-small text-muted" aria-live="polite">
        {filtered.length} of {items.length} tools. {sortText[q.sort]} Filters only use documented facts; unknown counts
        as not documented.
      </p>
      <ol className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((i) => (
          <li key={i.slug} className="min-w-0">
            {i.card}
          </li>
        ))}
      </ol>
      {filtered.length === 0 && (
        <p className="mt-6 rounded-card border border-line bg-surface p-6">No tool matches every filter. Try removing one.</p>
      )}
    </div>
  );
}
