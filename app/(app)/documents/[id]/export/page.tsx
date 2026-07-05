"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import api from "@/lib/api";
import { Download, FileText, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function DocumentExportPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(false);

  async function handleExport() {
    setLoading(true);
    try {
      const response = await api.get(`/api/documents/${params.id}/export`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `trustshield-report-${params.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg space-y-8">
      <div className="space-y-2">
        <Link href={`/documents/${params.id}`} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-3 w-3" />
          Back to document
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Export report</h1>
        <p className="text-muted-foreground">
          Download a PDF summary of the document analysis including flagged clauses.
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <h3 className="mt-4 text-lg font-semibold">PDF Report</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Executive summary, risk score, clause breakdown, and glossary — formatted as a professional PDF.
          </p>
          <Button onClick={handleExport} disabled={loading} className="mt-6" size="lg">
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            {loading ? "Generating PDF..." : "Download PDF"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
