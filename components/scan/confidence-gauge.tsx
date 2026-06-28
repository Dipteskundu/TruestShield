import { cn } from "@/lib/utils";

interface ConfidenceGaugeProps {
  score: number;
  verdict: "safe" | "suspicious" | "dangerous";
}

export function ConfidenceGauge({ score, verdict }: ConfidenceGaugeProps) {
  const color =
    verdict === "safe"
      ? "text-green-600"
      : verdict === "suspicious"
        ? "text-yellow-600"
        : "text-red-600";

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          "relative flex h-32 w-32 items-center justify-center rounded-full border-8",
          verdict === "safe" && "border-green-200",
          verdict === "suspicious" && "border-yellow-200",
          verdict === "dangerous" && "border-red-200"
        )}
      >
        <span className={cn("text-3xl font-bold", color)}>{score}%</span>
      </div>
      <p className="text-sm capitalize text-muted-foreground">Confidence — {verdict}</p>
    </div>
  );
}
