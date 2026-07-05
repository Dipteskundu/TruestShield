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
  ArrowRight,
  TrendingUp,
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

function ProgressBar({
  used,
  limit,
}: {
  used: number;
  limit: number | null;
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

  return (
    <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
      <div
        className={`h-full rounded-full transition-all duration-700 ease-out ${pct >= 90 ? "bg-red-500" : pct >= 70 ? "bg-amber-500" : "bg-emerald-500"}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
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

  const weeklyScanTotal = data.weekly.text + data.weekly.url + data.weekly.image;

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
                <CardTitle>Weekly Credits</CardTitle>
                <CardDescription>Shared across all scan types</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span>Credits Used</span>
                </div>
                <span className="font-medium tabular-nums">
                  {data.weekly.used} / {data.weekly.limit ?? "\u221E"}
                </span>
              </div>
              <ProgressBar used={data.weekly.used} limit={data.weekly.limit} />
              <p className="text-xs text-muted-foreground">
                {data.weekly.remaining !== null
                  ? `${data.weekly.remaining} remaining this week`
                  : "Unlimited credits"}
              </p>
            </div>

            <div className="border-t border-border pt-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>Documents</span>
                </div>
                <span className="font-medium tabular-nums">
                  {data.documents.used} / {data.documents.limit ?? "\u221E"}
                </span>
              </div>
              <ProgressBar used={data.documents.used} limit={data.documents.limit} />
              <p className="text-xs text-muted-foreground">
                {data.documents.note}
              </p>
            </div>

            <div className="rounded-xl bg-muted/50 p-3 text-center">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{weeklyScanTotal}</span> scans used this week
                {weeklyScanTotal > 0 && data.weekly.limit && (
                  <span className="text-muted-foreground">
                    {" "}({Math.round((weeklyScanTotal / data.weekly.limit) * 100)}% of weekly capacity)
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

    </div>
  );
}
