"use client";

import { useState } from "react";
import { Trash2, MessageSquare } from "lucide-react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toaster";

interface Session {
  _id: string;
  title: string;
  messageCount: number;
  lastMessagePreview: string;
  createdAt: string;
  updatedAt: string;
}

interface HistoryViewProps {
  sessions: Session[];
  onSelect: (sessionId: string) => void;
  onDelete: (sessionId: string) => void;
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m`;
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function groupSessions(sessions: Session[]): { label: string; items: Session[] }[] {
  const now = new Date();
  const today: Session[] = [];
  const yesterday: Session[] = [];
  const lastWeek: Session[] = [];
  const older: Session[] = [];

  for (const s of sessions) {
    const date = new Date(s.updatedAt);
    const diffDays = Math.floor(
      (now.getTime() - date.getTime()) / (24 * 60 * 60 * 1000)
    );

    if (diffDays < 1) today.push(s);
    else if (diffDays < 2) yesterday.push(s);
    else if (diffDays < 7) lastWeek.push(s);
    else older.push(s);
  }

  const groups: { label: string; items: Session[] }[] = [];
  if (today.length) groups.push({ label: "Today", items: today });
  if (yesterday.length) groups.push({ label: "Yesterday", items: yesterday });
  if (lastWeek.length) groups.push({ label: "Previous 7 days", items: lastWeek });
  if (older.length) groups.push({ label: "Older", items: older });
  return groups;
}

export function HistoryView({ sessions, onSelect, onDelete }: HistoryViewProps) {
  const { toast } = useToast();
  const [deletingSession, setDeletingSession] = useState<Session | null>(null);
  const [deleting, setDeleting] = useState(false);

  if (sessions.length === 0) return null;

  const groups = groupSessions(sessions);

  const handleDelete = async () => {
    if (!deletingSession) return;
    setDeleting(true);
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/chatbot/sessions/${deletingSession._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("trustshield_token") || ""}`,
          },
        }
      );
      onDelete(deletingSession._id);
      toast(`"${deletingSession.title}" deleted`, "success");
    } catch {
      // Ignore
    } finally {
      setDeleting(false);
      setDeletingSession(null);
    }
  };

  return (
    <>
      <div className="px-4 pb-4">
        <p className="text-xs font-medium text-muted-foreground mb-2.5 px-1">
          Recent conversations
        </p>
        <div className="space-y-3">
          {groups.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-1.5 px-1">
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map((session) => (
                  <div
                    key={session._id}
                    className="group flex items-center gap-3 rounded-xl border border-border/40 bg-muted/20 px-3.5 py-2.5 cursor-pointer transition-all hover:bg-muted/50 hover:border-primary/20 hover:shadow-sm"
                    onClick={() => onSelect(session._id)}
                  >
                    <MessageSquare className="h-4 w-4 text-muted-foreground/50 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {session.title}
                      </p>
                      {session.lastMessagePreview && (
                        <p className="text-xs text-muted-foreground truncate">
                          {session.lastMessagePreview}
                        </p>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground/60 shrink-0">
                      {formatRelativeTime(session.updatedAt)}
                    </span>
                    <button
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeletingSession(session);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={deletingSession !== null}
        onOpenChange={(open) => {
          if (!open) setDeletingSession(null);
        }}
        title="Delete conversation?"
        description="This will permanently delete this conversation and all its messages."
        onConfirm={handleDelete}
        confirmText="Delete"
        loading={deleting}
      />
    </>
  );
}
