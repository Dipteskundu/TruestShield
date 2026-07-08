"use client";

import { useState } from "react";
import Link from "next/link";
import { useScanHistory } from "@/hooks/use-scan-history";
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { CardGradient } from "@/components/ui/card";
import { VERDICT_COLORS } from "@/lib/constants";
import { formatDate } from "@/lib/utils";
import { ScanSearch, FileText, ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HistoryPage() {
  const { data, isLoading } = useScanHistory();
  const [activeTab, setActiveTab] = useState<"scans" | "documents">("scans");

  if (isLoading) {
    return (
      <div className="space-y-6 animate-fade-in-up">
        <div className="space-y-3">
          <div className="h-8 w-32 rounded-lg shimmer" />
          <div className="h-4 w-48 rounded shimmer" />
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-24 rounded-xl shimmer" />
          <div className="h-10 w-28 rounded-xl shimmer" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl glass shimmer" />
          ))}
        </div>
      </div>
    );
  }

  const scans = data?.scans || [];
  const documents = data?.documents || [];

  return (
    <div className="space-y-8">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold tracking-tight">History</h1>
        <p className="text-muted-foreground">
          Combined fraud scans and document analyses.
        </p>
      </div>

      <div className="animate-fade-in-up opacity-0 stagger-1">
        <div className="flex gap-2 p-1 glass rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("scans")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              activeTab === "scans"
                ? "gradient-primary text-white shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
            )}
          >
            <ScanSearch className="h-4 w-4" />
            Scans
            {scans.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {scans.length}
              </Badge>
            )}
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
              activeTab === "documents"
                ? "gradient-primary text-white shadow-md"
                : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
            )}
          >
            <FileText className="h-4 w-4" />
            Documents
            {documents.length > 0 && (
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">
                {documents.length}
              </Badge>
            )}
          </button>
        </div>

        <div className="mt-4">
          {activeTab === "scans" && (
            <>
              {scans.length === 0 ? (
                <CardGradient className="border-dashed border-primary/20">
                  <CardContent className="p-12 text-center">
                    <ScanSearch className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">No scans yet.</p>
                    <Link href="/scan/email" className="text-sm text-primary hover:underline mt-2 inline-block">
                      Start your first scan
                    </Link>
                  </CardContent>
                </CardGradient>
              ) : (
                <div className="space-y-2">
                  {scans.map(
                    (scan: {
                      id: string;
                      type: string;
                      verdict: keyof typeof VERDICT_COLORS;
                      confidence: number;
                      createdAt: string;
                    }, index: number) => (
                      <Link key={scan.id} href={`/result/${scan.id}`}>
                        <CardGradient
                          className="group animate-fade-in-up opacity-0"
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 group-hover:scale-110 transition-transform duration-300">
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
                        </CardGradient>
                      </Link>
                    )
                  )}
                </div>
              )}
            </>
          )}

          {activeTab === "documents" && (
            <>
              {documents.length === 0 ? (
                <CardGradient className="border-dashed border-primary/20">
                  <CardContent className="p-12 text-center">
                    <FileText className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">No documents yet.</p>
                    <Link href="/documents/upload" className="text-sm text-primary hover:underline mt-2 inline-block">
                      Upload your first document
                    </Link>
                  </CardContent>
                </CardGradient>
              ) : (
                <div className="space-y-2">
                  {documents.map(
                    (doc: {
                      id: string;
                      fileName: string;
                      status: string;
                      overallRiskScore: number;
                      createdAt: string;
                    }, index: number) => (
                      <Link key={doc.id} href={`/documents/${doc.id}`}>
                        <CardGradient
                          className="group animate-fade-in-up opacity-0"
                          style={{ animationDelay: `${index * 0.05}s` }}
                        >
                          <CardContent className="p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 group-hover:scale-110 transition-transform duration-300">
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
                        </CardGradient>
                      </Link>
                    )
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
