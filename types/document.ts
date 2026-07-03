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

export interface GlossaryEntry {
  term: string;
  definition: string;
}

export interface DocumentDetail {
  document: DocumentSummary & {
    glossary?: GlossaryEntry[];
    missingProtections?: string[];
  };
  clauses: Clause[];
}

export interface ChatMessage {
  _id: string;
  role: "user" | "assistant";
  content: string;
  citedClauseIds?: string[];
  createdAt: string;
}

export interface PublicDocument {
  document: {
    fileName: string;
    documentType: string;
    overallRiskScore: number;
    executiveSummary: string;
    glossary?: GlossaryEntry[];
    createdAt: string;
  };
  clauses: Clause[];
}
