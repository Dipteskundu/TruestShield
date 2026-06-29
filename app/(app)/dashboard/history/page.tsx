"use client";

import Link from "next/link";
import { useScanHistory } from "@/hooks/use-scan-history";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VERDICT_COLORS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { History, ScanSearch, FileText, ArrowRight, Clock } from "lucide-react";

export default function HistoryPage() {
  const { data, isLoading } = useScanHistory();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 animate-pulse rounded-lg bg-muted" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  const scans = data?.scans || [];
  const documents = data?.documents || [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">History</h1>
        <p className="text-muted-foreground">
          Combined fraud scans and document analyses.
        </p>
      </div>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <ScanSearch className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Scans</h2>
          {scans.length > 0 && (
            <Badge variant="secondary">{scans.length}</Badge>
          )}
        </div>
        {scans.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center">
              <ScanSearch className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No scans yet.</p>
              <Link href="/scan/email" className="text-sm text-primary hover:underline mt-2 inline-block">
                Start your first scan
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {scans.map(
              (scan: {
                id: string;
                type: string;
                verdict: keyof typeof VERDICT_COLORS;
                confidence: number;
                createdAt: string;
              }) => (
                <Link key={scan.id} href={`/result/${scan.id}`}>
                  <Card className="group cursor-pointer hover:border-primary/20 transition-all">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                          <ScanSearch className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium capitalize">{scan.type}</span>
                            <Badge className={VERDICT_COLORS[scan.verdict]}>
                              {scan.verdict}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Clock className="h-3 w-3" />
                            {formatDate(scan.createdAt)} · {scan.confidence}% confidence
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </CardContent>
                  </Card>
                </Link>
              )
            )}
          </div>
        )}
      </section>

      <section>
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-accent" />
          <h2 className="text-lg font-semibold">Documents</h2>
          {documents.length > 0 && (
            <Badge variant="secondary">{documents.length}</Badge>
          )}
        </div>
        {documents.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center">
              <FileText className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No documents yet.</p>
              <Link href="/documents/upload" className="text-sm text-primary hover:underline mt-2 inline-block">
                Upload your first document
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {documents.map(
              (doc: {
                id: string;
                fileName: string;
                status: string;
                overallRiskScore: number;
                createdAt: string;
              }) => (
                <Link key={doc.id} href={`/documents/${doc.id}`}>
                  <Card className="group cursor-pointer hover:border-primary/20 transition-all">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
                          <FileText className="h-4 w-4 text-accent" />
                        </div>
                        <div>
                          <span className="font-medium">{doc.fileName}</span>
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Clock className="h-3 w-3" />
                            {formatDate(doc.createdAt)} · {doc.status} · Risk {doc.overallRiskScore}%
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </CardContent>
                  </Card>
                </Link>
              )
            )}
          </div>
        )}
      </section>
    </div>
  );
}
