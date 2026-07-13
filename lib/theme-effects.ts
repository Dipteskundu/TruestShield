interface EffectOptions {
  x: number;
  y: number;
  endRadius: number;
  duration: number;
  direction: "to-dark" | "to-light";
}

function circularRipple({ x, y, endRadius, duration }: EffectOptions) {
  document.documentElement.animate(
    {
      clipPath: [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ],
    },
    {
      duration,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      pseudoElement: "::view-transition-new(root)",
    }
  );
}

function diagonalWipe({ duration }: EffectOptions) {
  document.documentElement.animate(
    {
      clipPath: [
        "polygon(0 0, 0 0, 0 0)",
        "polygon(0 0, 200% 0, 0 200%)",
      ],
    },
    {
      duration,
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      pseudoElement: "::view-transition-new(root)",
    }
  );
}

function verticalCurtain({ duration }: EffectOptions) {
  document.documentElement.animate(
    {
      clipPath: [
        "inset(0 0 100% 0)",
        "inset(0 0 0% 0)",
      ],
    },
    {
      duration,
      easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      pseudoElement: "::view-transition-new(root)",
    }
  );
}

function radialBurst({ x, y, endRadius, duration }: EffectOptions) {
  document.documentElement.animate(
    {
      clipPath: [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ],
    },
    {
      duration,
      easing: "ease-out",
      pseudoElement: "::view-transition-new(root)",
    }
  );

  document.documentElement.animate(
    {
      filter: [
        "blur(0px) brightness(1)",
        "blur(8px) brightness(1.3)",
        "blur(0px) brightness(1)",
      ],
      offset: [0, 0.5, 1],
    },
    {
      duration,
      easing: "ease-in-out",
      pseudoElement: "::view-transition-new(root)",
    }
  );
}

function inkBleed({ duration }: EffectOptions) {
  // Originate from top-right corner (same as other effects)
  const cx = window.innerWidth;
  const cy = 0;
  const endRadius = Math.hypot(
    Math.max(cx, window.innerWidth - cx),
    Math.max(cy, window.innerHeight - cy)
  );

  document.documentElement.animate(
    {
      clipPath: [
        `circle(0px at ${cx}px ${cy}px)`,
        `circle(${endRadius}px at ${cx}px ${cy}px)`,
      ],
    },
    {
      duration: duration * 1.4,
      easing: "cubic-bezier(0.0, 0.9, 0.57, 1)",
      pseudoElement: "::view-transition-new(root)",
    }
  );
}

export type EffectName = "circular" | "diagonal" | "curtain" | "radial-burst" | "ink-bleed";

export const THEME_EFFECTS: Record<EffectName, (options: EffectOptions) => void> = {
  circular: circularRipple,
  diagonal: diagonalWipe,
  curtain: verticalCurtain,
  "radial-burst": radialBurst,
  "ink-bleed": inkBleed,
};
