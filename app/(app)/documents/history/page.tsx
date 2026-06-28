"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { DocumentSummary } from "@/types/document";
import { formatDate } from "@/lib/utils";

export default function DocumentHistoryPage() {
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);

  useEffect(() => {
    api
      .get("/api/documents")
      .then(({ data }) => setDocuments(data.data))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Document history</h1>
          <p className="text-muted-foreground">Revisit past uploads and analyses.</p>
        </div>
        <Link href="/documents/upload" className="text-sm text-primary hover:underline">
          Upload new →
        </Link>
      </div>

      {documents.length === 0 ? (
        <p className="text-muted-foreground">No documents yet.</p>
      ) : (
        <ul className="space-y-2">
          {documents.map((doc) => (
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
          ))}
        </ul>
      )}
    </div>
  );
}
