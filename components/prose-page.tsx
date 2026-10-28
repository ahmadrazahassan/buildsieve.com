import type { ReactNode } from "react";
import { siteConfig, isPlaceholder } from "@/site.config";
import { Breadcrumbs } from "./blocks";

export function ProsePage({
  title,
  href,
  lead,
  updated,
  children,
}: {
  title: string;
  href: string;
  lead?: ReactNode;
  updated?: string;
  children: ReactNode;
}) {
  return (
    <article className="container-site py-8">
      <Breadcrumbs items={[{ name: title, href }]} />
      <header className="mt-8 max-w-4xl">
        <h1 className="font-display text-h1 font-medium">{title}</h1>
        {lead && <p className="mt-6 text-body text-muted">{lead}</p>}
        {updated && <p className="mt-4 text-small text-muted">Last updated {updated}</p>}
      </header>
      <div className="prose-site measure mt-12 space-y-10 [&_h2]:font-display [&_h2]:text-h3 [&_h2]:font-medium [&_li]:mt-1 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
        {children}
      </div>
    </article>
  );
}

/** Owner data from site.config.ts; open placeholders are clearly marked, never invented. */
export function OwnerValue({ value, label }: { value: string; label: string }) {
  if (!isPlaceholder(value)) return <>{value}</>;
  return (
    <mark className="bg-primary-tint px-1 text-ink" title={`Open placeholder ${value} in site.config.ts`}>
      [{label}: to be provided by the site owner]
    </mark>
  );
}

export const brand = siteConfig.brandName;
