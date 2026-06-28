"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function AdminPage() {
  const [stats, setStats] = useState({
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
      <h1 className="text-3xl font-bold">Admin dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Total users" value={stats.totalUsers} />
        <StatCard label="Total scans" value={stats.totalScans} />
        <StatCard label="Total documents" value={stats.totalDocuments} />
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border p-6">
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
