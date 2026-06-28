"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useDocumentStatus } from "@/hooks/use-document-status";
import { ClauseCard } from "@/components/document/clause-card";
import { ChatPanel } from "@/components/document/chat-panel";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import type { DocumentDetail } from "@/types/document";

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
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Analyzing your document...</h1>
        <p className="text-muted-foreground">This may take a minute. Page will update automatically.</p>
      </div>
    );
  }

  if (status?.status === "failed") {
    return <p className="text-destructive">Document analysis failed. Please try uploading again.</p>;
  }

  if (!detail) {
    return <p className="text-muted-foreground">Loading document...</p>;
  }

  const { document, clauses } = detail;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{document.fileName}</h1>
          <p className="text-sm text-muted-foreground capitalize">
            {document.documentType} · Overall risk {document.overallRiskScore}%
          </p>
        </div>
        <Link href={`/documents/${params.id}/export`}>
          <Button variant="outline">Export report</Button>
        </Link>
      </div>

      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm dark:border-yellow-900 dark:bg-yellow-950">
        TrustShield is not legal advice. It is a legal literacy tool. For decisions with
        significant financial or legal consequences, consult a qualified lawyer.
      </div>

      {document.executiveSummary && (
        <section>
          <h2 className="mb-2 text-lg font-semibold">Executive summary</h2>
          <p className="text-muted-foreground">{document.executiveSummary}</p>
        </section>
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
