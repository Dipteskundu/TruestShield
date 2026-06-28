import { RiskBadge } from "./risk-badge";
import type { Clause } from "@/types/document";

interface ClauseCardProps {
  clause: Clause;
}

export function ClauseCard({ clause }: ClauseCardProps) {
  return (
    <article className="rounded-lg border p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="font-medium">Clause {clause.clauseIndex + 1}</h4>
        <RiskBadge level={clause.riskLevel} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">Original</p>
          <p className="text-sm">{clause.originalText}</p>
        </div>
        <div>
          <p className="mb-1 text-xs font-semibold uppercase text-muted-foreground">Plain English</p>
          <p className="text-sm">{clause.plainExplanation}</p>
        </div>
      </div>
      {clause.riskReason && (
        <p className="mt-3 text-sm text-muted-foreground">{clause.riskReason}</p>
      )}
    </article>
  );
}
