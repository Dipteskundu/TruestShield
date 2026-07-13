"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { useSession } from "next-auth/react";
import { SCAN_TYPES, type ScanType } from "@/lib/constants";
import { ScanInput } from "@/components/scan/scan-input";
import { copyToClipboard } from "@/lib/clipboard";
import { ImageUploader } from "@/components/scan/image-uploader";
import { ImageMetadata } from "@/components/scan/image-metadata";
import { ConfidenceGauge } from "@/components/scan/confidence-gauge";
import { ReasonList } from "@/components/scan/reason-list";
import { UrlMetadata } from "@/components/scan/url-metadata";
import { CreditBadge } from "@/components/scan/credit-badge";
import { LoginPromptDialog } from "@/components/scan/login-prompt-dialog";
import { UpgradePromptDialog } from "@/components/scan/upgrade-prompt-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VERDICT_COLORS } from "@/lib/constants";
import { canGuestScan, incrementGuestCredits, getGuestCreditsUsed } from "@/lib/guest-credits";
import api from "@/lib/api";
import type { ScanResult } from "@/types/scan";
import { Copy, RefreshCw, Share2, AlertCircle, Clock, Info } from "lucide-react";
import { useRecentScans } from "@/hooks/use-scan-result";
import { formatDate } from "@/lib/utils";

const validTypes: ScanType[] = ["email", "job", "message", "url", "image"];

const TYPE_GUIDANCE: Record<string, string> = {
  email: "Paste the full email including sender address, subject line, and body. Include headers if available — they help detect spoofed senders.",
  job: "Paste the full job description including company name, role title, salary range, and contact details. The more context, the better we can verify legitimacy.",
  message: "Paste the complete message including sender info. Include any links or phone numbers mentioned.",
  url: "Enter the full URL including https://. We'll check domain age, safety blacklists, and redirect chains.",
  image: "Upload an image to check if it was AI-generated or manipulated. JPEG, PNG, and WebP supported.",
};

export default function ScanPage({ params }: { params: { type: string } }) {
  const type = params.type as ScanType;
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

  if (!validTypes.includes(type)) {
    notFound();
  }

  const config = SCAN_TYPES[type];

  useEffect(() => {
    if (session?.user) {
      api.get("/api/user/scans/remaining").then(({ data }) => {
        const key = type === "url" ? "url" : type === "image" ? "image" : "text";
        setRemaining(data.data[key]);
      }).catch(() => {});
    } else {
      // Guest: compute remaining from localStorage
      const used = getGuestCreditsUsed(type);
      setRemaining(2 - used);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(session?.user), type]);

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
      if (!canGuestScan(type)) {
        setShowLoginPrompt(true);
        return false;
      }
      return true;
    }

    // Registered free user
    if (remaining !== null && remaining <= 0) {
      setShowUpgradePrompt(true);
      return false;
    }

    return true;
  }

  async function handleTextSubmit(content: string) {
    if (!checkCredits()) return;

    setLoading(true);
    setResult(null);
    setError("");

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

      if (isGuest) {
        incrementGuestCredits(type);
        setRemaining(2 - (getGuestCreditsUsed(type) + 1));
      } else if (!isPro) {
        setRemaining((prev) => (prev !== null ? prev - 1 : prev));
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Scan failed. Please try again.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function copyShareLink() {
    if (!result?.id) return;
    setCopying(true);
    const ok = await copyToClipboard(`${window.location.origin}/result/${result.id}`);
    if (ok) {
      setTimeout(() => setCopying(false), 1500);
    } else {
      setCopying(false);
    }
  }

  const { data: recentScans } = useRecentScans(
    session?.user ? type : "",
    5
  );

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold tracking-tight">{config.label}</h1>
            <span className="text-2xl">{config.icon}</span>
          </div>
          <p className="text-muted-foreground">{config.description}</p>
        </div>
        <CreditBadge remaining={remaining} limit={isGuest ? 2 : 20} isGuest={isGuest} isPro={isPro} />
      </div>

      <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4 text-sm text-primary/80 backdrop-blur-sm">
        <Info className="h-5 w-5 shrink-0 mt-0.5" />
        <p className="leading-relaxed">{TYPE_GUIDANCE[type]}</p>
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

      {recentScans && recentScans.length > 0 && !result && !loading && (
        <Card>
          <CardContent className="p-0">
            <details className="group">
              <summary className="flex cursor-pointer items-center gap-2 p-4 text-sm font-medium text-muted-foreground hover:text-foreground">
                <Clock className="h-4 w-4" />
                Recent {config.label.toLowerCase()} scans
                <span className="ml-auto text-xs text-muted-foreground">
                  {recentScans.length}
                </span>
              </summary>
              <div className="border-t border-border/50">
                {recentScans.map((scan: { id: string; type: string; verdict: string; confidence: number; createdAt: string }) => (
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
          {type === "image" ? (
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
          ) : (
            <ScanInput
              type={type}
              placeholder={config.placeholder}
              onSubmit={handleTextSubmit}
              loading={loading}
            />
          )}

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
            <div>
              <h3 className="mb-3 font-semibold">Why we flagged this</h3>
              <ReasonList reasons={result.reasons} />
            </div>
            {type === "url" && result.metadata && Object.keys(result.metadata).length > 0 && (
              <UrlMetadata metadata={result.metadata} verdict={result.verdict} />
            )}
            {type === "image" && result.metadata && Object.keys(result.metadata).length > 0 && (
              <ImageMetadata metadata={result.metadata} verdict={result.verdict} />
            )}
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
