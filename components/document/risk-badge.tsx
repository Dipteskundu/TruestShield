import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types/document";

const riskStyles: Record<RiskLevel, string> = {
  low: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  high: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize", riskStyles[level])}>
      {level} risk
    </span>
  );
}

export function RiskBadgeInline({ level }: { level: RiskLevel }) {
  return <Badge variant="outline" className={cn("capitalize", riskStyles[level])}>{level}</Badge>;
}
