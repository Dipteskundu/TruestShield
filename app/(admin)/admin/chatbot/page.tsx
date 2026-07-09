"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageSquare,
  AlertTriangle,
  ShieldAlert,
  Activity,
  Loader2,
} from "lucide-react";

interface ChatbotStats {
  totalSessions: number;
  totalMessages: number;
  flaggedMessages: number;
  blockedUsers: number;
  activeBlocks: number;
}

export default function AdminChatbotPage() {
  const [stats, setStats] = useState<ChatbotStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/api/admin/chatbot/stats")
      .then(({ data }) => setStats(data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const statCards = [
    {
      label: "Total Sessions",
      value: stats?.totalSessions || 0,
      icon: MessageSquare,
      gradient: "gradient-primary",
    },
    {
      label: "Total Messages",
      value: stats?.totalMessages || 0,
      icon: Activity,
      gradient: "gradient-accent",
    },
    {
      label: "Flagged Messages",
      value: stats?.flaggedMessages || 0,
      icon: AlertTriangle,
      gradient: "bg-amber-500",
    },
    {
      label: "Active Blocks",
      value: stats?.activeBlocks || 0,
      icon: ShieldAlert,
      gradient: "bg-destructive",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
          <MessageSquare className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chatbot</h1>
          <p className="text-sm text-muted-foreground">
            AI Assistant monitoring and management
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="transition-all hover:shadow-glass-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">{stat.value.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.gradient}`}
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold mb-2">Quick Links</h3>
            <div className="space-y-2">
              <a
                href="/admin/chatbot/flags"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                Review Flagged Messages
              </a>
              <a
                href="/admin/chatbot/blocks"
                className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ShieldAlert className="h-4 w-4 text-destructive" />
                Manage Blocked Users
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold mb-2">Chatbot Model</h3>
            <p className="text-sm text-muted-foreground">
              llama-3.3-70b-versatile via Groq
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Streaming enabled. Max tokens: 1024. Temperature: 0.7.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
