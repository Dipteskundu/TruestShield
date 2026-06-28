"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { formatDate } from "@/lib/utils";

export default function AdminScansPage() {
  const [scans, setScans] = useState<
    { _id: string; type: string; verdict: string; confidence: number; createdAt: string }[]
  >([]);

  useEffect(() => {
    api
      .get("/api/admin/scans")
      .then(({ data }) => setScans(data.data))
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Recent scans</h1>
      <ul className="space-y-2">
        {scans.map((scan) => (
          <li key={scan._id} className="rounded-md border p-4 text-sm">
            <span className="font-medium capitalize">{scan.type}</span>
            <span className="mx-2 text-muted-foreground">·</span>
            <span className="capitalize">{scan.verdict}</span>
            <span className="mx-2 text-muted-foreground">·</span>
            {scan.confidence}% confidence
            <span className="mx-2 text-muted-foreground">·</span>
            {formatDate(scan.createdAt)}
          </li>
        ))}
      </ul>
    </div>
  );
}
