"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import api from "@/lib/api";

interface ChatPanelProps {
  documentId: string;
}

export function ChatPanel({ documentId }: ChatPanelProps) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage = question.trim();
    setQuestion("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const { data } = await api.post(`/api/documents/${documentId}/chat`, {
        question: userMessage,
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.data.answer },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Unable to get an answer. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col rounded-lg border">
      <div className="border-b p-4">
        <h3 className="font-semibold">Ask the Document</h3>
        <p className="text-xs text-muted-foreground">
          Not legal advice — answers are grounded in your uploaded text only.
        </p>
      </div>
      <div className="max-h-64 flex-1 space-y-3 overflow-y-auto p-4">
        {messages.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Ask a question about any clause or obligation in your document.
          </p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`rounded-md p-3 text-sm ${
              msg.role === "user" ? "bg-primary/10 ml-8" : "bg-muted mr-8"
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>
      <form onSubmit={handleAsk} className="flex gap-2 border-t p-4">
        <Input
          placeholder="What does the termination clause mean?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={loading}
        />
        <Button type="submit" disabled={loading}>
          Ask
        </Button>
      </form>
    </div>
  );
}
