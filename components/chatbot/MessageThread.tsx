"use client";

import { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { FlaggedMessageBanner } from "./FlaggedMessageBanner";
import { Bot } from "lucide-react";
import type { ChatMessage } from "@/hooks/useChatStream";

interface MessageThreadProps {
  messages: ChatMessage[];
  streamedContent: string;
  isStreaming: boolean;
}

export function MessageThread({
  messages,
  streamedContent,
  isStreaming,
}: MessageThreadProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamedContent]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
      {messages.map((msg, i) => {
        const prevRole = i > 0 ? messages[i - 1].role : null;
        const isFirstInGroup = msg.role !== prevRole;

        return (
          <div
            key={msg._id}
            className={isFirstInGroup && i > 0 ? "pt-2" : ""}
          >
            {msg.flagged && <FlaggedMessageBanner reason={msg.blockedReason} />}
            <MessageBubble message={msg} />
          </div>
        );
      })}

      {isStreaming && streamedContent && (
        <div className="pt-2">
          <MessageBubble
            message={{
              _id: "streaming",
              role: "assistant",
              content: streamedContent,
              createdAt: new Date().toISOString(),
            }}
          />
        </div>
      )}

      {isStreaming && !streamedContent && (
        <div className="flex justify-start gap-2.5 pt-2">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-0.5">
            <Bot className="h-3 w-3 text-primary" />
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground bg-muted/50 rounded-2xl rounded-bl-md px-4 py-3">
            <div className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}
