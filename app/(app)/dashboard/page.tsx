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
import { GroupedBarChart, BarChart } from "@/components/ui/bar-chart";
import { DonutChart } from "@/components/ui/donut-chart";
import { ActivityItem } from "@/components/ui/activity-item";
import api from "@/lib/api";
import {
  ScanSearch,
  FileText,
  ArrowRight,
  Mail,
  LinkIcon,
  Image,
  Upload,
  Crown,
  Clock,
  BarChart3,
  TrendingUp,
  Shield,
  AlertTriangle,
  RefreshCw,
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
  monthly: {
    text: number;
    url: number;
    image: number;
    total: number;
    documents: number;
  };
  allTime: {
    text: number;
    url: number;
    image: number;
    total: number;
    documents: number;
  };
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

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function LoadingSkeleton() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="relative overflow-hidden rounded-2xl glass p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10" />
        <div className="relative flex items-center justify-between">
          <div className="space-y-3">
            <div className="h-10 w-64 rounded-lg shimmer" />
            <div className="h-4 w-72 rounded shimmer" />
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
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="rounded-xl bg-muted/30 p-4 space-y-2">
                <div className="h-8 w-16 rounded shimmer mx-auto" />
                <div className="h-3 w-20 rounded shimmer mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl glass p-6 space-y-4">
          <div className="h-6 w-32 rounded shimmer" />
          <div className="flex justify-center">
            <div className="h-40 w-40 rounded-full shimmer" />
          </div>
        </div>
        <div className="rounded-2xl glass p-6 space-y-4">
          <div className="h-6 w-40 rounded shimmer" />
          <div className="space-y-3">
            {[1, 2, 3].map((j) => (
              <div key={j} className="flex items-center gap-3">
                <div className="h-4 w-16 rounded shimmer" />
                <div className="flex-1 h-8 rounded-lg shimmer" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="rounded-2xl glass p-5">
            <div className="flex items-start gap-4">
              <div className="h-12 w-12 rounded-xl shimmer" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-24 rounded shimmer" />
                <div className="h-3 w-40 rounded shimmer" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Your trust verification activity at a glance.</p>
      </div>
      <Card className="border-dashed">
        <CardContent className="p-12 text-center space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 mx-auto">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Failed to load dashboard data</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Something went wrong while fetching your stats.
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

const quickActions = [
  {
    label: "Email Scan",
    description: "Detect phishing and spoofed senders",
    href: "/scan/email",
    icon: Mail,
    gradient: "from-emerald-500 to-teal-400",
  },
  {
    label: "URL Scan",
    description: "Verify links before you click",
    href: "/scan/url",
    icon: LinkIcon,
    gradient: "from-teal-500 to-cyan-400",
  },
  {
    label: "Image Scan",
    description: "Detect AI-generated or manipulated images",
    href: "/scan/image",
    icon: Image,
    gradient: "from-cyan-500 to-blue-400",
  },
  {
    label: "Document Analysis",
    description: "Analyze contracts in plain English",
    href: "/documents/upload",
    icon: Upload,
    gradient: "from-violet-500 to-purple-400",
  },
];

export default function DashboardPage() {
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

  const scanDistribution = [
    { label: "Text", value: data.allTime.text, color: "emerald" },
    { label: "URL", value: data.allTime.url, color: "violet" },
    { label: "Image", value: data.allTime.image, color: "amber" },
  ].filter((d) => d.value > 0);

  const allTimeBarData = [
    { label: "Text", value: data.allTime.text, color: "emerald" },
    { label: "URL", value: data.allTime.url, color: "violet" },
    { label: "Image", value: data.allTime.image, color: "amber" },
    { label: "Docs", value: data.allTime.documents, color: "rose" },
  ];

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl glass animate-fade-in-up">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-violet-500/10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(5,150,105,0.08),transparent_50%)]" />
        <div className="relative p-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
              {getGreeting()} <span className="inline-block animate-float">👋</span>
            </h1>
            <p className="text-muted-foreground">
              Your trust verification activity at a glance.
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
              label="Weekly Scans"
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
                {data.weekly.limit
                  ? `${Math.round((data.weekly.used / data.weekly.limit) * 100)}% used`
                  : "Unlimited scans"}
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
                <ScanSearch className="h-5 w-5" />
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

      {/* Scan Distribution */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="animate-fade-in-up opacity-0 stagger-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-400 text-white shadow-md shadow-cyan-500/20">
                <Shield className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>Scan Distribution</CardTitle>
                <CardDescription>All-time scan type breakdown</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {scanDistribution.length > 0 ? (
              <DonutChart
                data={scanDistribution}
                size={180}
                strokeWidth={28}
                centerLabel="scans"
              />
            ) : (
              <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
                No scans yet
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="animate-fade-in-up opacity-0 stagger-7">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-rose-500 to-pink-400 text-white shadow-md shadow-rose-500/20">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <CardTitle>All-Time Breakdown</CardTitle>
                <CardDescription>Scans and documents combined</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <BarChart data={allTimeBarData} showValues animated />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        {quickActions.map((action, index) => (
          <Link key={action.href} href={action.href}>
            <CardGradient
              className={`group animate-fade-in-up opacity-0 stagger-${index + 8}`}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${action.gradient} text-white shadow-md group-hover:shadow-lg group-hover:scale-110 transition-all duration-300`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">{action.label}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all mt-1" />
                </div>
              </CardContent>
            </CardGradient>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      {data.recentActivity && data.recentActivity.length > 0 && (
        <Card className="animate-fade-in-up opacity-0 stagger-12">
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

      {/* Help CTA */}
      <CardGradient className="border-dashed border-primary/20 animate-fade-in-up opacity-0 stagger-13">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Need help getting started?</h3>
              <p className="text-sm text-muted-foreground">Explore our features and learn how TrustShield works.</p>
            </div>
          </div>
          <Link href="/features">
            <Button variant="outline" className="shrink-0">
              Learn more <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </CardGradient>
    </div>
  );
}
