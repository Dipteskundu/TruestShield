"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@/components/document/upload-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DOCUMENT_TYPES } from "@/lib/constants";
import api from "@/lib/api";
import { FileText, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function DocumentUploadPage() {
  const router = useRouter();
  const [documentType, setDocumentType] = useState("other");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("documentType", documentType);
      if (file) {
        formData.append("document", file);
      } else if (text) {
        formData.append("text", text);
      }

      const { data } = await api.post("/api/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      router.push(`/documents/${data.data.id}`);
    } catch {
      setError("Upload failed. Make sure you are logged in and text is at least 50 characters.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Analyze a document</h1>
        </div>
        <p className="text-muted-foreground">
          Upload a PDF or paste contract text. TrustShield is not legal advice.
        </p>
      </div>

      {error && (
        <div className="glass flex items-center gap-3 rounded-xl border border-destructive/20 p-4 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-semibold">Document type</label>
          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="glass flex h-12 w-full rounded-xl border border-border/50 bg-transparent px-4 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {DOCUMENT_TYPES.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <UploadDropzone onFileSelect={setFile} />
        {file && (
          <div className="glass flex items-center gap-2 rounded-xl border border-emerald-500/20 p-3 text-sm text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            Selected: {file.name}
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-semibold">Or paste text</label>
          <textarea
            className="glass min-h-[150px] w-full rounded-xl border border-border/50 bg-transparent px-4 py-3 text-sm transition-all placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            placeholder="Paste contract text here (min 50 characters)..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <Button type="submit" disabled={loading || (!file && text.length < 50)} className="w-full" size="lg">
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <FileText className="mr-2 h-4 w-4" />
          )}
          {loading ? "Uploading..." : "Analyze document"}
        </Button>
      </form>
    </div>
  );
}
