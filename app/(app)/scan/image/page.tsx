"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/scan/image-uploader";
import { copyToClipboard } from "@/lib/clipboard";
import { ConfidenceGauge } from "@/components/scan/confidence-gauge";
import { ReasonList } from "@/components/scan/reason-list";
import { ImageMetadata } from "@/components/scan/image-metadata";
import { CreditBadge } from "@/components/scan/credit-badge";
import { LoginPromptDialog } from "@/components/scan/login-prompt-dialog";
import { UpgradePromptDialog } from "@/components/scan/upgrade-prompt-dialog";
import { Copy, Share2, RefreshCw, Clock, AlertCircle } from "lucide-react";
import { VERDICT_COLORS, type ScanType } from "@/lib/constants";
import api from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { useRecentScans } from "@/hooks/use-scan-result";

interface ScanResult {
  id: string;
  type: string;
  verdict: "safe" | "suspicious" | "dangerous";
  confidence: number;
  reasons: string[];
  metadata?: Record<string, unknown>;
}

const TYPE_GUIDANCE = {
  image: "Upload an image to check if it was AI-generated or manipulated. JPEG, PNG, and WebP supported.",
} as const;

const type = "image" as ScanType;

export default function ImageScanPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const [remaining, setRemaining] = useState<number | null>(null);
  const [copying, setCopying] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);

  const isGuest = !session?.user;
  const isPro = (session?.user as { plan?: string })?.plan === "pro";

  const recentScans = useRecentScans(type);

  useEffect(() => {
    if (session?.user) {
      api.get("/api/user/scans/remaining").then(({ data }) => {
        setRemaining(data.data.image);
      }).catch(() => {});
    } else {
      const used = getGuestCreditsUsed(type);
      setRemaining(2 - used);
    }
  }, [session]);

  function getGuestCreditsUsed(type: string): number {
    if (typeof window === "undefined") return 0;
    try {
      const stored = localStorage.getItem(`guest_credits_${type}`);
      return stored ? JSON.parse(stored) : 0;
    } catch {
      return 0;
    }
  }

  function incrementGuestCredits(type: string) {
    if (typeof window === "undefined") return;
    try {
      const used = getGuestCreditsUsed(type);
      localStorage.setItem(`guest_credits_${type}`, JSON.stringify(used + 1));
    } catch {}
  }

  function clearError() {
    setError("");
  }

  function clearResult() {
    setResult(null);
    setError("");
  }

  function checkCredits(): boolean {
    if (isPro) return true;

    if (isGuest) {
      const used = getGuestCreditsUsed(type);
      if (used >= 2) {
        setShowLoginPrompt(true);
        return false;
      }
      return true;
    }

    if (remaining !== null && remaining <= 0) {
      setShowUpgradePrompt(true);
      return false;
    }
    return true;
  }

  async function copyShareLink() {
    if (!result?.id) return;
    const url = `${window.location.origin}/result/${result.id}`;
    const ok = await copyToClipboard(url);
    if (ok) {
      setCopying(true);
      setTimeout(() => setCopying(false), 2000);
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 animate-fade-in-up">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <span role="img" aria-label="image">🖼️</span>
          Image Scan
        </h1>
        <p className="text-muted-foreground">
          Detect AI-generated or manipulated images — deepfake & manipulation analysis
        </p>
      </div>

      <CreditBadge remaining={remaining} isPro={isPro} isGuest={isGuest} />

      <div className="flex items-start gap-3 rounded-xl border border-border/50 bg-primary/5 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <span className="text-2xl" role="img" aria-label="guide">💡</span>
        </div>
        <p className="leading-relaxed text-sm">{TYPE_GUIDANCE.image}</p>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm text-destructive backdrop-blur-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span className="flex-1">{error}</span>
          <button onClick={clearError} className="font-medium hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {recentScans.data && recentScans.data.length > 0 && !result && !loading && (
        <Card>
          <CardContent className="p-0">
            <details className="group">
              <summary className="flex cursor-pointer items-center gap-2 p-4 text-sm font-medium text-muted-foreground hover:text-foreground">
                <Clock className="h-4 w-4" />
                Recent Image Scans
                <span className="ml-auto text-xs text-muted-foreground">
                  {recentScans.data.length}
                </span>
              </summary>
              <div className="border-t border-border/50">
                {recentScans.data?.map((scan: { id: string; verdict: string; createdAt: string }) => (
                  <button
                    key={scan.id}
                    onClick={() => router.push(`/result/${scan.id}`)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm hover:bg-primary/5 transition-colors"
                  >
                    <span className="text-muted-foreground">
                      {formatDate(scan.createdAt)}
                    </span>
                    <Badge className={VERDICT_COLORS[scan.verdict as keyof typeof VERDICT_COLORS]}>
                      {scan.verdict}
                    </Badge>
                  </button>
                ))}
              </div>
            </details>
          </CardContent>
        </Card>
      )}

      {!result && (
        <>
          <ImageUploader
            onResult={(data) => {
              setResult(data);
              if (isGuest) {
                incrementGuestCredits(type);
                setRemaining(2 - (getGuestCreditsUsed(type) + 1));
              } else if (!isPro) {
                setRemaining((prev) => (prev !== null ? prev - 1 : prev));
              }
            }}
            onError={(msg) => setError(msg)}
            beforeScan={checkCredits}
            loading={loading}
            setLoading={setLoading}
          />

          {loading && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="h-4 w-32 animate-pulse rounded-lg bg-muted" />
                <div className="h-3 w-full animate-pulse rounded-lg bg-muted" />
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 animate-pulse rounded-xl bg-muted" />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {result && (
        <Card className="overflow-hidden">
          <div className={`h-1 w-full ${result.verdict === "safe" ? "bg-gradient-to-r from-emerald-500 to-teal-400" : result.verdict === "suspicious" ? "bg-gradient-to-r from-amber-500 to-yellow-400" : "bg-gradient-to-r from-red-500 to-rose-400"}`} />
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <Badge className={VERDICT_COLORS[result.verdict]}>
                {result.verdict}
              </Badge>
              <div className="flex gap-2">
                {result.id && (
                  <>
                    <Button variant="outline" size="sm" onClick={copyShareLink}>
                      <Copy className="mr-1 h-3 w-3" />
                      {copying ? "Copied!" : "Copy link"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => router.push(`/result/${result.id}`)}
                    >
                      <Share2 className="mr-1 h-3 w-3" />
                      Share
                    </Button>
                  </>
                )}
              </div>
            </div>
            <ConfidenceGauge score={result.confidence} verdict={result.verdict} />
            {result.metadata && <ImageMetadata metadata={result.metadata} verdict={result.verdict} />}
            <div>
              <h3 className="mb-3 font-semibold">Why we flagged this</h3>
              <ReasonList reasons={result.reasons} />
            </div>
            <Button variant="outline" className="w-full" onClick={clearResult}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Scan another
            </Button>
          </CardContent>
        </Card>
      )}

      <LoginPromptDialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt} />
      <UpgradePromptDialog open={showUpgradePrompt} onOpenChange={setShowUpgradePrompt} />
    </div>
  );
}