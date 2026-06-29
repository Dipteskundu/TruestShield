"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Activity, FileText, TrendingUp, Loader2 } from "lucide-react";

export default function AdminPage() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalScans: 0,
    totalDocuments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/admin/stats")
      .then(({ data }) => setStats(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: "Total users", value: stats.totalUsers, icon: Users, gradient: "gradient-primary" },
    { label: "Total scans", value: stats.totalScans, icon: Activity, gradient: "gradient-accent" },
    { label: "Total documents", value: stats.totalDocuments, icon: FileText, gradient: "gradient-hero" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Admin dashboard</h1>
        <p className="text-muted-foreground">Platform overview and statistics.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {statCards.map((stat) => (
          <Card key={stat.label} className="transition-all hover:shadow-glass-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{stat.value.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.gradient}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <TrendingUp className="h-5 w-5 text-primary" />
          <p className="text-sm text-muted-foreground">
            Your platform is growing. Check individual sections for detailed analytics.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
