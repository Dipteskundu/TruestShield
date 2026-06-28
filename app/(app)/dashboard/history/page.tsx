"use client";

import Link from "next/link";
import { useScanHistory } from "@/hooks/use-scan-history";
import { Badge } from "@/components/ui/badge";
import { VERDICT_COLORS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";

export default function HistoryPage() {
  const { data, isLoading } = useScanHistory();

  if (isLoading) {
    return <p className="text-muted-foreground">Loading history...</p>;
  }

  const scans = data?.scans || [];
  const documents = data?.documents || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">History</h1>
        <p className="text-muted-foreground">
          Combined fraud scans and document analyses.
        </p>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Scans</h2>
        {scans.length === 0 ? (
          <p className="text-sm text-muted-foreground">No scans yet.</p>
        ) : (
          <ul className="space-y-2">
            {scans.map(
              (scan: {
                id: string;
                type: string;
                verdict: keyof typeof VERDICT_COLORS;
                confidence: number;
                createdAt: string;
              }) => (
                <li key={scan.id} className="flex items-center justify-between rounded-md border p-4">
                  <div>
                    <span className="font-medium capitalize">{scan.type}</span>
                    <Badge className={`ml-2 ${VERDICT_COLORS[scan.verdict]}`}>
                      {scan.verdict}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(scan.createdAt)} · {scan.confidence}% confidence
                    </p>
                  </div>
                  <Link href={`/result/${scan.id}`} className="text-sm text-primary hover:underline">
                    View
                  </Link>
                </li>
              )
            )}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Documents</h2>
        {documents.length === 0 ? (
          <p className="text-sm text-muted-foreground">No documents yet.</p>
        ) : (
          <ul className="space-y-2">
            {documents.map(
              (doc: {
                id: string;
                fileName: string;
                status: string;
                overallRiskScore: number;
                createdAt: string;
              }) => (
                <li key={doc.id} className="flex items-center justify-between rounded-md border p-4">
                  <div>
                    <span className="font-medium">{doc.fileName}</span>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(doc.createdAt)} · {doc.status} · Risk {doc.overallRiskScore}%
                    </p>
                  </div>
                  <Link href={`/documents/${doc.id}`} className="text-sm text-primary hover:underline">
                    Open
                  </Link>
                </li>
              )
            )}
          </ul>
        )}
      </section>
    </div>
  );
}
