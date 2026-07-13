"use client";

import { useState } from "react";
import type { DocumentChatSession } from "@/types/documentChat";
import { ChevronDown, MessageSquare } from "lucide-react";

interface Props {
  sessions: DocumentChatSession[];
  activeSessionId: string | null;
  onSelect: (sessionId: string) => void;
}

export default function ChatSessionList({
  sessions,
  activeSessionId,
  onSelect,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  if (sessions.length === 0) {
    return (
      <span className="text-sm text-muted-foreground">New conversation</span>
    );
  }

  const activeSession = sessions.find((s) => s._id === activeSessionId);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-medium"
      >
        <MessageSquare className="h-4 w-4" />
        {activeSession
          ? activeSession.title || "Untitled conversation"
          : "New conversation"}
        <ChevronDown className="h-3 w-3" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-1 w-64 rounded-lg border bg-background shadow-lg">
          <div className="max-h-64 overflow-y-auto p-1">
            {sessions.map((session) => (
              <button
                key={session._id}
                onClick={() => {
                  onSelect(session._id);
                  setIsOpen(false);
                }}
                className={`flex w-full items-start gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-muted ${
                  session._id === activeSessionId ? "bg-muted" : ""
                }`}
              >
                <MessageSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium">
                    {session.title || "Untitled conversation"}
                  </div>
                  {session.lastMessagePreview && (
                    <div className="truncate text-xs text-muted-foreground">
                      {session.lastMessagePreview}
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
