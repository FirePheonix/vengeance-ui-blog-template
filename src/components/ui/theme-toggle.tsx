"use client";

import * as React from "react";
import { MoonStar, SunDim } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const [mounted, setMounted] = React.useState(false);
  const { theme, setTheme, systemTheme } = useTheme();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const resolved = theme === "system" ? systemTheme : theme;

  if (!mounted) {
    return (
      <Button variant="ghost" aria-label="Toggle theme" className="size-8 rounded-full">
        <SunDim className="size-5" />
      </Button>
    );
  }

  return (
    <Button
      onClick={() => setTheme(resolved === "dark" ? "light" : "dark")}
      variant="ghost"
      aria-label="Toggle theme"
      className="size-8 rounded-full"
    >
      {resolved === "dark" ? <SunDim className="size-5" /> : <MoonStar className="size-5" />}
    </Button>
  );
}
