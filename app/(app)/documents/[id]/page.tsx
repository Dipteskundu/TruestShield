"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useDocumentStatus } from "@/hooks/use-document-status";
import { ClauseCard } from "@/components/document/clause-card";
import { ChatPanel } from "@/components/document/chat-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/toaster";
import api from "@/lib/api";
import type { DocumentDetail, GlossaryEntry } from "@/types/document";
import {
  FileText, Download, AlertTriangle, Loader2, Shield, FileWarning,
  BookOpen, ShieldAlert, ChevronDown, ChevronUp, Copy, Check, Clock,
} from "lucide-react";

const AUTO_DELETE_OPTIONS = [
  { value: "", label: "Never" },
  { value: "1", label: "1 day" },
  { value: "7", label: "7 days" },
  { value: "30", label: "30 days" },
  { value: "90", label: "90 days" },
  { value: "365", label: "1 year" },
];

export default function DocumentDetailPage({ params }: { params: { id: string } }) {
  const { data: status } = useDocumentStatus(params.id);
  const [detail, setDetail] = useState<DocumentDetail | null>(null);
  const [showGlossary, setShowGlossary] = useState(false);
  const [copied, setCopied] = useState(false);
  const [autoDeleteDays, setAutoDeleteDays] = useState<string>("");
  const [autoDeleteLoading, setAutoDeleteLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (status?.status === "ready") {
      api
        .get(`/api/documents/${params.id}`)
        .then(({ data }) => {
          setDetail(data.data);
          const doc = data.data.document;
          if (doc.expiresAt) {
            const expDate = new Date(doc.expiresAt);
            const now = new Date();
            const diffDays = Math.ceil((expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays <= 1) setAutoDeleteDays("1");
            else if (diffDays <= 7) setAutoDeleteDays("7");
            else if (diffDays <= 30) setAutoDeleteDays("30");
            else if (diffDays <= 90) setAutoDeleteDays("90");
            else if (diffDays <= 365) setAutoDeleteDays("365");
          }
        })
        .catch(() => {});
    }
  }, [status?.status, params.id]);

  async function handleAutoDeleteChange(value: string) {
    setAutoDeleteLoading(true);
    try {
      const days = value === "" ? null : parseInt(value, 10);
      const { data } = await api.patch(`/api/documents/${params.id}/auto-delete`, { days });
      if (data.success) {
        setAutoDeleteDays(value);
        toast(value ? `Auto-delete set to ${AUTO_DELETE_OPTIONS.find(o => o.value === value)?.label}` : "Auto-delete disabled", "success");
      }
    } catch {
      toast("Failed to update auto-delete setting", "error");
    } finally {
      setAutoDeleteLoading(false);
    }
  }

  async function handleShare() {
    try {
      const { data } = await api.post(`/api/documents/${params.id}/share`);
      await navigator.clipboard.writeText(data.data.shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Share failed
    }
  }

  if (status?.status === "processing") {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="relative">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl gradient-primary">
            <Loader2 className="h-10 w-10 text-white animate-spin" />
          </div>
          <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-background border-2 border-primary">
            <FileText className="h-4 w-4 text-primary" />
          </div>
        </div>
        <h1 className="mt-6 text-2xl font-bold">Analyzing your document...</h1>
        <p className="mt-2 text-muted-foreground">
          AI is analyzing each clause for risks, plain explanations, and missing protections.
          This may take a minute.
        </p>
      </div>
    );
  }

  if (status?.status === "failed") {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-destructive/10">
          <FileWarning className="h-10 w-10 text-destructive" />
        </div>
        <h1 className="mt-6 text-2xl font-bold">Analysis failed</h1>
        <p className="mt-2 text-muted-foreground">
          Document analysis failed. The document may be too short or the AI service may be temporarily unavailable.
          Please try uploading again.
        </p>
        <Link href="/documents/upload" className="mt-4">
          <Button>Try again</Button>
        </Link>
      </div>
    );
  }

  if (!detail) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const { document, clauses } = detail;

  const riskColor =
    document.overallRiskScore > 60
      ? "text-red-500"
      : document.overallRiskScore > 30
      ? "text-amber-500"
      : "text-emerald-500";

  const riskBgColor =
    document.overallRiskScore > 60
      ? "from-red-500/20 to-red-600/5"
      : document.overallRiskScore > 30
      ? "from-amber-500/20 to-amber-600/5"
      : "from-emerald-500/20 to-emerald-600/5";

  const riskLabel =
    document.overallRiskScore > 60
      ? "High Risk"
      : document.overallRiskScore > 30
      ? "Moderate Risk"
      : "Low Risk";

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">{document.fileName}</h1>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="capitalize">{document.documentType}</span>
            <span>·</span>
            <span className={`font-semibold ${riskColor}`}>{riskLabel} — {document.overallRiskScore}%</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={autoDeleteDays}
              onChange={(e) => handleAutoDeleteChange(e.target.value)}
              disabled={autoDeleteLoading}
              className="h-8 rounded-lg border border-border/50 bg-transparent px-2 text-xs focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {AUTO_DELETE_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <Button variant="outline" size="sm" onClick={handleShare}>
            {copied ? <Check className="mr-1.5 h-3.5 w-3.5" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />}
            {copied ? "Copied!" : "Share"}
          </Button>
          <Link href={`/documents/${params.id}/export`}>
            <Button variant="outline" size="sm">
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Export
            </Button>
          </Link>
        </div>
      </div>

      <div className={`glass rounded-2xl bg-gradient-to-br ${riskBgColor} p-6 flex items-center gap-5`}>
        <div className="relative">
          <svg className="h-20 w-20 -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-border/50" />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(document.overallRiskScore / 100) * 251.3} 251.3`}
              className={riskColor.replace("text-", "stroke-")}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-lg font-bold ${riskColor}`}>{document.overallRiskScore}%</span>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold">Overall Risk Score</p>
          <p className="text-sm text-muted-foreground">
            Based on {clauses.length} analyzed clause{clauses.length !== 1 ? "s" : ""}
          </p>
          <div className="mt-2 flex gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              {clauses.filter((c) => c.riskLevel === "high").length} high
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              {clauses.filter((c) => c.riskLevel === "medium").length} medium
            </span>
            <span className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {clauses.filter((c) => c.riskLevel === "low").length} low
            </span>
          </div>
        </div>
      </div>

      <div className="glass flex items-center gap-3 rounded-xl border border-amber-500/20 p-4">
        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-500" />
        <p className="text-sm text-muted-foreground">
          TrustShield is not legal advice. It is a legal literacy tool. For decisions with
          significant financial or legal consequences, consult a qualified lawyer.
        </p>
      </div>

      {document.executiveSummary && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle>Executive summary</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{document.executiveSummary}</p>
          </CardContent>
        </Card>
      )}

      {detail.document.missingProtections && detail.document.missingProtections.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-amber-500" />
              <CardTitle className="text-amber-600 dark:text-amber-400">Missing protections</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {detail.document.missingProtections.map((protection, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  {protection}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {detail.document.glossary && detail.document.glossary.length > 0 && (
        <Card>
          <button
            onClick={() => setShowGlossary(!showGlossary)}
            className="w-full"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <CardTitle>Glossary ({detail.document.glossary.length} terms)</CardTitle>
                </div>
                {showGlossary ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </div>
            </CardHeader>
          </button>
          {showGlossary && (
            <CardContent>
              <dl className="space-y-3">
                {detail.document.glossary.map((entry: GlossaryEntry, i: number) => (
                  <div key={i}>
                    <dt className="text-sm font-semibold">{entry.term}</dt>
                    <dd className="text-sm text-muted-foreground">{entry.definition}</dd>
                  </div>
                ))}
              </dl>
            </CardContent>
          )}
        </Card>
      )}

      <section>
        <h2 className="mb-4 text-lg font-semibold">Clause breakdown</h2>
        <div className="space-y-4">
          {clauses.map((clause) => (
            <ClauseCard key={clause._id} clause={clause} />
          ))}
        </div>
      </section>

      <ChatPanel documentId={params.id} />
    </div>
  );
}
