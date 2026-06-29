"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { DocumentSummary } from "@/types/document";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Upload, ArrowRight, Loader2, Clock, Shield, AlertTriangle } from "lucide-react";

export default function DocumentHistoryPage() {
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/documents")
      .then(({ data }) => setDocuments(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statusIcon = (status: string) => {
    switch (status) {
      case "ready": return <Shield className="h-3.5 w-3.5 text-emerald-500" />;
      case "processing": return <Loader2 className="h-3.5 w-3.5 text-amber-500 animate-spin" />;
      default: return <AlertTriangle className="h-3.5 w-3.5 text-red-500" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
              <FileText className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Document history</h1>
          </div>
          <p className="text-muted-foreground">Revisit past uploads and analyses.</p>
        </div>
        <Link href="/documents/upload">
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload new
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-2xl bg-muted/50" />
          ))}
        </div>
      ) : documents.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50">
              <FileText className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No documents yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload your first document to get started.
            </p>
            <Link href="/documents/upload" className="mt-4">
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Upload document
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-3">
          {documents.map((doc) => (
            <li key={doc.id}>
              <Link href={`/documents/${doc.id}`}>
                <Card className="transition-all hover:shadow-glass-sm hover:border-primary/20 cursor-pointer group">
                  <CardContent className="flex items-center justify-between p-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <span className="font-semibold">{doc.fileName}</span>
                        <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDate(doc.createdAt)}
                          </span>
                          <span className="flex items-center gap-1">
                            {statusIcon(doc.status)}
                            {doc.status}
                          </span>
                          <span>Risk {doc.overallRiskScore}%</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
