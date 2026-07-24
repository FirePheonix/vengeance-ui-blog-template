"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { BlogCommandSearch } from "@/components/layout/blog-command-search";
import LogoIcon from "@/assets/logo/logo-icon";
import type { BlogLink } from "@/lib/blog-types";
import { cn } from "@/lib/utils";

function GithubMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="size-[18px]"
      fill="currentColor"
    >
      <path d="M12 .5a12 12 0 0 0-3.8 23.4c.6.1.8-.2.8-.6v-2.1c-3.3.7-4-1.4-4-1.4a3.1 3.1 0 0 0-1.3-1.7c-1.1-.8.1-.8.1-.8a2.5 2.5 0 0 1 1.8 1.2 2.6 2.6 0 0 0 3.5 1 2.6 2.6 0 0 1 .8-1.6c-2.7-.3-5.4-1.3-5.4-6a4.7 4.7 0 0 1 1.2-3.2 4.3 4.3 0 0 1 .1-3.2s1-.3 3.3 1.2a11.4 11.4 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2a4.3 4.3 0 0 1 .1 3.2 4.7 4.7 0 0 1 1.2 3.2c0 4.7-2.7 5.6-5.4 6a2.9 2.9 0 0 1 .8 2.2v3.2c0 .4.2.7.8.6A12 12 0 0 0 12 .5Z" />
    </svg>
  );
}

export function Navbar({
  links,
  homeHref,
}: {
  links: BlogLink[];
  homeHref: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  const mobileSections = useMemo(() => {
    const map = new Map<string, BlogLink[]>();
    for (const link of links) {
      if (!map.has(link.category)) {
        map.set(link.category, []);
      }
      map.get(link.category)?.push(link);
    }
    return [...map.entries()].map(([name, items]) => ({ name, items }));
  }, [links]);
  const aboutHref = useMemo(
    () =>
      links.find((post) => post.href.startsWith("/about/"))?.href ?? homeHref,
    [homeHref, links],
  );
  const portfolioHref =
    "https://portfolio-v2-koxw.vercel.app/projects/vengenceui";
  const githubHref =
    "https://github.com/FirePheonix/vengeance-ui-blog-template";

  return (
    <header className="sticky top-0 isolate z-[200] border-b border-neutral-200/80 bg-background/90 backdrop-blur-xl dark:border-[#222]/90 dark:bg-[#050608]/88">
      <div className="w-full px-4 md:px-8">
        <div className="relative flex items-center justify-end py-3 lg:py-4">
          <Link
            href={homeHref}
            className="absolute left-1/2 z-10 flex w-fit -translate-x-1/2 items-center gap-2.5 rounded-full border border-neutral-300/70 bg-background/85 px-4 py-1.5 shadow-[0_8px_24px_rgba(15,23,42,0.08)] backdrop-blur-sm dark:border-zinc-700/80 dark:bg-zinc-950/75 dark:shadow-[0_8px_24px_rgba(0,0,0,0.35)]"
            prefetch
          >
            <LogoIcon className="w-6 rotate-180 text-foreground" />
            <span className="font-[family-name:var(--font-orbitron)] text-xl font-bold tracking-tight">
              Vengeance Blog
            </span>
          </Link>

          <div className="hidden min-w-[260px] sm:block" />

          <div className="hidden items-center gap-3 sm:flex">
            <BlogCommandSearch links={links} />
            <nav className="flex items-center gap-1">
              {[
                { href: portfolioHref, label: "Portfolio", external: true },
                { href: aboutHref, label: "About" },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noreferrer" : undefined}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-sm text-foreground/75 transition-colors hover:text-foreground",
                    pathname === item.href && "text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <Link
              href={githubHref}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub repository"
              className="inline-flex size-8 items-center justify-center rounded-full border border-neutral-300/80 bg-background text-neutral-900 shadow-sm transition-colors hover:text-black dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:text-white"
            >
              <GithubMark />
            </Link>
            <ThemeToggle />
          </div>

          <div className="flex items-center gap-2 sm:hidden">
            <Link
              href={githubHref}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub repository"
              className="inline-flex size-8 items-center justify-center rounded-full border border-neutral-300/80 bg-background text-neutral-900 shadow-sm transition-colors hover:text-black dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:text-white"
            >
              <GithubMark />
            </Link>
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
            {mobileSections.map((category) => (
              <div key={category.name} className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {category.name}
                </p>
                <div className="flex flex-col gap-1">
                  {category.items.map((post) => (
                    <Link
                      key={post.href}
                      href={post.href}
                      onClick={close}
                      className={cn(
                        "rounded-md px-3 py-2 text-sm",
                        pathname === post.href
                          ? "bg-neutral-100 font-medium dark:bg-zinc-800/80"
                          : "text-neutral-600 dark:text-zinc-400",
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
