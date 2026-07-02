"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScanSearch, FileText, ShieldAlert, ArrowRight, Mail, LinkIcon, Image, Upload } from "lucide-react";
import api from "@/lib/api";

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
    },
    {
      label: "Documents Analyzed",
      value: stats.documentsAnalyzed,
      icon: FileText,
      gradient: "from-teal-500 to-cyan-400",
    },
    {
      label: "Fraud Caught",
      value: stats.fraudCaught,
      icon: ShieldAlert,
      gradient: "from-rose-500 to-pink-400",
    },
  ];

  const quickActions = [
    {
      label: "Email Scan",
      description: "Detect phishing and spoofed senders",
      href: "/scan/email",
      icon: Mail,
    },
    {
      label: "URL Scan",
      description: "Verify links before you click",
      href: "/scan/url",
      icon: LinkIcon,
    },
    {
      label: "Image Scan",
      description: "Detect AI-generated or manipulated images",
      href: "/scan/image",
      icon: Image,
    },
    {
      label: "Document Analysis",
      description: "Analyze contracts in plain English",
      href: "/documents/upload",
      icon: Upload,
    },
  ];

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="space-y-2">
          <div className="h-10 w-48 rounded-lg bg-muted" />
          <div className="h-4 w-64 rounded bg-muted" />
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
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-border/50 p-5">
              <div className="flex items-start gap-4">
                <div className="h-11 w-11 rounded-xl bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-24 rounded bg-muted" />
                  <div className="h-3 w-40 rounded bg-muted" />
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back
        </h1>
        <p className="text-muted-foreground">
          Your trust verification activity at a glance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.label} className="relative overflow-hidden group">
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
            <CardHeader className="relative">
              <div className="flex items-center justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold mt-3">{stat.value}</CardTitle>
              <CardDescription>{stat.label}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {quickActions.map((action) => (
          <Link key={action.href} href={action.href}>
            <Card className="group cursor-pointer hover:border-primary/30 transition-all duration-300">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">{action.label}</h3>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="border-dashed">
        <CardContent className="p-6 flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Need help getting started?</h3>
            <p className="text-sm text-muted-foreground">Explore our features and learn how TrustShield works.</p>
          </div>
          <Link href="/features">
            <Button variant="outline">
              Learn more <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
