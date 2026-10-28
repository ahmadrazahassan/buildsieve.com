"use client";

import Link from "next/link";
import { parseAsString, useQueryState } from "nuqs";
import { useSearch } from "./search-palette";

export function SearchResults() {
  const [q, setQ] = useQueryState("q", parseAsString.withDefault("").withOptions({ history: "replace", throttleMs: 200 }));
  const results = useSearch(q, 30);
  return (
    <div>
      <form action="/search" method="get" role="search" className="flex max-w-2xl" onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="search-q" className="sr-only">
          Search
        </label>
        <input
          id="search-q"
          name="q"
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value || null)}
          placeholder="Search tools, comparisons, guides"
          className="h-14 min-w-0 flex-1 border border-ink bg-surface px-4 text-body"
        />
      </form>
      <p className="mt-6 text-small text-muted" aria-live="polite">
        {q ? `${results.length} result${results.length === 1 ? "" : "s"} for "${q}"` : "Type to search all pages."}
      </p>
      <ul className="mt-4 max-w-3xl divide-y divide-line border-y border-line">
        {results.map((r) => (
          <li key={r.href}>
            <Link href={r.href} className="block py-4 hover:text-primary">
              <span className="text-[0.75rem] text-muted">{r.type}</span>
              <span className="block font-medium">{r.title}</span>
              <span className="block text-small text-muted">{r.text}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
