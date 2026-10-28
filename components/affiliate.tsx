import Link from "next/link";
import { ExternalLink as ExternalIcon } from "lucide-react";
import { cn } from "@/lib/cn";
import { anyAffiliate, hasAffiliate } from "@/lib/content";
import { routes, type GoPlace } from "@/lib/routes";
import type { Tool } from "@/lib/schema";

/**
 * "Visit {Tool}". Always links to our /go/[slug] redirect, which sends the visitor to the
 * affiliate URL when an approved program is active, or to the vendor's site without tracking.
 * The label and rel="sponsored" appear only when the click can earn a commission.
 */
export function VisitButton({
  tool,
  from,
  pos,
  variant = "primary",
  className,
}: {
  tool: Tool;
  from: GoPlace;
  pos?: number;
  variant?: "primary" | "dark" | "outline";
  className?: string;
}) {
  const affiliate = hasAffiliate(tool.slug);
  return (
    <span className="inline-flex flex-col items-start gap-1">
      <a
        href={routes.go(tool.slug, from, pos)}
        target="_blank"
        rel={affiliate ? "sponsored nofollow noopener" : "nofollow noopener"}
        className={cn(
          "inline-flex min-h-11 items-center justify-center gap-2 px-5 text-[0.9375rem] font-medium transition-colors duration-200",
          variant === "primary" && "bg-primary text-white hover:bg-primary-hover",
          variant === "dark" && "bg-ink text-white hover:bg-primary-hover",
          variant === "outline" && "border border-ink hover:bg-ink hover:text-white",
          className,
        )}
      >
        Visit {tool.name}
        <ExternalIcon className="size-4" strokeWidth={1.5} aria-hidden="true" />
        <span className="sr-only"> (opens the vendor&apos;s site in a new tab)</span>
      </a>
      {affiliate && (
        <Link href={routes.money()} className="text-[0.75rem] text-muted underline underline-offset-2">
          Affiliate link
        </Link>
      )}
    </span>
  );
}

/** Commission notice: once per page near the first affiliate link. Hidden while no affiliate link is active. */
export function AffiliateNote({ className }: { className?: string }) {
  if (!anyAffiliate()) return null;
  return (
    <p className={cn("text-small text-muted", className)}>
      Some links on this page are affiliate links. If you sign up, we may earn a commission. It never changes a
      score, a ranking or a Finder result.{" "}
      <Link href={routes.money()} className="underline underline-offset-2">
        How we make money
      </Link>
    </p>
  );
}
