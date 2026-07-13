"use client";

import { useEffect, useState } from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { useThemeTransition } from "@/hooks/useThemeTransition";

const themes = ["system", "light", "dark"] as const;
const icons = {
  system: Monitor,
  light: Sun,
  dark: Moon,
} as const;

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, resolvedTheme, toggleTheme } = useThemeTransition();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const cycleTheme = (event: React.MouseEvent) => {
    const current = theme || "system";
    const idx = themes.indexOf(current as (typeof themes)[number]);
    const next = themes[(idx + 1) % themes.length];

    const resolved = resolvedTheme || "light";
    const currentResolved = current === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      : resolved;

    const nextResolved = next === "system"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      : next === "light" ? "light" : "dark";

    if (currentResolved !== nextResolved) {
      toggleTheme(next, event);
    } else {
      toggleTheme(next);
    }
  };

  if (!mounted) {
    return (
      <div
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl",
          className
        )}
      />
    );
  }

  const current = (theme || "system") as keyof typeof icons;
  const Icon = icons[current] || Monitor;

  return (
    <button
      onClick={cycleTheme}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-xl hover:bg-primary/5 transition-all duration-200 group",
        className
      )}
      aria-label={`Theme: ${current}. Click to cycle.`}
      title={`Current: ${current}`}
    >
      <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
    </button>
  );
}
