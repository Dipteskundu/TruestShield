import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { RiskLevel } from "@/types/document";

const riskVariant: Record<RiskLevel, string> = {
  low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

export function RiskBadge({ level }: { level: RiskLevel }) {
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize", riskVariant[level])}>
      {level} risk
    </span>
  );
}

export function RiskBadgeInline({ level }: { level: RiskLevel }) {
  return <Badge variant="outline" className={cn("capitalize", riskVariant[level])}>{level}</Badge>;
}
