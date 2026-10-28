import Link from "next/link";
import { getCategories, getUseCases } from "@/lib/content";
import { routes } from "@/lib/routes";
import { siteConfig } from "@/site.config";
import { AffiliateNote } from "./affiliate";
import { LogoMark } from "./logo";

export function SiteFooter() {
  const columns = [
    { title: "Categories", links: getCategories().map((c) => ({ href: routes.category(c.slug), label: c.name })) },
    { title: "Best for", links: getUseCases().map((u) => ({ href: routes.useCase(u.slug), label: u.title.replace(/^Best /, "") })) },
    {
      title: "Tools",
      links: [
        { href: routes.finder(), label: "Builder Finder" },
        { href: routes.compareTool(), label: "Compare" },
        { href: routes.costCalculator(), label: "Cost calculator" },
        { href: routes.glossary(), label: "Glossary" },
      ],
    },
    {
      title: "About",
      links: [
        { href: routes.methodology(), label: "Methodology" },
        { href: routes.money(), label: "How we make money" },
        { href: routes.editorial(), label: "Editorial policy" },
        { href: routes.team(), label: "Team" },
        { href: routes.about(), label: "About" },
        { href: routes.contact(), label: "Contact" },
      ],
    },
  ];
  const legal = [
    { href: routes.privacy(), label: "Privacy" },
    { href: routes.terms(), label: "Terms" },
    { href: routes.cookies(), label: "Cookie settings" },
    { href: routes.accessibility(), label: "Accessibility" },
  ];

  return (
    <footer className="mx-3 mb-3 mt-16 overflow-hidden rounded-panel-sm bg-ink text-white md:mx-4 md:mb-4 md:mt-24 md:rounded-panel">
      <div className="container-site relative pb-8 pt-16 md:pt-24">
        <div className="relative z-10 grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <p className="flex items-center gap-2 font-display text-[1.375rem] font-medium">
              <LogoMark className="text-white" />
              {siteConfig.brandName}
            </p>
            <p className="mt-4 max-w-sm text-on-ink-muted">
              Independent, sourced research that helps you choose an AI website or app builder you can afford to
              keep.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:col-span-8 md:grid-cols-4">
            {columns.map((col) => (
              <div key={col.title} className="min-w-0">
                <h2 className="text-small font-medium text-on-ink-muted">{col.title}</h2>
                <ul className="mt-4 space-y-2">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="inline-block py-1 hover:underline">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 mt-16 flex flex-col gap-4 border-t border-white/20 pt-6 text-small text-on-ink-muted md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-block py-1 hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <p>Product names and logos belong to their owners and are used for identification only.</p>
        </div>
        <AffiliateNote className="relative z-10 mt-4 text-on-ink-muted" />
        <p
          aria-hidden="true"
          className="pointer-events-none mt-10 select-none font-display text-[clamp(4rem,18vw,17rem)] font-medium leading-[0.8] tracking-[-0.05em] text-white/10"
        >
          {siteConfig.brandName}
        </p>
      </div>
    </footer>
  );
}
