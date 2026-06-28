"use client";

import { Button } from "@/components/ui/button";
import api from "@/lib/api";

export default function DocumentExportPage({ params }: { params: { id: string } }) {
  async function handleExport() {
    const response = await api.get(`/api/documents/${params.id}/export`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `trustshield-report-${params.id}.json`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Export report</h1>
      <p className="text-muted-foreground">
        Download a summary of the document analysis including flagged clauses.
      </p>
      <Button onClick={handleExport}>Download report</Button>
    </div>
  );
}
