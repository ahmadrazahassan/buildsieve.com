"use client";

import Link from "next/link";
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tab = { slug: string; name: string; intro: string; content: ReactNode };

/** WAI-ARIA tabs with arrow-key support and a sliding underline. */
export function CategoryTabs({ tabs }: { tabs: Tab[] }) {
  const [active, setActive] = useState(0);
  const id = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKey = (e: KeyboardEvent) => {
    const dir = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    const next = (active + dir + tabs.length) % tabs.length;
    setActive(next);
    refs.current[next]?.focus();
  };

  return (
    <div>
      <div role="tablist" aria-label="Categories" className="relative flex gap-6 border-b border-line" onKeyDown={onKey}>
        {tabs.map((t, i) => (
          <button
            key={t.slug}
            ref={(el) => {
              refs.current[i] = el;
            }}
            role="tab"
            id={`${id}-tab-${i}`}
            aria-selected={active === i}
            aria-controls={`${id}-panel-${i}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            className={cn(
              "relative min-h-11 pb-3 font-display text-[1.25rem] font-medium transition-colors",
              active === i ? "text-ink" : "text-muted hover:text-ink",
            )}
          >
            {t.name}
            <span
              aria-hidden="true"
              className={cn(
                "absolute inset-x-0 -bottom-px h-0.5 origin-left bg-primary transition-transform duration-300 ease-out",
                active === i ? "scale-x-100" : "scale-x-0",
              )}
            />
          </button>
        ))}
      </div>
      {tabs.map((t, i) => (
        <div
          key={t.slug}
          role="tabpanel"
          id={`${id}-panel-${i}`}
          aria-labelledby={`${id}-tab-${i}`}
          hidden={active !== i}
          className="pt-8"
        >
          <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <p className="max-w-2xl text-muted">{t.intro}</p>
            <Link href={`/best/${t.slug}`} className="shrink-0 underline underline-offset-4">
              See the full ranking
            </Link>
          </div>
          {t.content}
        </div>
      ))}
    </div>
  );
}
