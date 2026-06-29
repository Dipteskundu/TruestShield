"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PlatformStats {
  totalUsers: number;
  totalScans: number;
  totalDocuments: number;
}

export default function AdminSettingsPage() {
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 0,
    totalScans: 0,
    totalDocuments: 0,
  });

  useEffect(() => {
    api
      .get("/api/admin/stats")
      .then(({ data }) => setStats(data.data))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="text-muted-foreground">
          Platform overview and configuration.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Platform Overview</CardTitle>
          <CardDescription>Current system statistics.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border p-4">
              <p className="text-2xl font-bold">{stats.totalUsers}</p>
              <p className="text-sm text-muted-foreground">Total Users</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-2xl font-bold">{stats.totalScans}</p>
              <p className="text-sm text-muted-foreground">Total Scans</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="text-2xl font-bold">{stats.totalDocuments}</p>
              <p className="text-sm text-muted-foreground">Documents Analyzed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Rate Limits</CardTitle>
          <CardDescription>Daily scan quotas by plan tier.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-3 text-left">Scan Type</th>
                  <th className="p-3 text-left">Free Plan</th>
                  <th className="p-3 text-left">Pro Plan</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-3 font-medium">Text (email/job/message)</td>
                  <td className="p-3">50 / day</td>
                  <td className="p-3">100 / day</td>
                </tr>
                <tr className="border-b">
                  <td className="p-3 font-medium">URL</td>
                  <td className="p-3">30 / day</td>
                  <td className="p-3">60 / day</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium">Image</td>
                  <td className="p-3">20 / day</td>
                  <td className="p-3">40 / day</td>
                </tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>System</CardTitle>
          <CardDescription>Application configuration.</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-2 text-sm sm:grid-cols-2">
            <dt className="text-muted-foreground">Environment</dt>
            <dd>Development</dd>
            <dt className="text-muted-foreground">API URL</dt>
            <dd>http://localhost:5000</dd>
            <dt className="text-muted-foreground">Frontend URL</dt>
            <dd>http://localhost:3000</dd>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
