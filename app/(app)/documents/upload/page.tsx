"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@/components/document/upload-dropzone";
import { Button } from "@/components/ui/button";
import { DOCUMENT_TYPES } from "@/lib/constants";
import api from "@/lib/api";
import { FileText, Loader2, AlertCircle, CheckCircle2, Info, Clock } from "lucide-react";

const AUTO_DELETE_OPTIONS = [
  { value: "", label: "Never" },
  { value: "1", label: "After 1 day" },
  { value: "7", label: "After 7 days" },
  { value: "30", label: "After 30 days" },
  { value: "90", label: "After 90 days" },
  { value: "365", label: "After 1 year" },
];

export default function DocumentUploadPage() {
  const router = useRouter();
  const [documentType, setDocumentType] = useState("other");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [autoDelete, setAutoDelete] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("documentType", documentType);
      if (autoDelete) {
        formData.append("autoDeleteDays", autoDelete);
      }
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          setError("File size must be under 10MB.");
          setLoading(false);
          return;
        }
        formData.append("document", file);
      } else if (text) {
        formData.append("text", text);
      }

      const { data } = await api.post("/api/documents/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      router.push(`/documents/${data.data.id}`);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Upload failed. Make sure you are logged in and text is at least 50 characters.";
      setError(message);
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
          Upload a PDF or paste contract text. AI will break it down clause by clause
          with plain-English explanations and risk analysis.
        </p>
      </div>

      <div className="glass flex items-start gap-3 rounded-xl border border-primary/20 p-4">
        <Info className="h-4 w-4 shrink-0 text-primary mt-0.5" />
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">Free plan: 5 documents per month</p>
          <p>Each document is analyzed clause-by-clause with risk scoring, plain-English explanations, and a glossary of legal terms.</p>
        </div>
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
            Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(1)}MB)
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
          {text.length > 0 && text.length < 50 && (
            <p className="mt-1 text-xs text-muted-foreground">
              {50 - text.length} more characters needed
            </p>
          )}
        </div>

        <div className="glass flex items-start gap-3 rounded-xl border border-border/50 p-4">
          <Clock className="h-4 w-4 shrink-0 text-muted-foreground mt-0.5" />
          <div className="flex-1">
            <label className="mb-2 block text-sm font-semibold">Auto-delete document</label>
            <select
              value={autoDelete}
              onChange={(e) => setAutoDelete(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-border/50 bg-transparent px-3 py-2 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {AUTO_DELETE_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-muted-foreground">
              Optionally auto-delete this document after a set period.
            </p>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading || (!file && text.length < 50)}
          className="w-full"
          size="lg"
        >
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
