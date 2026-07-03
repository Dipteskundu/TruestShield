"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { ConfidenceGauge } from "@/components/scan/confidence-gauge";
import { ReasonList } from "@/components/scan/reason-list";
import { UrlMetadata } from "@/components/scan/url-metadata";
import { RiskBadge } from "@/components/document/risk-badge";
import { VERDICT_COLORS } from "@/lib/constants";
import { Shield, Loader2, FileText, AlertTriangle } from "lucide-react";
import type { ScanResult } from "@/types/scan";

interface PublicDocData {
  document: {
    fileName: string;
    documentType: string;
    overallRiskScore: number;
    executiveSummary: string;
    glossary?: { term: string; definition: string }[];
  };
  clauses: {
    clauseIndex: number;
    originalText: string;
    plainExplanation: string;
    riskLevel: "low" | "medium" | "high";
    riskReason: string;
  }[];
}

export default function PublicResultPage({ params }: { params: { id: string } }) {
  const [type, setType] = useState<"scan" | "document" | null>(null);

  const scanQuery = useQuery({
    queryKey: ["scan-result", params.id],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: ScanResult }>(
        `/api/scan/result/${params.id}`
      );
      return data.data;
    },
    enabled: Boolean(params.id) && type !== "document",
    retry: false,
  });

  const docQuery = useQuery({
    queryKey: ["public-doc", params.id],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: PublicDocData }>(
        `/api/documents/public/${params.id}`
      );
      return data.data;
    },
    enabled: Boolean(params.id) && type !== "scan",
    retry: false,
  });

  useEffect(() => {
    if (scanQuery.data) {
      setType("scan");
    } else if (scanQuery.error && !scanQuery.isLoading) {
      setType("document");
    }
  }, [scanQuery.data, scanQuery.error, scanQuery.isLoading]);

  useEffect(() => {
    if (docQuery.data) {
      setType("document");
    }
  }, [docQuery.data]);

  const isLoading = !type && (scanQuery.isLoading || docQuery.isLoading);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (type === "scan" && scanQuery.data) {
    const data = scanQuery.data;
    return (
      <div className="container mx-auto max-w-2xl px-4 py-16">
        <div className="mb-8 text-center">
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${VERDICT_COLORS[data.verdict]}`}>
            {data.verdict}
          </span>
          <h1 className="mt-4 text-2xl font-bold tracking-tight capitalize">{data.type} Scan Result</h1>
        </div>
        <div className="mb-8 flex justify-center">
          <ConfidenceGauge score={data.confidence} verdict={data.verdict} />
        </div>
        <h2 className="mb-4 font-semibold">Why we flagged this</h2>
        <ReasonList reasons={data.reasons} />
        {data.type === "url" && data.metadata && Object.keys(data.metadata).length > 0 && (
          <div className="mt-8">
            <UrlMetadata metadata={data.metadata} verdict={data.verdict} />
          </div>
        )}
      </div>
    );
  }

  if (type === "document" && docQuery.data) {
    const { document: doc, clauses } = docQuery.data;
    const riskColor =
      doc.overallRiskScore > 60
        ? "text-red-500"
        : doc.overallRiskScore > 30
        ? "text-amber-500"
        : "text-emerald-500";

    return (
      <div className="container mx-auto max-w-3xl px-4 py-16">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2">
            <FileText className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Document Analysis</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold tracking-tight">{doc.fileName}</h1>
          <p className="mt-1 text-sm text-muted-foreground capitalize">{doc.documentType}</p>
        </div>

        <div className="mb-8 glass rounded-2xl p-6 text-center">
          <p className="text-sm text-muted-foreground mb-1">Overall Risk Score</p>
          <p className={`text-4xl font-bold ${riskColor}`}>{doc.overallRiskScore}%</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Based on {clauses.length} analyzed clause{clauses.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="glass flex items-center gap-3 rounded-xl border border-amber-500/20 p-4 mb-8">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />
          <p className="text-sm text-muted-foreground">
            TrustShield is not legal advice. Consult a qualified lawyer for binding decisions.
          </p>
        </div>

        {doc.executiveSummary && (
          <div className="glass rounded-2xl p-6 mb-8">
            <h2 className="font-semibold mb-2">Executive Summary</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{doc.executiveSummary}</p>
          </div>
        )}

        <h2 className="mb-4 font-semibold">Clause Breakdown</h2>
        <div className="space-y-4 mb-8">
          {clauses.map((clause) => {
            const borderColor = {
              low: "border-l-emerald-500",
              medium: "border-l-amber-500",
              high: "border-l-red-500",
            }[clause.riskLevel];

            return (
              <div key={clause.clauseIndex} className={`glass rounded-2xl p-5 border-l-4 ${borderColor}`}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm">Clause {clause.clauseIndex + 1}</h3>
                  <RiskBadge level={clause.riskLevel} />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Original</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{clause.originalText.slice(0, 300)}{clause.originalText.length > 300 ? "..." : ""}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-primary/70">Plain English</p>
                    <p className="text-sm leading-relaxed">{clause.plainExplanation}</p>
                  </div>
                </div>
                {clause.riskReason && (
                  <p className="mt-3 text-sm text-muted-foreground border-t border-border/50 pt-3">{clause.riskReason}</p>
                )}
              </div>
            );
          })}
        </div>

        {doc.glossary && doc.glossary.length > 0 && (
          <div className="glass rounded-2xl p-6 mb-8">
            <h2 className="font-semibold mb-3">Glossary</h2>
            <dl className="space-y-2">
              {doc.glossary.map((entry, i) => (
                <div key={i}>
                  <dt className="text-sm font-semibold">{entry.term}</dt>
                  <dd className="text-sm text-muted-foreground">{entry.definition}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50">
        <Shield className="h-8 w-8 text-muted-foreground/50" />
      </div>
      <p className="text-muted-foreground">Result not found or expired.</p>
    </div>
  );
}
