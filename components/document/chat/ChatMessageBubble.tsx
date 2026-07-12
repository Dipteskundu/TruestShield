"use client";

import CitationTag from "./CitationTag";
import type { DocumentChatMessage, CitedNode } from "@/types/documentChat";
import { User, Bot } from "lucide-react";

interface Props {
  message: DocumentChatMessage;
  onCitationClick: (nodeId: string, pageStart: number) => void;
}

export default function ChatMessageBubble({ message, onCitationClick }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
          <Bot className="h-4 w-4 text-primary" />
        </div>
      )}

      <div
        className={`max-w-[80%] rounded-lg px-4 py-3 ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        }`}
      >
        <div className="text-sm whitespace-pre-wrap">{message.content}</div>

        {!isUser && message.citedNodes && message.citedNodes.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {message.citedNodes.map((node) => (
              <CitationTag
                key={node.nodeId}
                node={node}
                onClick={onCitationClick}
              />
            ))}
          </div>
        )}

        {!isUser && message.confidence && (
          <div className="mt-2 text-xs text-muted-foreground">
            Confidence: {message.confidence}
          </div>
        )}
      </div>

      {isUser && (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
          <User className="h-4 w-4" />
        </div>
      )}
    </div>
  );
}
