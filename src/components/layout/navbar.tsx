"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { BlogCommandSearch } from "@/components/layout/blog-command-search";
import { cn } from "@/lib/utils";
import { ALL_POSTS, BLOG_CATEGORIES } from "@/lib/blogs";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  const activeSlug = useMemo(() => {
    const match = ALL_POSTS.find((post) => pathname === `/${post.slug}`);
    return match?.slug;
  }, [pathname]);

  return (
    <header className="sticky top-0 isolate z-[200] border-b border-neutral-200 bg-background/95 dark:border-[#222] dark:bg-[#050608]/95">
      <div className="w-full px-4 md:px-8">
        <div className="flex items-center justify-between py-3 lg:py-4">
          <Link href="/about" className="flex w-fit items-center gap-2" prefetch>
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-xs font-bold text-background">
              V
            </span>
            <span className="font-[family-name:var(--font-orbitron)] text-xl font-bold tracking-tight">
              Vengeance Blog
            </span>
          </Link>

          <div className="hidden items-center gap-3 sm:flex">
            <BlogCommandSearch />
            <nav className="flex items-center gap-1">
              {BLOG_CATEGORIES.slice(0, 3).map((category) => {
                const first = category.items[0];
                const active = category.items.some(
                  (post) => post.slug === activeSlug
                );
                return (
                  <Link
                    key={category.name}
                    href={`/${first.slug}`}
                    className={cn(
                      "rounded-full px-3 py-1.5 text-sm text-foreground/75 transition-colors hover:text-foreground",
                      active && "text-foreground"
                    )}
                  >
                    {category.name}
                  </Link>
                );
              })}
            </nav>
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-2 sm:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <Menu className="size-5" />
            </Button>
          </div>
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-[210] bg-background sm:hidden">
          <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-[#222]">
            <span className="font-[family-name:var(--font-orbitron)] text-lg font-bold">
              Index
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label="Close menu"
              onClick={close}
            >
              <X className="size-5" />
            </Button>
          </div>
          <div className="max-h-[calc(100vh-3.5rem)] space-y-6 overflow-y-auto px-4 py-6">
            {BLOG_CATEGORIES.map((category) => (
              <div key={category.name} className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {category.name}
                </p>
                <div className="flex flex-col gap-1">
                  {category.items.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/${post.slug}`}
                      onClick={close}
                      className={cn(
                        "rounded-md px-3 py-2 text-sm",
                        pathname === `/${post.slug}`
                          ? "bg-neutral-100 font-medium dark:bg-zinc-800/80"
                          : "text-neutral-600 dark:text-zinc-400"
                      )}
                    >
                      {post.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}
