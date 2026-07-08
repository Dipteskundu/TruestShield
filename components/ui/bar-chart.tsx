"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface BarData {
  label: string;
  value: number;
  color?: string;
}

interface BarChartProps {
  data: BarData[];
  maxValue?: number;
  className?: string;
  showValues?: boolean;
  animated?: boolean;
}

function AnimatedBar({
  value,
  maxValue,
  color,
  label,
  showValues,
  delay,
}: {
  value: number;
  maxValue: number;
  color: string;
  label: string;
  showValues: boolean;
  delay: number;
}) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWidth(Math.max(4, (value / maxValue) * 100));
    }, delay);
    return () => clearTimeout(timer);
  }, [value, maxValue, delay]);

  const bgGradient =
    color === "emerald"
      ? "from-emerald-500 to-teal-400"
      : color === "violet"
      ? "from-violet-500 to-purple-400"
      : color === "amber"
      ? "from-amber-500 to-orange-400"
      : color === "rose"
      ? "from-rose-500 to-pink-400"
      : color === "blue"
      ? "from-blue-500 to-cyan-400"
      : "from-emerald-500 to-teal-400";

  return (
    <div className="group flex items-center gap-3" ref={ref}>
      <span className="w-16 text-xs text-muted-foreground text-right shrink-0 truncate">
        {label}
      </span>
      <div className="flex-1 h-8 rounded-lg bg-muted/30 overflow-hidden relative">
        <div
          className={cn(
            "h-full rounded-lg bg-gradient-to-r transition-all duration-1000 ease-out",
            bgGradient
          )}
          style={{ width: `${width}%` }}
        />
        {showValues && value > 0 && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-mono tabular-nums font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            {value}
          </span>
        )}
      </div>
    </div>
  );
}

export function BarChart({
  data,
  maxValue: providedMax,
  className,
  showValues = true,
  animated = true,
}: BarChartProps) {
  const maxValue = providedMax || Math.max(...data.map((d) => d.value), 1);
  const colors = ["emerald", "violet", "amber", "rose", "blue"];

  return (
    <div className={cn("space-y-3", className)}>
      {data.map((item, index) => (
        <AnimatedBar
          key={item.label}
          value={item.value}
          maxValue={maxValue}
          color={item.color || colors[index % colors.length]}
          label={item.label}
          showValues={showValues}
          delay={animated ? index * 100 : 0}
        />
      ))}
    </div>
  );
}

interface GroupedBarChartProps {
  groups: { label: string; data: BarData[] }[];
  className?: string;
}

export function GroupedBarChart({ groups, className }: GroupedBarChartProps) {
  const allValues = groups.flatMap((g) => g.data.map((d) => d.value));
  const maxValue = Math.max(...allValues, 1);
  const colors = ["emerald", "violet", "amber", "rose", "blue"];

  return (
    <div className={cn("space-y-6", className)}>
      {groups.map((group) => (
        <div key={group.label}>
          <p className="text-sm font-medium mb-3 text-muted-foreground">{group.label}</p>
          <div className="space-y-2">
            {group.data.map((item, index) => (
              <AnimatedBar
                key={item.label}
                value={item.value}
                maxValue={maxValue}
                color={item.color || colors[index % colors.length]}
                label={item.label}
                showValues
                delay={index * 80}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
