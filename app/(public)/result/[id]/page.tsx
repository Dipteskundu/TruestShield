"use client";

import { useScanResult } from "@/hooks/use-scan-result";
import { ConfidenceGauge } from "@/components/scan/confidence-gauge";
import { ReasonList } from "@/components/scan/reason-list";
import { UrlMetadata } from "@/components/scan/url-metadata";
import { VERDICT_COLORS } from "@/lib/constants";
import { Shield, Loader2 } from "lucide-react";

export default function PublicResultPage({ params }: { params: { id: string } }) {
  const { data, isLoading, error } = useScanResult(params.id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50">
          <Shield className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <p className="text-muted-foreground">Result not found or expired.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-16">
      <div className="mb-8 text-center">
        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${VERDICT_COLORS[data.verdict]}`}>
          {data.verdict}
        </span>
        <h1 className="mt-4 text-2xl font-bold tracking-tight capitalize">{data.type} Scan Result</h1>
      </div>
      <div className="mb-8 flex justify-center">
        <ConfidenceGauge score={data.confidence} verdict={data.verdict} />
      </div>
      <h2 className="mb-4 font-semibold">Why we flagged this</h2>
      <ReasonList reasons={data.reasons} />
      {data.type === "url" && data.metadata && Object.keys(data.metadata).length > 0 && (
        <div className="mt-8">
          <UrlMetadata metadata={data.metadata} verdict={data.verdict} />
        </div>
      )}
    </div>
  );
}
