"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { SCAN_TYPES, type ScanType } from "@/lib/constants";
import { ScanInput } from "@/components/scan/scan-input";
import { ConfidenceGauge } from "@/components/scan/confidence-gauge";
import { ReasonList } from "@/components/scan/reason-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { VERDICT_COLORS } from "@/lib/constants";
import api from "@/lib/api";
import type { ScanResult } from "@/types/scan";

const validTypes: ScanType[] = ["email", "job", "message", "url", "image"];

export default function ScanPage({ params }: { params: { type: string } }) {
  const type = params.type as ScanType;
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  if (!validTypes.includes(type)) {
    notFound();
  }

  const config = SCAN_TYPES[type];

  async function handleTextSubmit(content: string) {
    setLoading(true);
    setResult(null);

    try {
      if (type === "url") {
        const { data } = await api.post("/api/scan/url", { url: content });
        setResult(data.data);
      } else {
        const { data } = await api.post("/api/scan/text", {
          type,
          content,
        });
        setResult(data.data);
      }
    } catch {
      alert("Scan failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleImageScan() {
    if (!imageFile) return;
    setLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("image", imageFile);

    try {
      const { data } = await api.post("/api/scan/image", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(data.data);
    } catch {
      alert("Image scan failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">{config.label}</h1>
        <p className="text-muted-foreground">{config.description}</p>
      </div>

      {type === "image" ? (
        <div className="space-y-4">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setImageFile(e.target.files?.[0] || null)}
            className="block w-full text-sm"
          />
          <Button onClick={handleImageScan} disabled={!imageFile || loading}>
            {loading ? "Analyzing..." : "Scan Image"}
          </Button>
        </div>
      ) : (
        <ScanInput
          type={type}
          placeholder={config.placeholder}
          onSubmit={handleTextSubmit}
          loading={loading}
        />
      )}

      {result && (
        <div className="space-y-6 rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <Badge className={VERDICT_COLORS[result.verdict]}>{result.verdict}</Badge>
            {result.id && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push(`/result/${result.id}`)}
              >
                Share result
              </Button>
            )}
          </div>
          <ConfidenceGauge score={result.confidence} verdict={result.verdict} />
          <ReasonList reasons={result.reasons} />
        </div>
      )}
    </div>
  );
}
