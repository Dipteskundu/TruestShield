"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  data: DonutSegment[];
  size?: number;
  strokeWidth?: number;
  className?: string;
  centerLabel?: string;
}

function AnimatedCounter({
  value,
  duration = 1200,
}: {
  value: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);

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

  return <span className="font-mono tabular-nums">{count.toLocaleString()}</span>;
}

const colorMap: Record<string, string> = {
  emerald: "#059669",
  teal: "#14b8a6",
  violet: "#8b5cf6",
  purple: "#a78bfa",
  amber: "#f59e0b",
  orange: "#f97316",
  rose: "#f43f5e",
  pink: "#ec4899",
  blue: "#3b82f6",
  cyan: "#06b6d4",
};

function getGradientStops(color: string) {
  if (colorMap[color]) return colorMap[color];
  if (color.startsWith("#")) return color;
  return "#059669";
}

export function DonutChart({
  data,
  size = 160,
  strokeWidth = 24,
  className,
  centerLabel,
}: DonutChartProps) {
  const [animatedSegments, setAnimatedSegments] = useState<
    { offset: number; length: number }[]
  >([]);
  const total = data.reduce((sum, d) => sum + d.value, 0);

  useEffect(() => {
    if (total === 0) return;

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    let accumulatedOffset = 0;
    const segments = data.map((d) => {
      const pct = d.value / total;
      const length = pct * circumference;
      const offset = accumulatedOffset;
      accumulatedOffset += length;
      return { offset, length };
    });

    const timer = setTimeout(() => {
      setAnimatedSegments(segments);
    }, 100);

    return () => clearTimeout(timer);
  }, [data, total, size, strokeWidth]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const centerValue = total;

  const colorClasses: Record<string, string> = {
    emerald: "bg-emerald-500",
    teal: "bg-teal-500",
    violet: "bg-violet-500",
    purple: "bg-purple-500",
    amber: "bg-amber-500",
    orange: "bg-orange-500",
    rose: "bg-rose-500",
    pink: "bg-pink-500",
    blue: "bg-blue-500",
    cyan: "bg-cyan-500",
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className="relative inline-flex items-center justify-center">
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-muted/20"
          />
          {data.map((segment, index) => {
            const animated = animatedSegments[index];
            const offset = animated?.offset ?? 0;
            const length = animated?.length ?? 0;
            const strokeColor = getGradientStops(segment.color);

            return (
              <circle
                key={segment.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={strokeColor}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={circumference - offset - length}
                strokeLinecap="round"
                style={{
                  transition: "all 1s ease-out",
                  opacity: length > 0 ? 1 : 0,
                }}
              />
            );
          })}
        </svg>
        <div className="absolute text-center">
          <span className="text-2xl font-bold">
            <AnimatedCounter value={centerValue} />
          </span>
          {centerLabel && (
            <span className="text-xs text-muted-foreground block">
              {centerLabel}
            </span>
          )}
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        {data.map((segment) => {
          const dotClass = colorClasses[segment.color] || "bg-emerald-500";
          const pct = total > 0 ? Math.round((segment.value / total) * 100) : 0;
          return (
            <div key={segment.label} className="flex items-center gap-1.5">
              <span className={cn("h-2.5 w-2.5 rounded-full", dotClass)} />
              <span className="text-xs text-muted-foreground">
                {segment.label}
              </span>
              <span className="text-xs font-medium tabular-nums">{pct}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
