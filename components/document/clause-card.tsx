import { RiskBadge } from "./risk-badge";
import type { Clause } from "@/types/document";
import { FileText } from "lucide-react";

interface ClauseCardProps {
  clause: Clause;
}

export function ClauseCard({ clause }: ClauseCardProps) {
  const riskBorderColor = {
    low: "border-l-emerald-500",
    medium: "border-l-amber-500",
    high: "border-l-red-500",
  };

  return (
    <article className={`glass rounded-2xl p-5 border-l-4 ${riskBorderColor[clause.riskLevel]} transition-all hover:shadow-glass-sm`}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <h4 className="font-semibold text-sm">Clause {clause.clauseIndex + 1}</h4>
        </div>
        <RiskBadge level={clause.riskLevel} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Original</p>
          <p className="text-sm leading-relaxed text-muted-foreground">{clause.originalText}</p>
        </div>
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Plain English</p>
          <p className="text-sm leading-relaxed">{clause.plainExplanation}</p>
        </div>
      </div>
      {clause.riskReason && (
        <p className="mt-4 text-sm text-muted-foreground border-t border-border/50 pt-3">{clause.riskReason}</p>
      )}
    </article>
  );
}
