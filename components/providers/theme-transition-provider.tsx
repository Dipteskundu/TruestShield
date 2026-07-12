"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { useTheme } from "next-themes";

interface ThemeTransitionContextValue {
  triggerTransition: (buttonElement: HTMLElement, targetTheme: string) => void;
}

const ThemeTransitionContext = createContext<ThemeTransitionContextValue>({
  triggerTransition: () => {},
});

export function useThemeTransition() {
  return useContext(ThemeTransitionContext);
}

export function ThemeTransitionProvider({ children }: { children: React.ReactNode }) {
  const { setTheme } = useTheme();
  const [overlay, setOverlay] = useState<{
    active: boolean;
    x: number;
    y: number;
    scale: number;
  }>({ active: false, x: 0, y: 0, scale: 0 });

  const isAnimatingRef = useRef(false);

  const triggerTransition = useCallback(
    (buttonElement: HTMLElement, targetTheme: string) => {
      // Respect reduced motion
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document.documentElement.classList.remove("dark");
        if (targetTheme === "dark") {
          document.documentElement.classList.add("dark");
        }
        setTheme(targetTheme);
        return;
      }

      // If already animating, ignore
      if (isAnimatingRef.current) return;

      const rect = buttonElement.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const baseSize = Math.max(rect.width, rect.height);

      const maxDist = Math.max(
        centerX,
        window.innerWidth - centerX,
        centerY,
        window.innerHeight - centerY
      );

      const targetScale = (maxDist * 2.5) / baseSize;

      isAnimatingRef.current = true;

      // Determine if current theme is dark
      const isCurrentlyDark =
        document.documentElement.classList.contains("dark");

      const goingDark = targetTheme === "dark";

      if (isCurrentlyDark && !goingDark) {
        // Dark → Light: expand overlay (dark bg), switch theme under it, then contract

        // Phase 1: Start at scale 0
        setOverlay({ active: true, x: centerX, y: centerY, scale: 0 });
        document.documentElement.classList.add("theme-transitioning");

        // Phase 2: Expand to full (next frame)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setOverlay({ active: true, x: centerX, y: centerY, scale: targetScale });
          });
        });

        // Phase 3: Switch theme at midpoint (hidden under overlay)
        setTimeout(() => {
          setTheme("light");
        }, 250);

        // Phase 4: Contract back to button
        setTimeout(() => {
          setOverlay({ active: true, x: centerX, y: centerY, scale: 0 });
        }, 300);

        // Phase 5: Cleanup
        setTimeout(() => {
          setOverlay({ active: false, x: 0, y: 0, scale: 0 });
          document.documentElement.classList.remove("theme-transitioning");
          isAnimatingRef.current = false;
        }, 600);
      } else {
        // Light → Dark: expand overlay from button, apply dark at midpoint

        // Phase 1: Start at scale 0
        setOverlay({ active: true, x: centerX, y: centerY, scale: 0 });
        document.documentElement.classList.add("theme-transitioning");

        // Phase 2: Expand to full (next frame)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            setOverlay({ active: true, x: centerX, y: centerY, scale: targetScale });
          });
        });

        // Phase 3: Apply dark theme at midpoint (hidden under overlay)
        setTimeout(() => {
          setTheme("dark");
        }, 200);

        // Phase 4: Cleanup
        setTimeout(() => {
          setOverlay({ active: false, x: 0, y: 0, scale: 0 });
          document.documentElement.classList.remove("theme-transitioning");
          isAnimatingRef.current = false;
        }, 500);
      }
    },
    [setTheme]
  );

  return (
    <ThemeTransitionContext.Provider value={{ triggerTransition }}>
      {children}

      {/* Transition overlay */}
      {overlay.active && (
        <div
          className="fixed inset-0 z-[9999] pointer-events-none"
          style={{
            background: "var(--background)",
            transform: `translate(-50%, -50%) scale(${overlay.scale})`,
            left: overlay.x,
            top: overlay.y,
            width: "100vmax",
            height: "100vmax",
            marginLeft: "-50vmax",
            marginTop: "-50vmax",
            borderRadius: "50%",
            transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />
      )}
    </ThemeTransitionContext.Provider>
  );
}
