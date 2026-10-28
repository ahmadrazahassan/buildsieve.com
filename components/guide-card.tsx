import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/format";
import { routes } from "@/lib/routes";
import type { Guide } from "@/lib/schema";

/** Thumbnail drawn in code from flat brand colors and line art; no stock photos. */
function GuideArt({ seed }: { seed: number }) {
  const lines = Array.from({ length: 5 }, (_, i) => i);
  return (
    <svg viewBox="0 0 320 160" aria-hidden="true" className="h-full w-full">
      <rect width="320" height="160" className="fill-primary-tint" />
      {lines.map((i) => (
        <line
          key={i}
          x1={24 + i * 8}
          y1={130 - i * 14}
          x2={296 - ((seed * 17 + i * 23) % 90)}
          y2={130 - i * 14}
          className={i === seed % 5 ? "stroke-primary" : "stroke-ink"}
          strokeWidth="1.5"
        />
      ))}
      <rect x={232 - (seed % 3) * 30} y="28" width="40" height="40" fill="none" className="stroke-ink" strokeWidth="1.5" />
    </svg>
  );
}

export function GuideCard({ guide }: { guide: Guide }) {
  const seed = guide.slug.length;
  return (
    <article className="relative flex h-full min-w-0 flex-col overflow-hidden rounded-card border border-line bg-surface">
      <div className="aspect-[2/1] border-b border-line">
        <GuideArt seed={seed} />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-small text-muted">
          {guide.tag} · {formatDate(guide.updated)}
        </p>
        <h3 className="mt-3 font-display text-[1.375rem] font-medium leading-tight">
          <Link href={routes.guide(guide.slug)} className="after:absolute after:inset-0">
            {guide.title}
          </Link>
        </h3>
        <p className="mt-auto flex items-center gap-2 pt-6 text-small font-medium">
          Read more <ArrowRight className="size-4" strokeWidth={1.5} aria-hidden="true" />
        </p>
      </div>
    </article>
  );
}
