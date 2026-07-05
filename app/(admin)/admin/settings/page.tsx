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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toaster";
import { Loader2, Save, Pencil, X } from "lucide-react";

interface PlatformStats {
  totalUsers: number;
  totalScans: number;
  totalDocuments: number;
}

interface RateLimitTier {
  text: number;
  url: number;
  image: number;
}

interface RateLimits {
  free: RateLimitTier;
  pro: RateLimitTier;
}

export default function AdminSettingsPage() {
  const { toast } = useToast();
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 0,
    totalScans: 0,
    totalDocuments: 0,
  });

  const [rateLimits, setRateLimits] = useState<RateLimits>({
    free: { text: 50, url: 30, image: 20 },
    pro: { text: 100, url: 60, image: 40 },
  });
  const [editLimits, setEditLimits] = useState<RateLimits>({
    free: { text: 50, url: 30, image: 20 },
    pro: { text: 100, url: 60, image: 40 },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api
      .get("/api/admin/stats")
      .then(({ data }) => setStats(data.data))
      .catch(() => {});

    api
      .get("/api/admin/rate-limits")
      .then(({ data }) => {
        setRateLimits(data.data);
        setEditLimits(data.data);
      })
      .catch(() => {});
  }, []);

  async function handleSaveRateLimits() {
    setSaving(true);
    try {
      const { data } = await api.put("/api/admin/rate-limits", editLimits);
      if (data.success) {
        setRateLimits(data.data);
        setEditLimits(data.data);
        setIsEditing(false);
        toast("Rate limits updated successfully", "success");
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Failed to update rate limits";
      toast(message, "error");
    } finally {
      setSaving(false);
    }
  }

  function handleCancelEdit() {
    setEditLimits(rateLimits);
    setIsEditing(false);
  }

  function updateLimit(
    plan: "free" | "pro",
    module: "text" | "url" | "image",
    value: string
  ) {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 1) return;
    setEditLimits((prev) => ({
      ...prev,
      [plan]: { ...prev[plan], [module]: num },
    }));
  }

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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Rate Limits</CardTitle>
              <CardDescription>
                Daily scan quotas by plan tier. Changes apply to all users
                immediately.
              </CardDescription>
            </div>
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEdit}
                  disabled={saving}
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveRateLimits} disabled={saving}>
                  {saving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            )}
          </div>
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
                {(["text", "url", "image"] as const).map((module) => (
                  <tr key={module} className="border-b">
                    <td className="p-3 font-medium">
                      {module === "text"
                        ? "Text (email/job/message)"
                        : module.charAt(0).toUpperCase() + module.slice(1)}
                    </td>
                    <td className="p-3">
                      {isEditing ? (
                        <Input
                          type="number"
                          min={1}
                          max={10000}
                          className="w-24"
                          value={editLimits.free[module]}
                          onChange={(e) =>
                            updateLimit("free", module, e.target.value)
                          }
                        />
                      ) : (
                        <span>{rateLimits.free[module]} / day</span>
                      )}
                    </td>
                    <td className="p-3">
                      {isEditing ? (
                        <Input
                          type="number"
                          min={1}
                          max={10000}
                          className="w-24"
                          value={editLimits.pro[module]}
                          onChange={(e) =>
                            updateLimit("pro", module, e.target.value)
                          }
                        />
                      ) : (
                        <span>{rateLimits.pro[module]} / day</span>
                      )}
                    </td>
                  </tr>
                ))}
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
