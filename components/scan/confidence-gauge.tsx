import { cn } from "@/lib/utils";

interface ConfidenceGaugeProps {
  score: number;
  verdict: "safe" | "suspicious" | "dangerous";
}

export function ConfidenceGauge({ score, verdict }: ConfidenceGaugeProps) {
  const isDangerous = verdict === "dangerous";
  const isSuspicious = verdict === "suspicious";

  const barGradient = isDangerous
    ? "bg-gradient-to-r from-red-500 to-rose-400"
    : isSuspicious
      ? "bg-gradient-to-r from-amber-500 to-yellow-400"
      : "bg-gradient-to-r from-emerald-500 to-teal-400";

  const bgColor = isDangerous
    ? "bg-red-100 dark:bg-red-950/50"
    : isSuspicious
      ? "bg-amber-100 dark:bg-amber-950/50"
      : "bg-emerald-100 dark:bg-emerald-950/50";

  const labelColor = isDangerous
    ? "text-red-600 dark:text-red-400"
    : isSuspicious
      ? "text-amber-600 dark:text-amber-400"
      : "text-emerald-600 dark:text-emerald-400";

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className={cn("text-sm font-semibold capitalize", labelColor)}>
          {verdict}
        </span>
        <span className={cn("text-sm font-bold", labelColor)}>
          {score}%
        </span>
      </div>
      <div className={cn("h-3 w-full overflow-hidden rounded-full", bgColor)}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            barGradient
          )}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
