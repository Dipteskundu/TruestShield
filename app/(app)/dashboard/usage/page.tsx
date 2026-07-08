"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardGradient,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProgressRing } from "@/components/ui/progress-ring";
import { GroupedBarChart } from "@/components/ui/bar-chart";
import { ActivityItem } from "@/components/ui/activity-item";
import api from "@/lib/api";
import {
  BarChart3,
  Clock,
  Crown,
  ArrowRight,
  TrendingUp,
  Zap,
  Shield,
  AlertTriangle,
  RefreshCw,
  Sparkles,
} from "lucide-react";

interface UsageData {
  plan: string;
  limits: { weeklyCredits: number | null; documents: number | null };
  weekly: {
    used: number;
    limit: number | null;
    remaining: number | null;
    text: number;
    url: number;
    image: number;
    total: number;
  };
  monthly: { text: number; url: number; image: number; total: number; documents: number };
  allTime: { text: number; url: number; image: number; total: number; documents: number };
  documents: {
    used: number;
    limit: number | null;
    remaining: number | null;
    note: string;
  };
  recentActivity: Array<{
    id: string;
    category: "scan" | "document";
    type: string;
    detail: string;
    verdict?: string;
    confidence?: number;
    status?: string;
    date: string;
  }>;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="relative overflow-hidden rounded-2xl glass p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10" />
        <div className="relative flex items-center justify-between">
          <div className="space-y-3">
            <div className="h-10 w-48 rounded-lg shimmer" />
            <div className="h-4 w-64 rounded shimmer" />
          </div>
          <div className="h-10 w-24 rounded-full shimmer" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl glass p-6 space-y-4">
            <div className="flex justify-center">
              <div className="h-32 w-32 rounded-full shimmer" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-24 rounded shimmer mx-auto" />
              <div className="h-3 w-32 rounded shimmer mx-auto" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl glass p-6 space-y-4">
          <div className="h-6 w-32 rounded shimmer" />
          <div className="space-y-3">
            {[1, 2, 3].map((j) => (
              <div key={j} className="flex items-center gap-3">
                <div className="h-4 w-16 rounded shimmer" />
                <div className="flex-1 h-8 rounded-lg shimmer" />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl glass p-6 space-y-4">
          <div className="h-6 w-40 rounded shimmer" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-xl shimmer" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded shimmer" />
                  <div className="h-3 w-1/2 rounded shimmer" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Usage</h1>
        <p className="text-muted-foreground">Track your usage and limits.</p>
      </div>
      <Card className="border-dashed">
        <CardContent className="p-12 text-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 mx-auto">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Failed to load usage data</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Something went wrong while fetching your usage stats.
            </p>
          </div>
          <Button variant="outline" onClick={onRetry} className="mt-2">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function UsagePage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<UsageData | null>(null);
  const [error, setError] = useState(false);

  const fetchData = () => {
    setLoading(true);
    setError(false);
    api
      .get("/api/user/usage")
      .then(({ data }) => setData(data.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <LoadingSkeleton />;
  if (error || !data) return <ErrorState onRetry={fetchData} />;

  const isPro = data.plan === "pro";
  const weeklyScanTotal = data.weekly.text + data.weekly.url + data.weekly.image;
  const creditPct =
    data.weekly.limit === null || data.weekly.limit === 0
      ? 100
      : Math.round((data.weekly.used / data.weekly.limit) * 100);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl glass">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-violet-500/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(5,150,105,0.08),transparent_50%)]" />
        <div className="relative p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">Usage & Limits</h1>
            <p className="text-muted-foreground">
              Track your scans, documents, and remaining quotas.
            </p>
          </div>
          <Badge
            variant={isPro ? "default" : "secondary"}
            className={`text-sm px-4 py-1.5 w-fit ${isPro ? "gradient-primary text-white" : ""}`}
          >
            {isPro && <Crown className="mr-1.5 h-3.5 w-3.5" />}
            {isPro ? "Pro" : "Free"} Plan
          </Badge>
        </div>
      </div>

      {/* Credit Rings */}
      <div className="grid gap-6 md:grid-cols-3">
        <CardGradient className="relative overflow-hidden animate-fade-in-up opacity-0 stagger-1">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-400 opacity-5" />
          <CardContent className="relative p-6 flex flex-col items-center text-center space-y-2">
            <ProgressRing
              used={data.weekly.used}
              limit={data.weekly.limit}
              size={140}
              strokeWidth={10}
              gradientFrom="#059669"
              gradientTo="#14b8a6"
              label="Weekly Credits"
              sublabel={
                data.weekly.remaining !== null
                  ? `${data.weekly.remaining} remaining`
                  : "Unlimited"
              }
            />
            <div className="mt-4 space-y-1">
              <p className="text-2xl font-bold font-mono tabular-nums">
                {data.weekly.used}
                <span className="text-lg text-muted-foreground font-normal">
                  {" "}
                  / {data.weekly.limit ?? "\u221E"}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                {creditPct}% used this week
              </p>
            </div>
          </CardContent>
        </CardGradient>

        <CardGradient className="relative overflow-hidden animate-fade-in-up opacity-0 stagger-2">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-400 opacity-5" />
          <CardContent className="relative p-6 flex flex-col items-center text-center space-y-2">
            <ProgressRing
              used={data.documents.used}
              limit={data.documents.limit}
              size={140}
              strokeWidth={10}
              gradientFrom="#8b5cf6"
              gradientTo="#a78bfa"
              label="Documents"
              sublabel={data.documents.note}
            />
            <div className="mt-4 space-y-1">
              <p className="text-2xl font-bold font-mono tabular-nums">
                {data.documents.used}
                <span className="text-lg text-muted-foreground font-normal">
                  {" "}
                  / {data.documents.limit ?? "\u221E"}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">
                {data.documents.limit
                  ? `${Math.round((data.documents.used / data.documents.limit) * 100)}% used`
                  : "Unlimited documents"}
              </p>
            </div>
          </CardContent>
        </CardGradient>

        <Card className="relative overflow-hidden animate-fade-in-up opacity-0 stagger-3">
          <CardContent className="relative p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-400 text-white shadow-md shadow-amber-500/20">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">Scan Breakdown</p>
                <p className="text-xs text-muted-foreground">This week</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  <span className="text-sm text-muted-foreground">Text</span>
                </div>
                <span className="text-sm font-mono tabular-nums font-medium">{data.weekly.text}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-violet-500" />
                  <span className="text-sm text-muted-foreground">URL</span>
                </div>
                <span className="text-sm font-mono tabular-nums font-medium">{data.weekly.url}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
                  <span className="text-sm text-muted-foreground">Image</span>
                </div>
                <span className="text-sm font-mono tabular-nums font-medium">{data.weekly.image}</span>
              </div>
            </div>
            <div className="pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total</span>
                <span className="text-lg font-bold font-mono tabular-nums">{weeklyScanTotal}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="animate-fade-in-up opacity-0 stagger-4">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 text-white shadow-md shadow-emerald-500/20">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Weekly Usage</CardTitle>
                <CardDescription>Scan activity for the past 7 days</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <GroupedBarChart
              groups={[
                {
                  label: "This Week",
                  data: [
                    { label: "Text", value: data.weekly.text, color: "emerald" },
                    { label: "URL", value: data.weekly.url, color: "violet" },
                    { label: "Image", value: data.weekly.image, color: "amber" },
                  ],
                },
                {
                  label: "This Month",
                  data: [
                    { label: "Text", value: data.monthly.text, color: "emerald" },
                    { label: "URL", value: data.monthly.url, color: "violet" },
                    { label: "Image", value: data.monthly.image, color: "amber" },
                    { label: "Docs", value: data.monthly.documents, color: "rose" },
                  ],
                },
              ]}
            />
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up opacity-0 stagger-5">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-400 text-white shadow-md shadow-violet-500/20">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>All Time Stats</CardTitle>
                <CardDescription>Lifetime usage breakdown</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-muted/30 p-4 text-center space-y-1">
                <p className="text-3xl font-bold font-mono tabular-nums">{data.allTime.total.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Scans</p>
              </div>
              <div className="rounded-xl bg-muted/30 p-4 text-center space-y-1">
                <p className="text-3xl font-bold font-mono tabular-nums">{data.allTime.documents.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Documents</p>
              </div>
              <div className="rounded-xl bg-muted/30 p-4 text-center space-y-1">
                <p className="text-3xl font-bold font-mono tabular-nums">{data.allTime.text.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Text Scans</p>
              </div>
              <div className="rounded-xl bg-muted/30 p-4 text-center space-y-1">
                <p className="text-3xl font-bold font-mono tabular-nums">{data.allTime.url.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">URL Scans</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Timeline */}
      {data.recentActivity && data.recentActivity.length > 0 && (
        <Card className="animate-fade-in-up opacity-0 stagger-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-md shadow-blue-500/20">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest scans and documents</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 overflow-y-auto space-y-1 -mx-2 px-2 scrollbar-thin">
              {data.recentActivity.map((item) => (
                <ActivityItem key={item.id} {...item} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upgrade CTA */}
      {!isPro && (
        <CardGradient className="relative overflow-hidden border-dashed animate-fade-in-up opacity-0 stagger-7">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-violet-500/5" />
          <div className="absolute top-4 right-4 animate-float opacity-20">
            <Shield className="h-20 w-20 text-primary" />
          </div>
          <CardContent className="relative p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary text-white shadow-lg shadow-primary/25 shrink-0">
                  <Crown className="h-7 w-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    Need higher limits?
                    <Sparkles className="h-4 w-4 text-primary" />
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Upgrade to Pro for 2x weekly credits, unlimited documents, priority processing, and advanced analytics.
                  </p>
                </div>
              </div>
              <Button asChild size="lg" className="gradient-primary shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 shrink-0">
                <Link href="/pricing">
                  Upgrade to Pro
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </CardGradient>
      )}
    </div>
  );
}
