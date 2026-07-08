"use client";

import {
  Brain,
  Scissors,
  UserCheck,
  Settings2,
  Image as ImageIcon,
} from "lucide-react";

interface ImageMetadataProps {
  metadata: Record<string, unknown>;
  verdict: string;
}

function getProbabilityColor(value: number): string {
  if (value > 0.8) return "text-red-500";
  if (value > 0.5) return "text-amber-500";
  return "text-emerald-500";
}

function getProbabilityBarColor(value: number): string {
  if (value > 0.8) return "bg-red-500";
  if (value > 0.5) return "bg-amber-500";
  return "bg-emerald-500";
}

function getProbabilityBgColor(value: number): string {
  if (value > 0.8) return "bg-red-100 dark:bg-red-950/50";
  if (value > 0.5) return "bg-amber-100 dark:bg-amber-950/50";
  return "bg-emerald-100 dark:bg-emerald-950/50";
}

function ProbabilityBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className={`text-lg font-bold ${getProbabilityColor(value)}`}>
          {pct}%
        </span>
      </div>
      <div className={`h-2 w-full overflow-hidden rounded-full ${getProbabilityBgColor(value)}`}>
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${getProbabilityBarColor(value)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function ImageMetadata({ metadata }: ImageMetadataProps) {
  const aiGenProb = (metadata.aiGenerationProbability as number) ?? 0;
  const manipProb = (metadata.manipulationProbability as number) ?? 0;
  const faceData = metadata.faceDetection as { count: number } | undefined;
  const mode = (metadata.mode as string) ?? "unknown";

  const isLive = mode === "live";

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <ImageIcon className="h-4 w-4" />
        Image Analysis Details
      </h3>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border/50 p-3 space-y-2.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Brain className="h-3.5 w-3.5" />
            AI Generation
          </div>
          <ProbabilityBar value={aiGenProb} />
        </div>

        <div className="rounded-xl border border-border/50 p-3 space-y-2.5">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Scissors className="h-3.5 w-3.5" />
            Manipulation
          </div>
          <ProbabilityBar value={manipProb} />
        </div>

        <div className="rounded-xl border border-border/50 p-3 space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <UserCheck className="h-3.5 w-3.5" />
            Face Detection
          </div>
          <p className="text-sm font-medium">
            {faceData?.count !== undefined ? (
              <span>
                {faceData.count} face{faceData.count !== 1 ? "s" : ""} detected
              </span>
            ) : (
              <span className="text-muted-foreground">None detected</span>
            )}
          </p>
        </div>

        <div className="rounded-xl border border-border/50 p-3 space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Settings2 className="h-3.5 w-3.5" />
            Analysis Mode
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
              isLive
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
            }`}
          >
            {isLive ? "Live" : "Mock/Fallback"}
          </span>
        </div>
      </div>
    </div>
  );
}
