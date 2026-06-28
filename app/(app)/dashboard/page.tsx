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
import api from "@/lib/api";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalScans: 0,
    documentsAnalyzed: 0,
    fraudCaught: 0,
  });

  useEffect(() => {
    api
      .get("/api/user/stats")
      .then(({ data }) => setStats(data.data))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Your trust verification activity at a glance.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{stats.totalScans}</CardTitle>
            <CardDescription>Total scans</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{stats.documentsAnalyzed}</CardTitle>
            <CardDescription>Documents analyzed</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{stats.fraudCaught}</CardTitle>
            <CardDescription>Dangerous items caught</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick scan</CardTitle>
            <CardDescription>Run a fraud or URL check</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Link href="/scan/email" className="text-sm text-primary hover:underline">
              Email scan
            </Link>
            <Link href="/scan/url" className="text-sm text-primary hover:underline">
              URL scan
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Documents</CardTitle>
            <CardDescription>Analyze contracts in plain English</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/documents/upload" className="text-sm text-primary hover:underline">
              Upload a document →
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
