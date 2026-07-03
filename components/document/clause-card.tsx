import { useState } from "react";
import { RiskBadge } from "./risk-badge";
import type { Clause } from "@/types/document";
import { FileText, ChevronDown, ChevronUp, ShieldAlert } from "lucide-react";

interface ClauseCardProps {
  clause: Clause;
}

export function ClauseCard({ clause }: ClauseCardProps) {
  const [expanded, setExpanded] = useState(false);

  const riskBorderColor = {
    low: "border-l-emerald-500",
    medium: "border-l-amber-500",
    high: "border-l-red-500",
  };

  return (
    <article
      className={`glass rounded-2xl p-5 border-l-4 ${riskBorderColor[clause.riskLevel]} transition-all hover:shadow-glass-sm`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <h4 className="font-semibold text-sm">Clause {clause.clauseIndex + 1}</h4>
        </div>
        <div className="flex items-center gap-2">
          <RiskBadge level={clause.riskLevel} />
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            {expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            Original
          </p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {expanded ? clause.originalText : clause.originalText.slice(0, 200) + (clause.originalText.length > 200 ? "..." : "")}
          </p>
        </div>
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary/70">
            Plain English
          </p>
          <p className="text-sm leading-relaxed">{clause.plainExplanation}</p>
        </div>
      </div>

      {clause.riskReason && (
        <p className="mt-4 text-sm text-muted-foreground border-t border-border/50 pt-3">
          {clause.riskReason}
        </p>
      )}

      {expanded && clause.missingProtections && clause.missingProtections.length > 0 && (
        <div className="mt-3 rounded-xl bg-amber-500/5 border border-amber-500/20 p-3">
          <div className="flex items-center gap-1.5 mb-1.5">
            <ShieldAlert className="h-3.5 w-3.5 text-amber-500" />
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              Missing Protections
            </p>
          </div>
          <ul className="space-y-1">
            {clause.missingProtections.map((protection, i) => (
              <li key={i} className="text-xs text-muted-foreground">
                • {protection}
              </li>
            ))}
          </ul>
        </div>
      )}

      {expanded && clause.keyTerms && clause.keyTerms.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {clause.keyTerms.map((term, i) => (
            <span
              key={i}
              className="inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary"
            >
              {term}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
