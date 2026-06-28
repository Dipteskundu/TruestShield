"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UploadDropzone } from "@/components/document/upload-dropzone";
import { Button } from "@/components/ui/button";
import { DOCUMENT_TYPES } from "@/lib/constants";
import api from "@/lib/api";

export default function DocumentUploadPage() {
  const router = useRouter();
  const [documentType, setDocumentType] = useState("other");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

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
      alert("Upload failed. Make sure you are logged in and text is at least 50 characters.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analyze a document</h1>
        <p className="text-muted-foreground">
          Upload a PDF or paste contract text. TrustShield is not legal advice.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="mb-2 block text-sm font-medium">Document type</label>
          <select
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
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
          <p className="text-sm text-muted-foreground">Selected: {file.name}</p>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium">Or paste text</label>
          <textarea
            className="flex min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            placeholder="Paste contract text here (min 50 characters)..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>

        <Button type="submit" disabled={loading || (!file && text.length < 50)}>
          {loading ? "Uploading..." : "Analyze document"}
        </Button>
      </form>
    </div>
  );
}
