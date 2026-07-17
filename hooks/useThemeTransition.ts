"use client";

import { useTheme } from "next-themes";
import { THEME_EFFECTS, type EffectName } from "@/lib/theme-effects";

const DEFAULT_EFFECT: EffectName = "circular";

interface UseThemeTransitionOptions {
  effect?: EffectName;
  duration?: number;
}

export function useThemeTransition(options: UseThemeTransitionOptions = {}) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const effect = options.effect ?? DEFAULT_EFFECT;
  const duration = options.duration ?? 500;

  async function toggleTheme(targetTheme?: string) {
    const nextTheme = targetTheme ?? (resolvedTheme === "dark" ? "light" : "dark");

    if (!document.startViewTransition) {
      setTheme(nextTheme);
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTheme(nextTheme);
      return;
    }

    const root = document.documentElement;

    // Set animation speed from JS
    root.style.setProperty("--vt-duration", `${duration}ms`);

    // Defensively remove any orphaned [data-vt] style tags left behind
    // by a previous interrupted transition (e.g. rapid theme toggle clicks).
    document.querySelectorAll("style[data-vt]").forEach((el) => el.remove());

    // Inject a temporary style to suppress CSS transitions on regular DOM
    // elements during the view transition. Without this, hundreds of
    // background/color transitions fire simultaneously with the clip-path
    // animation, fighting the GPU and causing visible jank.
    const blockerGlobal = document.createElement("style");
    blockerGlobal.setAttribute("data-vt", "");
    blockerGlobal.textContent =
      "*, *::before, *::after { transition-duration: 0ms !important; }";
    document.head.appendChild(blockerGlobal);

    const transition = document.startViewTransition(() => {
      // Apply the class directly so the browser captures the correct snapshot.
      if (nextTheme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
      // Also call setTheme for state persistence (localStorage, system sync)
      setTheme(nextTheme);
    });

    try {
      await transition.ready;

      // CRITICAL: Always run the JS Web Animations API animation for ALL effects
      // including "circular". Relying solely on the CSS vt-clip-reveal keyframe
      // means if the browser skips or interrupts the view transition,
      // ::view-transition-new(root) is left at clip-path:circle(0px...) and
      // never expands — making the entire page appear invisible (no CSS rendering).
      // The JS animation overrides the CSS one and handles this safely.
      const x = window.innerWidth;
      const y = 0;
      const endRadius = Math.hypot(window.innerWidth, window.innerHeight);
      THEME_EFFECTS[effect]({
        x,
        y,
        endRadius,
        duration,
        direction: nextTheme === "dark" ? "to-dark" : "to-light",
      });
    } catch {
      // View transition was cancelled or failed — cleanup handled in finally
    }

    try {
      await transition.finished;
    } catch {
      // View transition was interrupted — cleanup handled in finally
    } finally {
      // ALWAYS clean up the transition-blocking style, even if transition
      // failed, was interrupted, or the browser skipped it entirely.
      // Leaving this style in the DOM would permanently suppress all CSS
      // transitions, making the page appear broken.
      blockerGlobal.remove();
    }
  }

  return {
    theme,
    resolvedTheme,
    toggleTheme,
    isDark: resolvedTheme === "dark",
  };
}
