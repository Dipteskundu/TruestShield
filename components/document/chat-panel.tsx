"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import { Send, Loader2, Bot, User, Quote } from "lucide-react";
import type { ChatMessage } from "@/types/document";

interface ChatPanelProps {
  documentId: string;
}

export function ChatPanel({ documentId }: ChatPanelProps) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadHistory() {
      try {
        const { data } = await api.get(`/api/documents/${documentId}/chat`);
        if (data.data?.length > 0) {
          setMessages(data.data);
        }
      } catch {
        // History not available yet
      } finally {
        setHistoryLoaded(true);
      }
    }
    loadHistory();
  }, [documentId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim() || loading) return;

    const userMessage = question.trim();
    setQuestion("");
    setMessages((prev) => [
      ...prev,
      {
        _id: `temp-${Date.now()}`,
        role: "user",
        content: userMessage,
        createdAt: new Date().toISOString(),
      },
    ]);
    setLoading(true);

    try {
      const { data } = await api.post(`/api/documents/${documentId}/chat`, {
        question: userMessage,
      });
      setMessages((prev) => [
        ...prev,
        {
          _id: `temp-${Date.now()}`,
          role: "assistant",
          content: data.data.answer,
          citedClauseIds: data.data.citedClauseIds,
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          _id: `temp-${Date.now()}`,
          role: "assistant",
          content: "Unable to get an answer. Please try again.",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <div>
            <CardTitle className="text-base">Ask the Document</CardTitle>
            <p className="text-xs text-muted-foreground">
              Not legal advice — answers are grounded in your uploaded text only.
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-80 min-h-[120px] space-y-3 overflow-y-auto px-6 pb-4">
          {!historyLoaded && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Loading chat history...
            </p>
          )}
          {historyLoaded && messages.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">
              Ask a question about any clause or obligation in your document.
            </p>
          )}
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-0.5">
                  <Bot className="h-3 w-3 text-primary" />
                </div>
              )}
              <div className="max-w-[80%] space-y-1">
                <div
                  className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "gradient-primary text-white"
                      : "bg-muted/50"
                  }`}
                >
                  {msg.content}
                </div>
                {msg.citedClauseIds && msg.citedClauseIds.length > 0 && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Quote className="h-3 w-3" />
                    <span>
                      Cited: {msg.citedClauseIds.length} clause{msg.citedClauseIds.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>
              {msg.role === "user" && (
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted mt-0.5">
                  <User className="h-3 w-3" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleAsk} className="flex gap-2 border-t border-border/50 p-4">
          <Input
            placeholder="What does the termination clause mean?"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={loading}
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !question.trim()} size="icon">
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
