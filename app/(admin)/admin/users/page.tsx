"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, Crown, Mail, Loader2 } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<
    { _id: string; name: string; email: string; role: string; plan: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/admin/users")
      .then(({ data }) => setUsers(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const planColors: Record<string, string> = {
    free: "bg-muted text-muted-foreground",
    pro: "bg-primary/10 text-primary",
    enterprise: "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  };

  const roleColors: Record<string, string> = {
    user: "bg-muted text-muted-foreground",
    admin: "bg-destructive/10 text-destructive",
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
            <Users className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        </div>
        <p className="text-muted-foreground">{users.length} registered users</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="p-4 text-left font-semibold text-muted-foreground">User</th>
                    <th className="p-4 text-left font-semibold text-muted-foreground">Role</th>
                    <th className="p-4 text-left font-semibold text-muted-foreground">Plan</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b border-border/30 last:border-0 transition-colors hover:bg-muted/30">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10">
                            <Mail className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-xs text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${roleColors[user.role] || roleColors.user}`}>
                          {user.role === "admin" && <Shield className="h-3 w-3" />}
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${planColors[user.plan] || planColors.free}`}>
                          {user.plan === "pro" && <Crown className="h-3 w-3" />}
                          {user.plan}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
