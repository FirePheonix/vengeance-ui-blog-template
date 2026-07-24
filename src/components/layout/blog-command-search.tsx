"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { BlogLink } from "@/lib/blog-types";
import { cn } from "@/lib/utils";

type SearchItem = {
  href: string;
  category: string;
  description: string;
  title: string;
};

export function BlogCommandSearch({ links }: { links: BlogLink[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const items = useMemo<SearchItem[]>(() => {
    return links.map((post) => ({
      href: post.href,
      category: post.category,
      description: "",
      title: post.title,
    }));
  }, [links]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((item) =>
      `${item.title} ${item.description} ${item.category}`
        .toLowerCase()
        .includes(q)
    );
  }, [items, query]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const openPost = (href: string) => {
    setOpen(false);
    setQuery("");
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "group flex h-9 w-[260px] items-center justify-between rounded-md border border-foreground/10 bg-foreground/[0.035] px-3 text-sm text-muted-foreground shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-colors hover:border-foreground/15 hover:bg-foreground/[0.055] hover:text-foreground",
          "dark:border-white/10 dark:bg-white/[0.035] dark:hover:border-white/15 dark:hover:bg-white/[0.06]"
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          <Search className="size-4 shrink-0 opacity-65 transition-opacity group-hover:opacity-90" />
          <span className="truncate">Search posts...</span>
        </span>
        <kbd className="ml-3 rounded border border-foreground/10 bg-background/80 px-1.5 py-0.5 font-mono text-[11px] leading-none text-muted-foreground shadow-sm dark:border-white/10 dark:bg-white/[0.05]">
          Ctrl K
        </kbd>
      </button>

      <div
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-[260] flex items-start justify-center p-4 pt-[12vh] transition-opacity duration-200",
          open ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={() => setOpen(false)}
      >
        <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" />
        <div
          onClick={(event) => event.stopPropagation()}
          className={cn(
            "relative z-10 w-full max-w-2xl overflow-hidden rounded-xl border border-foreground/10 bg-background/95 shadow-2xl backdrop-blur-xl transition-all duration-200",
            open ? "translate-y-0 scale-100" : "-translate-y-1 scale-[0.985]"
          )}
        >
          <div className="flex items-center gap-2 border-b border-foreground/10 px-3 py-3">
            <Search className="size-4 text-muted-foreground" />
            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search posts, topics, categories..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/80"
            />
          </div>

          <div className="max-h-[min(70vh,520px)] overflow-y-auto p-2">
            {filtered.length === 0 ? (
              <p className="px-2 py-8 text-center text-sm text-muted-foreground">
                No result found.
              </p>
            ) : (
              filtered.map((item) => (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => openPost(item.href)}
                  className="flex w-full items-start gap-3 rounded-md px-3 py-2 text-left transition-colors hover:bg-foreground/[0.04]"
                >
                  <span className="mt-0.5 rounded-md border border-foreground/10 bg-foreground/[0.04] px-2 py-1 text-[11px] font-medium text-muted-foreground">
                    {item.category}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-foreground">
                      {item.title}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {item.description}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
