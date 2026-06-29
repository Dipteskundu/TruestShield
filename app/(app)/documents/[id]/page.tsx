"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useDocumentStatus } from "@/hooks/use-document-status";
import { ClauseCard } from "@/components/document/clause-card";
import { ChatPanel } from "@/components/document/chat-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import type { DocumentDetail } from "@/types/document";
import { FileText, Download, AlertTriangle, Loader2, Shield, FileWarning } from "lucide-react";

export default function DocumentDetailPage({ params }: { params: { id: string } }) {
  const { data: status } = useDocumentStatus(params.id);
  const [detail, setDetail] = useState<DocumentDetail | null>(null);

  useEffect(() => {
    if (status?.status === "ready") {
      api
        .get(`/api/documents/${params.id}`)
        .then(({ data }) => setDetail(data.data))
        .catch(() => {});
    }
  }, [status?.status, params.id]);

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
        <p className="mt-2 text-muted-foreground">This may take a minute. Page will update automatically.</p>
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
        <p className="mt-2 text-muted-foreground">Document analysis failed. Please try uploading again.</p>
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

  const riskColor = document.overallRiskScore > 60
    ? "text-red-500"
    : document.overallRiskScore > 30
    ? "text-amber-500"
    : "text-emerald-500";

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
            <span className={`font-semibold ${riskColor}`}>Overall risk {document.overallRiskScore}%</span>
          </div>
        </div>
        <Link href={`/documents/${params.id}/export`}>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export report
          </Button>
        </Link>
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
