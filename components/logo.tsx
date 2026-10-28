import { cn } from "@/lib/cn";
import { siteConfig } from "@/site.config";

/**
 * Proposed mark: a sieve drawn on a 16 px grid, three ink bars with one primary bar
 * passing through. Flat, whole-pixel edges, no container.
 */
export function LogoMark({ className, mono = false }: { className?: string; mono?: boolean }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" className={cn("size-5 shrink-0", className)}>
      <rect x="1" y="2" width="14" height="2" fill="currentColor" />
      <rect x="3" y="7" width="10" height="2" fill="currentColor" />
      <rect x="6" y="12" width="4" height="2" className={mono ? "fill-current" : "fill-primary"} />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LogoMark />
      <span className="font-display text-[1.375rem] font-medium tracking-[-0.03em]">{siteConfig.brandName}</span>
    </span>
  );
}
