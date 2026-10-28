import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "dark" | "outline";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-primary-hover",
  dark: "bg-ink text-white hover:bg-primary-hover",
  outline: "border border-ink text-ink hover:bg-ink hover:text-white",
};

const base =
  "inline-flex min-h-11 items-center justify-center px-5 text-[0.9375rem] font-medium leading-none transition-colors duration-200 ease-out disabled:opacity-50";

export function Button({ variant = "dark", className, ...props }: ComponentProps<"button"> & { variant?: Variant }) {
  return <button className={cn(base, variants[variant], className)} {...props} />;
}

export function ButtonLink({
  variant = "dark",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant }) {
  return <Link className={cn(base, variants[variant], className)} {...props} />;
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("eyebrow text-muted", className)}>{children}</p>;
}

export function Panel({
  children,
  tone = "surface",
  className,
  ...rest
}: { children: ReactNode; tone?: "surface" | "bg" | "ink"; className?: string } & ComponentProps<"section">) {
  return (
    <section
      className={cn(
        "mx-3 rounded-panel-sm py-16 md:mx-4 md:rounded-panel md:py-24",
        tone === "surface" && "bg-surface",
        tone === "bg" && "bg-bg",
        tone === "ink" && "bg-ink text-white",
        className,
      )}
      {...rest}
    >
      <div className="container-site">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  aside,
  id,
}: {
  eyebrow?: string;
  title: string;
  aside?: ReactNode;
  id?: string;
}) {
  return (
    <div className="mb-10 grid gap-4 md:mb-14 md:grid-cols-12 md:items-end">
      <div className="min-w-0 md:col-span-8">
        {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
        <h2 id={id} className="rise-on-scroll font-display text-h2 font-medium">
          {title}
        </h2>
      </div>
      {aside && <div className="min-w-0 text-small text-muted md:col-span-4">{aside}</div>}
    </div>
  );
}

export function Tag({ children, tone = "line" }: { children: ReactNode; tone?: "line" | "primary" | "draft" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.75rem] font-medium",
        tone === "line" && "border border-line text-muted",
        tone === "primary" && "bg-primary-tint text-ink",
        tone === "draft" && "bg-ink text-white",
      )}
    >
      {children}
    </span>
  );
}

export function ExternalLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cn("underline underline-offset-2", className)}>
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
