"use client";

import { Command } from "cmdk";
import Fuse from "fuse.js";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import index from "@/.generated/search-index.json";

type Entry = { type: string; title: string; text: string; href: string };
const entries = index as Entry[];

export function useSearch(query: string, limit = 12) {
  const fuse = useMemo(() => new Fuse(entries, { keys: [{ name: "title", weight: 2 }, "text", "type"], threshold: 0.35 }), []);
  return query.trim() ? fuse.search(query).slice(0, limit).map((r) => r.item) : entries.slice(0, limit);
}

export function SearchPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const results = useSearch(query);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("open-search", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-search", onOpen);
    };
  }, []);

  return (
    <Command.Dialog
      open={open}
      onOpenChange={setOpen}
      label="Search the site"
      shouldFilter={false}
      overlayClassName="fixed inset-0 z-50 bg-ink/40"
      contentClassName="fixed inset-x-3 top-[10vh] z-50 mx-auto max-w-2xl border border-line bg-surface shadow-float"
    >
      <div className="flex items-center gap-3 border-b border-line px-4">
        <Search className="size-5 text-muted" strokeWidth={1.5} aria-hidden="true" />
        <Command.Input
          value={query}
          onValueChange={setQuery}
          placeholder="Search tools, comparisons, guides"
          className="h-14 min-w-0 flex-1 bg-transparent text-body outline-none placeholder:text-muted"
          onKeyDown={(e) => {
            if (e.key === "Enter" && results.length === 0 && query.trim()) {
              setOpen(false);
              router.push(`/search?q=${encodeURIComponent(query)}`);
            }
          }}
        />
        <button type="button" onClick={() => setOpen(false)} className="p-2" aria-label="Close search">
          <X className="size-5" strokeWidth={1.5} aria-hidden="true" />
        </button>
      </div>
      <Command.List className="max-h-[60vh] overflow-y-auto p-2">
        <Command.Empty className="p-4 text-small text-muted">No results. Press Enter to search all pages.</Command.Empty>
        {results.map((r) => (
          <Command.Item
            key={r.href}
            value={r.href}
            onSelect={() => {
              setOpen(false);
              router.push(r.href);
            }}
            className="flex cursor-pointer items-baseline justify-between gap-4 px-3 py-3 data-[selected=true]:bg-primary-tint"
          >
            <span className="min-w-0 truncate">{r.title}</span>
            <span className="shrink-0 text-[0.75rem] text-muted">{r.type}</span>
          </Command.Item>
        ))}
      </Command.List>
    </Command.Dialog>
  );
}

export function SearchTrigger({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("open-search"))}
      className={className}
      aria-label="Search (Ctrl K)"
    >
      <Search className="size-5" strokeWidth={1.5} aria-hidden="true" />
      <span className="hidden text-small lg:inline">Search</span>
      <kbd className="hidden border border-line px-1.5 text-[0.6875rem] text-muted lg:inline">Ctrl K</kbd>
    </button>
  );
}
