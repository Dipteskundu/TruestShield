export type DocumentStatus = "processing" | "ready" | "failed";
export type RiskLevel = "low" | "medium" | "high";

export interface DocumentSummary {
  id: string;
  fileName: string;
  documentType: string;
  status: DocumentStatus;
  overallRiskScore: number;
  executiveSummary?: string;
  createdAt: string;
}

export interface Clause {
  _id: string;
  clauseIndex: number;
  originalText: string;
  plainExplanation: string;
  riskLevel: RiskLevel;
  riskReason: string;
  missingProtections: string[];
  keyTerms: string[];
}

export interface DocumentDetail {
  document: DocumentSummary & { glossary?: { term: string; definition: string }[] };
  clauses: Clause[];
}
