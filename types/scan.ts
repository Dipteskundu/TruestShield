export type ScanVerdict = "safe" | "suspicious" | "dangerous";

export interface ScanResult {
  id: string;
  type: string;
  verdict: ScanVerdict;
  confidence: number;
  reasons: string[];
  shareToken?: string;
  metadata?: Record<string, unknown>;
  createdAt?: string;
}

export interface ScanHistoryItem {
  id: string;
  module: "scan";
  type: string;
  verdict: ScanVerdict;
  confidence: number;
  createdAt: string;
}
