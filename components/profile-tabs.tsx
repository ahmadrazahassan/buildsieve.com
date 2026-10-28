"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

/** Sticky in-page navigation with scroll spy. */
export function ProfileTabs({ sections }: { sections: { id: string; label: string }[] }) {
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-140px 0px -60% 0px" },
    );
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <nav aria-label="On this page" className="sticky top-16 z-30 border-b border-line bg-bg md:top-[72px]">
      <div className="container-site relative">
        <ul className="relative flex gap-6 overflow-x-auto" role="list">
          {sections.map((s) => (
            <li key={s.id} className="shrink-0">
              <a
                href={`#${s.id}`}
                aria-current={active === s.id ? "location" : undefined}
                className={cn(
                  "relative inline-flex min-h-12 items-center text-small font-medium transition-colors",
                  active === s.id ? "text-ink" : "text-muted hover:text-ink",
                )}
              >
                {s.label}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute inset-x-0 bottom-0 h-0.5 origin-left bg-primary transition-transform duration-300 ease-out",
                    active === s.id ? "scale-x-100" : "scale-x-0",
                  )}
                />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
