"use client";

import { useState, useRef, useEffect } from "react";
import { useDocumentChat } from "@/hooks/useDocumentChat";
import ChatMessageBubble from "./ChatMessageBubble";
import ChatSessionList from "./ChatSessionList";
import { Button } from "@/components/ui/button";
import { Send, Plus, Loader2 } from "lucide-react";
import type { CitedNode } from "@/types/documentChat";

interface Props {
  documentId: string;
  onCitationClick: (nodeId: string, pageStart: number) => void;
}

export default function ChatPanel({ documentId, onCitationClick }: Props) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const {
    sessions,
    messages,
    activeSessionId,
    setActiveSessionId,
    sendMessage,
    isSending,
  } = useDocumentChat(documentId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend() {
    if (!input.trim() || isSending) return;

    const message = input.trim();
    setInput("");

    try {
      await sendMessage(message);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function handleNewChat() {
    setActiveSessionId(null);
    setInput("");
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <ChatSessionList
          sessions={sessions || []}
          activeSessionId={activeSessionId}
          onSelect={setActiveSessionId}
        />
        <Button variant="ghost" size="sm" onClick={handleNewChat}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {(!messages || messages.length === 0) && (
          <div className="flex h-full items-center justify-center text-center">
            <div>
              <p className="text-sm text-muted-foreground">
                Ask any question about this document.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                The AI will find the relevant section and answer with citations.
              </p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {messages?.map((msg) => (
            <ChatMessageBubble
              key={msg._id}
              message={msg}
              onCitationClick={onCitationClick}
            />
          ))}
        </div>

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <div className="flex gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question about this document..."
            className="flex-1 resize-none rounded-lg border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            rows={2}
            disabled={isSending}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isSending}
            size="sm"
          >
            {isSending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
