"use client";

import { useScanResult } from "@/hooks/use-scan-result";
import { ConfidenceGauge } from "@/components/scan/confidence-gauge";
import { ReasonList } from "@/components/scan/reason-list";
import { Badge } from "@/components/ui/badge";
import { VERDICT_COLORS } from "@/lib/constants";

export default function PublicResultPage({ params }: { params: { id: string } }) {
  const { data, isLoading, error } = useScanResult(params.id);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        Loading result...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Result not found or expired.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-16">
      <div className="mb-8 text-center">
        <Badge className={VERDICT_COLORS[data.verdict]}>{data.verdict}</Badge>
        <h1 className="mt-4 text-2xl font-bold capitalize">{data.type} Scan Result</h1>
      </div>
      <div className="mb-8 flex justify-center">
        <ConfidenceGauge score={data.confidence} verdict={data.verdict} />
      </div>
      <h2 className="mb-4 font-semibold">Why we flagged this</h2>
      <ReasonList reasons={data.reasons} />
    </div>
  );
}
