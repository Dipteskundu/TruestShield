"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CardGradient,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScanSearch, FileText, ShieldAlert, ArrowRight, Mail, LinkIcon, Image, Upload, TrendingUp, TrendingDown, Clock } from "lucide-react";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function AnimatedCounter({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const incrementTime = duration / end;
    const step = Math.max(1, Math.floor(end / 50));

    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>{count.toLocaleString()}</span>;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalScans: 0,
    documentsAnalyzed: 0,
    fraudCaught: 0,
  });

  useEffect(() => {
    api
      .get("/api/user/stats")
      .then(({ data }) => setStats(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      label: "Total Scans",
      value: stats.totalScans,
      icon: ScanSearch,
      gradient: "from-emerald-500 to-teal-400",
      trend: "+12%",
      trendUp: true,
    },
    {
      label: "Documents Analyzed",
      value: stats.documentsAnalyzed,
      icon: FileText,
      gradient: "from-teal-500 to-cyan-400",
      trend: "+8%",
      trendUp: true,
    },
    {
      label: "Fraud Caught",
      value: stats.fraudCaught,
      icon: ShieldAlert,
      gradient: "from-rose-500 to-pink-400",
      trend: stats.fraudCaught > 0 ? "+3%" : "0%",
      trendUp: false,
    },
  ];

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

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="space-y-3">
          <div className="h-10 w-56 rounded-lg shimmer" />
          <div className="h-4 w-72 rounded shimmer" />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl glass p-6 space-y-3">
              <div className="h-12 w-12 rounded-xl shimmer" />
              <div className="h-9 w-24 rounded shimmer" />
              <div className="h-4 w-32 rounded shimmer" />
            </div>
          ))}
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

  return (
    <div className="space-y-8">
      <div className="animate-fade-in-up">
        <h1 className="text-3xl font-bold tracking-tight">
          {getGreeting()} <span className="inline-block animate-float">👋</span>
        </h1>
        <p className="text-muted-foreground mt-1">
          Your trust verification activity at a glance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((stat, index) => (
          <CardGradient
            key={stat.label}
            className={cn(
              "relative overflow-hidden group animate-fade-in-up opacity-0",
              `stagger-${index + 1}`
            )}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-500`} />
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className={cn(
                  "flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full",
                  stat.trendUp
                    ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950"
                    : "text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950"
                )}>
                  {stat.trendUp ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {stat.trend}
                </div>
              </div>
              <CardTitle className="text-3xl font-bold mt-4">
                <AnimatedCounter value={stat.value} />
              </CardTitle>
              <CardDescription>{stat.label}</CardDescription>
            </CardHeader>
          </CardGradient>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {quickActions.map((action, index) => (
          <Link key={action.href} href={action.href}>
            <CardGradient
              className={cn(
                "group animate-fade-in-up opacity-0",
                `stagger-${index + 4}`
              )}
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

      <CardGradient className="border-dashed border-primary/20 animate-fade-in-up opacity-0 stagger-8">
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
