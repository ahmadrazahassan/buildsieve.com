"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/routes";
import { Logo } from "./logo";
import { SearchTrigger } from "./search-palette";

type NavCategory = { slug: string; name: string; intro: string };

const navItem =
  "inline-flex min-h-11 items-center px-3 text-[0.9375rem] font-medium hover:text-primary aria-[current=page]:text-primary";

export function SiteHeader({ categories }: { categories: NavCategory[] }) {
  const pathname = usePathname();
  // Menus remember the path they were opened on, so they close on navigation without an effect.
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const [catsPath, setCatsPath] = useState<string | null>(null);
  const menu = menuPath === pathname;
  const cats = catsPath === pathname;
  const setMenu = (fn: (v: boolean) => boolean) => setMenuPath(fn(menu) ? pathname : null);
  const setCats = (v: boolean | ((v: boolean) => boolean)) =>
    setCatsPath((typeof v === "function" ? v(cats) : v) ? pathname : null);

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
  }, [menu]);

  const links = [
    { href: routes.compareTool(), label: "Compare" },
    { href: routes.finder(), label: "Builder Finder" },
    { href: routes.guides(), label: "Guides" },
  ];
  const current = (href: string) => (pathname === href || pathname.startsWith(`${href}/`) ? "page" : undefined);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg">
      <div className="container-site flex h-16 items-center justify-between gap-4 md:h-[72px]">
        <Link href="/" aria-label="Buildsieve home" className="shrink-0">
          <Logo />
        </Link>

        <nav aria-label="Main" className="hidden items-center lg:flex">
          <div className="relative" onMouseLeave={() => setCats(false)}>
            <button
              type="button"
              className={navItem}
              aria-expanded={cats}
              aria-controls="nav-categories"
              onClick={() => setCats((v) => !v)}
              onMouseEnter={() => setCats(true)}
            >
              Categories
              <ChevronDown
                className={cn("ml-1 size-4 transition-transform", cats && "rotate-180")}
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </button>
            {cats && (
              <div id="nav-categories" className="absolute left-0 top-full w-[420px] border border-line bg-surface p-2 shadow-float">
                {categories.map((c) => (
                  <Link key={c.slug} href={routes.category(c.slug)} className="block p-4 hover:bg-primary-tint">
                    <span className="font-medium">{c.name}</span>
                    <span className="mt-1 block text-small text-muted">{c.intro}</span>
                  </Link>
                ))}
                <Link href={routes.categories()} className="block p-4 text-small underline underline-offset-2">
                  All categories
                </Link>
              </div>
            )}
          </div>
          {links.map((l) => (
            <Link key={l.href} href={l.href} className={navItem} aria-current={current(l.href)}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <SearchTrigger className="inline-flex min-h-11 items-center gap-2 px-3 hover:text-primary" />
          <Link
            href={routes.finder()}
            className="hidden min-h-11 items-center bg-primary px-5 text-[0.9375rem] font-medium text-white hover:bg-primary-hover md:inline-flex"
          >
            Find your builder
          </Link>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center lg:hidden"
            aria-expanded={menu}
            aria-controls="mobile-menu"
            aria-label={menu ? "Close menu" : "Open menu"}
            onClick={() => setMenu((v) => !v)}
          >
            {menu ? <X className="size-6" strokeWidth={1.5} /> : <Menu className="size-6" strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {menu && (
        <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-bg lg:hidden">
          <nav aria-label="Mobile" className="container-site py-6">
            <SearchTrigger className="flex min-h-14 w-full items-center gap-3 border border-ink bg-surface px-4 text-left" />
            <p className="eyebrow mt-8 text-muted">Categories</p>
            <ul className="mt-2 divide-y divide-line border-y border-line">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={routes.category(c.slug)} className="block py-4 font-display text-h3 font-medium">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="mt-6 space-y-1">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="block py-3 text-[1.125rem]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={routes.finder()}
              className="mt-6 flex min-h-12 items-center justify-center bg-primary font-medium text-white"
            >
              Find your builder
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
