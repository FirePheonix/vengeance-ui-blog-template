"use client";

import * as React from "react";
import { Check, Laptop, MoonStar, SunDim } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [open, setOpen] = React.useState(false);
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const currentTheme = theme ?? "system";

  React.useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, []);

  const ActiveIcon =
    currentTheme === "system"
      ? Laptop
      : resolvedTheme === "dark"
        ? SunDim
        : MoonStar;

  return (
    <div ref={wrapperRef} className="relative">
      <Button
        onClick={() => setOpen((value) => !value)}
        variant="ghost"
        aria-label="Toggle theme"
        className="size-8 rounded-full"
      >
        <ActiveIcon className="size-[18px]" />
      </Button>

      {open ? (
        <div className="absolute right-0 top-10 z-[260] min-w-36 rounded-md border border-neutral-200 bg-background p-1 shadow-lg dark:border-zinc-800">
          {[
            { value: "light", label: "Light", icon: SunDim },
            { value: "dark", label: "Dark", icon: MoonStar },
            { value: "system", label: "System", icon: Laptop },
          ].map((option) => {
            const Icon = option.icon;
            const active = currentTheme === option.value;

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  setTheme(option.value);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between rounded px-2 py-1.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <span className="flex items-center gap-2">
                  <Icon className="size-4" />
                  {option.label}
                </span>
                {active ? <Check className="size-4" /> : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
