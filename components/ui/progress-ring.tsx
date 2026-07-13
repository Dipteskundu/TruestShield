"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { cn } from "@/lib/utils";

interface ProgressRingProps {
  used: number;
  limit: number | null;
  size?: number;
  strokeWidth?: number;
  className?: string;
  gradientFrom?: string;
  gradientTo?: string;
  label?: string;
  sublabel?: string;
}

function AnimatedCounter({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const startTime = performance.now();

    function easeOutExpo(t: number): number {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function update(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);
      setCount(Math.floor(easedProgress * value));
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setCount(value);
      }
    }

    requestAnimationFrame(update);
  }, [value, duration]);

  return <span ref={ref} className="font-mono tabular-nums">{count.toLocaleString()}</span>;
}

export function ProgressRing({
  used,
  limit,
  size = 120,
  strokeWidth = 8,
  className,
  gradientFrom = "#059669",
  gradientTo = "#14b8a6",
  label,
  sublabel,
}: ProgressRingProps) {
  const gradientId = useMemo(() => `ring-gradient-${Math.random().toString(36).slice(2, 9)}`, []);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = limit === null || limit === 0 ? 100 : Math.min(100, Math.round((used / limit) * 100));
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  const isUnlimited = limit === null || limit === 0;
  const isWarning = !isUnlimited && pct >= 70;
  const isDanger = !isUnlimited && pct >= 90;

  return (
    <div className={cn("relative inline-flex flex-col items-center gap-2", className)}>
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="-rotate-90">
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isDanger ? "#ef4444" : isWarning ? "#f59e0b" : gradientFrom} />
              <stop offset="100%" stopColor={isDanger ? "#f87171" : isWarning ? "#fbbf24" : gradientTo} />
            </linearGradient>
          </defs>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted/30"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute text-center">
          <span className="text-2xl font-bold">
            <AnimatedCounter value={pct} />
          </span>
          <span className="text-xs text-muted-foreground block">%</span>
        </div>
      </div>
      {(label || sublabel) && (
        <div className="text-center">
          {label && <p className="text-sm font-medium">{label}</p>}
          {sublabel && <p className="text-xs text-muted-foreground">{sublabel}</p>}
        </div>
      )}
    </div>
  );
}
