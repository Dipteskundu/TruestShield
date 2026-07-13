"use client";

import { useThemeTransition } from "@/hooks/useThemeTransition";

export { useThemeTransition };

export function ThemeTransitionProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
