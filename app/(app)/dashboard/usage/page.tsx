"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import {
  Activity,
  BarChart3,
  Calendar,
  Clock,
  Crown,
  FileText,
  Mail,
  LinkIcon,
  Image,
  ArrowRight,
  Shield,
  ShieldAlert,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

interface UsageCount {
  used: number;
  limit: number | null;
  remaining: number | null;
  note?: string;
}

interface UsageData {
  plan: string;
  limits: { text: number; url: number; image: number; documents: number | null };
  daily: {
    text: UsageCount;
    url: UsageCount;
    image: UsageCount;
    documents: UsageCount;
  };
  weekly: { text: number; url: number; image: number; total: number };
  monthly: { text: number; url: number; image: number; total: number; documents: number };
  allTime: { text: number; url: number; image: number; total: number; documents: number };
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

function ProgressBar({
  used,
  limit,
  color = "primary",
}: {
  used: number;
  limit: number | null;
  color?: string;
}) {
  if (limit === null || limit === 0) {
    return (
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all duration-700 ease-out"
          style={{ width: "100%" }}
        />
      </div>
    );
  }
  const pct = Math.min(100, Math.round((used / limit) * 100));
  const barColor =
    pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : `bg-${color === "primary" ? "emerald" : color}-500`;

  return (
    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ease-out ${pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-emerald-500"}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function VerdictBadge({ verdict }: { verdict: string }) {
  if (verdict === "safe") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
        <ShieldCheck className="h-3 w-3" />
        Safe
      </span>
    );
  }
  if (verdict === "suspicious") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
        <Shield className="h-3 w-3" />
        Suspicious
      </span>
    );
  }
  if (verdict === "dangerous") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/50 dark:text-red-300">
        <ShieldAlert className="h-3 w-3" />
        Dangerous
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
      --
    </span>
  );
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function UsagePage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<UsageData | null>(null);

  useEffect(() => {
    api
      .get("/api/user/usage")
      .then(({ data }) => setData(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="space-y-2">
          <div className="h-10 w-32 rounded-lg bg-muted" />
          <div className="h-4 w-48 rounded bg-muted" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-xl border border-border/50 p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-muted" />
                <div className="space-y-2">
                  <div className="h-4 w-24 rounded bg-muted" />
                  <div className="h-3 w-40 rounded bg-muted" />
                </div>
              </div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((j) => (
                  <div key={j} className="space-y-2">
                    <div className="h-3 w-full rounded bg-muted" />
                    <div className="h-2 w-full rounded bg-muted" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-border/50 p-6 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-muted" />
              <div className="h-8 w-20 rounded bg-muted" />
              <div className="h-4 w-32 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usage</h1>
          <p className="text-muted-foreground">Track your usage and limits.</p>
        </div>
        <Card>
          <CardContent className="p-12 text-center">
            <Activity className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">Failed to load usage data.</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isPro = data.plan === "pro";

  const dailyScanTotal =
    data.daily.text.used + data.daily.url.used + data.daily.image.used;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usage</h1>
          <p className="text-muted-foreground">
            Track your scans, document analyses, and remaining quotas.
          </p>
        </div>
        <Badge
          variant={isPro ? "default" : "secondary"}
          className={`text-sm px-3 py-1 ${isPro ? "bg-gradient-to-r from-emerald-500 to-teal-400 text-white" : ""}`}
        >
          {isPro && <Crown className="mr-1.5 h-3.5 w-3.5" />}
          {isPro ? "Pro" : "Free"} Plan
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-400 opacity-5" />
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 text-white">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Today&apos;s Scans</CardTitle>
                <CardDescription>Daily usage across all scan types</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>Text Scans</span>
                </div>
                <span className="font-medium tabular-nums">
                  {data.daily.text.used} / {data.daily.text.limit}
                </span>
              </div>
              <ProgressBar used={data.daily.text.used} limit={data.daily.text.limit} />
              <p className="text-xs text-muted-foreground">
                {data.daily.text.remaining} remaining today
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4 text-muted-foreground" />
                  <span>URL Scans</span>
                </div>
                <span className="font-medium tabular-nums">
                  {data.daily.url.used} / {data.daily.url.limit}
                </span>
              </div>
              <ProgressBar used={data.daily.url.used} limit={data.daily.url.limit} />
              <p className="text-xs text-muted-foreground">
                {data.daily.url.remaining} remaining today
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Image className="h-4 w-4 text-muted-foreground" />
                  <span>Image Scans</span>
                </div>
                <span className="font-medium tabular-nums">
                  {data.daily.image.used} / {data.daily.image.limit}
                </span>
              </div>
              <ProgressBar used={data.daily.image.used} limit={data.daily.image.limit} />
              <p className="text-xs text-muted-foreground">
                {data.daily.image.remaining} remaining today
              </p>
            </div>

            <div className="border-t border-border pt-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>Documents</span>
                </div>
                <span className="font-medium tabular-nums">
                  {data.daily.documents.used} / {data.daily.documents.limit ?? "\u221E"}
                </span>
              </div>
              <ProgressBar used={data.daily.documents.used} limit={data.daily.documents.limit} />
              <p className="text-xs text-muted-foreground">
                {data.daily.documents.note || `${data.daily.documents.remaining} remaining today`}
              </p>
            </div>

            <div className="rounded-xl bg-muted/50 p-3 text-center">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{dailyScanTotal}</span> scans used today
                {dailyScanTotal > 0 && data.daily.text.limit && (
                  <span className="text-muted-foreground">
                    {" "}({Math.round((dailyScanTotal / (data.daily.text.limit + (data.daily.url.limit ?? 0) + (data.daily.image.limit ?? 0))) * 100)}% of daily capacity)
                  </span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500 to-purple-400 opacity-5" />
          <CardHeader className="relative">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-400 text-white">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Usage Overview</CardTitle>
                <CardDescription>Rolling 7-day and 30-day totals</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative space-y-5">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                Last 7 Days
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-muted/50 p-3 text-center">
                  <p className="text-2xl font-bold tabular-nums">{data.weekly.text}</p>
                  <p className="text-xs text-muted-foreground">Text</p>
                </div>
                <div className="rounded-xl bg-muted/50 p-3 text-center">
                  <p className="text-2xl font-bold tabular-nums">{data.weekly.url}</p>
                  <p className="text-xs text-muted-foreground">URL</p>
                </div>
                <div className="rounded-xl bg-muted/50 p-3 text-center">
                  <p className="text-2xl font-bold tabular-nums">{data.weekly.image}</p>
                  <p className="text-xs text-muted-foreground">Image</p>
                </div>
              </div>
              <div className="rounded-xl bg-primary/5 p-3 text-center">
                <p className="text-sm">
                  <span className="font-semibold text-primary">{data.weekly.total}</span>
                  <span className="text-muted-foreground"> total scans this week</span>
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                Last 30 Days
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div className="rounded-xl bg-muted/50 p-3 text-center">
                  <p className="text-2xl font-bold tabular-nums">{data.monthly.text}</p>
                  <p className="text-xs text-muted-foreground">Text</p>
                </div>
                <div className="rounded-xl bg-muted/50 p-3 text-center">
                  <p className="text-2xl font-bold tabular-nums">{data.monthly.url}</p>
                  <p className="text-xs text-muted-foreground">URL</p>
                </div>
                <div className="rounded-xl bg-muted/50 p-3 text-center">
                  <p className="text-2xl font-bold tabular-nums">{data.monthly.image}</p>
                  <p className="text-xs text-muted-foreground">Image</p>
                </div>
                <div className="rounded-xl bg-muted/50 p-3 text-center">
                  <p className="text-2xl font-bold tabular-nums">{data.monthly.documents}</p>
                  <p className="text-xs text-muted-foreground">Docs</p>
                </div>
              </div>
              <div className="rounded-xl bg-primary/5 p-3 text-center">
                <p className="text-sm">
                  <span className="font-semibold text-primary">{data.monthly.total + data.monthly.documents}</span>
                  <span className="text-muted-foreground"> total actions this month</span>
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-border p-3">
              <div className="flex items-center gap-2 text-sm font-medium mb-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                All Time
              </div>
              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <p className="text-xl font-bold tabular-nums">{data.allTime.total}</p>
                  <p className="text-xs text-muted-foreground">Scans</p>
                </div>
                <div>
                  <p className="text-xl font-bold tabular-nums">{data.allTime.documents}</p>
                  <p className="text-xs text-muted-foreground">Documents</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {!isPro && (
        <Card className="border-dashed relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-400 opacity-5" />
          <CardContent className="relative p-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 text-white">
                <Crown className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">Need higher limits?</h3>
                <p className="text-sm text-muted-foreground">
                  Pro plan gives you 2x daily scan limits, unlimited documents, and priority processing.
                </p>
              </div>
            </div>
            <Button variant="outline" disabled>
              Upgrade to Pro <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {data.recentActivity.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest scans and document analyses</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.recentActivity.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-xl border p-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                        item.category === "scan" ? "bg-primary/10 text-primary" : "bg-teal-500/10 text-teal-600 dark:text-teal-400"
                      }`}
                    >
                      {item.category === "scan" ? (
                        item.type === "image" ? (
                          <Image className="h-4 w-4" />
                        ) : item.type === "url" ? (
                          <LinkIcon className="h-4 w-4" />
                        ) : (
                          <Mail className="h-4 w-4" />
                        )
                      ) : (
                        <FileText className="h-4 w-4" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.detail}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.category === "scan"
                          ? `${item.type.charAt(0).toUpperCase() + item.type.slice(1)} scan`
                          : item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {item.verdict && <VerdictBadge verdict={item.verdict} />}
                    {item.confidence != null && (
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {item.confidence}%
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(item.date)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
