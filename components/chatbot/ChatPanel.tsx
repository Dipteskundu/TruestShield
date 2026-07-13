"use client";

import { useState, useCallback, useEffect } from "react";
import { useChatStream, type ChatMessage } from "@/hooks/useChatStream";
import { WelcomeScreen } from "./WelcomeScreen";
import { HistoryView } from "./HistoryView";
import { MessageThread } from "./MessageThread";
import { ChatInput } from "./ChatInput";
import { BlockedBanner } from "./BlockedBanner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useToast } from "@/components/ui/toaster";
import { Shield, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";

interface Session {
  _id: string;
  title: string;
  messageCount: number;
  lastMessagePreview: string;
  createdAt: string;
  updatedAt: string;
}

export function ChatPanel() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [blocked, setBlocked] = useState(false);
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [clearing, setClearing] = useState(false);
  const [loadingSession, setLoadingSession] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const { toast } = useToast();

  const {
    sendMessage,
    streamedContent,
    isStreaming,
    currentSessionId,
    setCurrentSessionId,
    reset,
  } = useChatStream();

  const isChatActive = activeSessionId !== null || messages.length > 0;

  useEffect(() => {
    const fetchData = async () => {
      const [statusRes, profileRes] = await Promise.allSettled([
        api.get("/api/chatbot/status"),
        api.get("/api/user/profile"),
      ]);
      if (statusRes.status === "fulfilled") {
        setBlocked(statusRes.value.data.data.blocked);
      }
      if (profileRes.status === "fulfilled") {
        const name = profileRes.value.data.data?.name?.split(" ")[0];
        setUserName(name);
      }
    };
    fetchData();
    loadSessions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadSessions = useCallback(async () => {
    try {
      const { data } = await api.get("/api/chatbot/sessions");
      setSessions(data.data);
    } catch {
      // Ignore
    }
  }, []);

  const loadSession = useCallback(
    async (sessionId: string) => {
      setLoadingSession(true);
      try {
        const { data } = await api.get(`/api/chatbot/sessions/${sessionId}`);
        setMessages(data.data.messages);
        setActiveSessionId(sessionId);
        setCurrentSessionId(sessionId);
      } catch {
        // Ignore
      } finally {
        setLoadingSession(false);
      }
    },
    [setCurrentSessionId]
  );

  const handleNewChat = useCallback(() => {
    setActiveSessionId(null);
    setCurrentSessionId(null);
    setMessages([]);
    reset();
  }, [setCurrentSessionId, reset]);

  const handleDeleteSession = useCallback(
    async (sessionId: string) => {
      try {
        await api.delete(`/api/chatbot/sessions/${sessionId}`);
        setSessions((prev) => prev.filter((s) => s._id !== sessionId));
        if (activeSessionId === sessionId) {
          handleNewChat();
        }
      } catch {
        // Ignore
      }
    },
    [activeSessionId, handleNewChat]
  );

  const handleClearAll = useCallback(async () => {
    setClearing(true);
    try {
      await api.delete("/api/chatbot/sessions");
      setSessions([]);
      handleNewChat();
      toast("All conversations deleted", "success");
    } catch {
      // Ignore
    } finally {
      setClearing(false);
      setShowClearConfirm(false);
    }
  }, [handleNewChat, toast]);

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (blocked || isStreaming) return;

      const userMessage: ChatMessage = {
        _id: `temp-${Date.now()}`,
        role: "user",
        content,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMessage]);

      const result = await sendMessage({
        sessionId: currentSessionId || activeSessionId || undefined,
        message: content,
      });

      if (result) {
        const assistantMessage: ChatMessage = {
          _id: `temp-${Date.now()}-assistant`,
          role: "assistant",
          content: result.content,
          createdAt: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMessage]);

        if (result.sessionId && result.sessionId !== activeSessionId) {
          setActiveSessionId(result.sessionId);
          setCurrentSessionId(result.sessionId);
          loadSessions();
        }
      }
    },
    [
      blocked,
      isStreaming,
      currentSessionId,
      activeSessionId,
      sendMessage,
      loadSessions,
      setCurrentSessionId,
    ]
  );

  return (
    <div className="flex flex-col w-full h-full md:h-[calc(100dvh-5rem)] lg:h-[480px] lg:w-[420px] rounded-t-2xl lg:rounded-2xl border border-border/50 bg-background shadow-2xl overflow-hidden">
      {/* Drag handle for mobile bottom sheet */}
      <div className="flex lg:hidden justify-center pt-2 pb-1">
        <div className="h-1 w-10 rounded-full bg-muted-foreground/30" />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/30">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg gradient-primary">
            <Shield className="h-3.5 w-3.5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-none">AI Assistant</h3>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              TrustShield helper
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {isChatActive && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={() => setShowClearConfirm(true)}
              title="Clear all conversations"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground"
            onClick={handleNewChat}
            title="New chat"
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {blocked && <BlockedBanner />}

      {/* Content */}
      {!isChatActive ? (
        <div className="flex-1 overflow-y-auto">
          <WelcomeScreen userName={userName} onSuggestionClick={handleSendMessage} />
          {sessions.length > 0 && (
            <HistoryView
              sessions={sessions}
              onSelect={loadSession}
              onDelete={handleDeleteSession}
            />
          )}
        </div>
      ) : loadingSession ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
        </div>
      ) : (
        <MessageThread
          messages={messages}
          streamedContent={streamedContent}
          isStreaming={isStreaming}
        />
      )}

      {/* Input */}
      <ChatInput
        onSend={handleSendMessage}
        disabled={isStreaming || blocked}
        isStreaming={isStreaming}
      />

      {/* Clear All Confirm */}
      <ConfirmDialog
        open={showClearConfirm}
        onOpenChange={setShowClearConfirm}
        title="Delete all conversations?"
        description="This will permanently delete all your conversations. This cannot be undone."
        onConfirm={handleClearAll}
        confirmText="Delete all"
        loading={clearing}
      />
    </div>
  );
}
