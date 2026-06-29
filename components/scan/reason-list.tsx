import { AlertTriangle, ShieldAlert, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReasonListProps {
  reasons: string[];
}

const DANGEROUS_KEYWORDS = [
  "banking", "password", "ssn", "social security", "gift card",
  "wire transfer", "upfront payment", "lottery", "inheritance",
  "legal action", "account suspended", "money", "credit card",
];

const SUSPICIOUS_KEYWORDS = [
  "urgency", "immediate", "limited time", "act now", "suspicious",
  "unknown", "unusual", "generic", "mismatch",
];

function getReasonSeverity(reason: string): "high" | "medium" | "low" {
  const lower = reason.toLowerCase();
  if (DANGEROUS_KEYWORDS.some((k) => lower.includes(k))) return "high";
  if (SUSPICIOUS_KEYWORDS.some((k) => lower.includes(k))) return "medium";
  return "low";
}

export function ReasonList({ reasons }: ReasonListProps) {
  if (!reasons?.length) return null;

  return (
    <ul className="space-y-3">
      {reasons.map((reason, index) => {
        const severity = getReasonSeverity(reason);
        const Icon =
          severity === "high"
            ? ShieldAlert
            : severity === "medium"
              ? AlertTriangle
              : Info;

        return (
          <li
            key={index}
            className={cn(
              "flex gap-3 rounded-xl border p-4 text-sm backdrop-blur-sm transition-all",
              severity === "high" && "border-red-200/50 bg-red-50/80 dark:border-red-900/50 dark:bg-red-950/30",
              severity === "medium" && "border-amber-200/50 bg-amber-50/80 dark:border-amber-900/50 dark:bg-amber-950/30",
              severity === "low" && "border-border/50 bg-muted/30"
            )}
          >
            <Icon
              className={cn(
                "mt-0.5 h-4 w-4 shrink-0",
                severity === "high" && "text-red-500",
                severity === "medium" && "text-amber-500",
                severity === "low" && "text-muted-foreground"
              )}
            />
            <span className="leading-relaxed">{reason}</span>
          </li>
        );
      })}
    </ul>
  );
}
