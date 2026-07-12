"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";
import { useThemeTransition } from "@/components/providers/theme-transition-provider";

const themes = ["system", "light", "dark"] as const;
const icons = {
  system: Monitor,
  light: Sun,
  dark: Moon,
} as const;

export function ThemeToggle({ className }: { className?: string }) {
  const { theme } = useTheme();
  const { triggerTransition } = useThemeTransition();
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  const cycleTheme = () => {
    const current = theme || "system";
    const idx = themes.indexOf(current as (typeof themes)[number]);
    const next = themes[(idx + 1) % themes.length];

    // Only trigger animated transition for light ↔ dark switches
    const isAnimatedSwitch =
      (current === "light" && next === "dark") ||
      (current === "dark" && next === "light") ||
      (current === "system" && buttonRef.current);

    if (isAnimatedSwitch && buttonRef.current) {
      // For system theme, resolve actual mode to decide if animated transition applies
      if (current === "system") {
        const isDarkSystem = window.matchMedia("(prefers-color-scheme: dark)").matches;
        // System → Dark (when system is light) or System → Light (when system is dark): use animation
        if ((next === "dark" && !isDarkSystem) || (next === "light" && isDarkSystem)) {
          triggerTransition(buttonRef.current, next);
          return;
        }
      } else {
        // Direct light ↔ dark switch: use animation
        triggerTransition(buttonRef.current, next);
        return;
      }
    }

    // For non-animated switches (e.g. system → light when already light), just set theme directly
    // We need to handle this via the provider too to avoid double-calls
    // Use a minimal inline approach: just set the class and call setTheme
    // But since we can't call setTheme from here (it's in the provider), we trigger transition
    // with a dummy button and let the provider handle it
    if (buttonRef.current) {
      triggerTransition(buttonRef.current, next);
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
      ref={buttonRef}
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
