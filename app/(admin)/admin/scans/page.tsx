"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, Loader2, Clock, Shield, AlertTriangle, XCircle, CheckCircle } from "lucide-react";

export default function AdminScansPage() {
  const [scans, setScans] = useState<
    { _id: string; type: string; verdict: string; confidence: number; createdAt: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/admin/scans")
      .then(({ data }) => setScans(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const verdictIcon = (verdict: string) => {
    switch (verdict) {
      case "safe": return <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />;
      case "suspicious": return <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />;
      case "dangerous": return <XCircle className="h-3.5 w-3.5 text-red-500" />;
      default: return <Shield className="h-3.5 w-3.5 text-muted-foreground" />;
    }
  };

  const verdictColors: Record<string, string> = {
    safe: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
    suspicious: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
    dangerous: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
  };

  const confidenceColor = (val: number) => {
    if (val >= 80) return "text-emerald-500";
    if (val >= 50) return "text-amber-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-accent">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Recent scans</h1>
        </div>
        <p className="text-muted-foreground">{scans.length} scans performed</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : scans.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/50">
              <Activity className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <h3 className="mt-4 text-lg font-semibold">No scans yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Scans will appear here once users start using the platform.</p>
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-3">
          {scans.map((scan) => (
            <li key={scan._id}>
              <Card className="transition-all hover:shadow-glass-sm">
                <CardContent className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                      <Activity className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <span className="font-semibold capitalize">{scan.type}</span>
                      <div className="mt-0.5 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(scan.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-semibold ${confidenceColor(scan.confidence)}`}>
                      {scan.confidence}%
                    </span>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${verdictColors[scan.verdict] || verdictColors.safe}`}>
                      {verdictIcon(scan.verdict)}
                      {scan.verdict}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
