"use client";

import { useState, useCallback } from "react";
import { getAuthToken } from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface ChatMessage {
  _id: string;
  role: "user" | "assistant";
  content: string;
  flagged?: boolean;
  blockedReason?: string;
  createdAt: string;
}

interface SendMessageOptions {
  sessionId?: string;
  message: string;
  onChunk?: (chunk: string) => void;
}

export function useChatStream() {
  const [streamedContent, setStreamedContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const sendMessage = useCallback(
    async ({ sessionId, message, onChunk }: SendMessageOptions) => {
      setIsStreaming(true);
      setStreamedContent("");
      setError(null);

      const token = getAuthToken();

      try {
        const response = await fetch(`${API_URL}/api/chatbot/message`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({ sessionId, message }),
        });

        const newSessionId = response.headers.get("X-Session-Id");
        if (newSessionId) {
          setCurrentSessionId(newSessionId);
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to send message");
        }

        const reader = response.body?.getReader();
        if (!reader) throw new Error("No response stream");

        const decoder = new TextDecoder();
        let fullContent = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          fullContent += chunk;
          setStreamedContent(fullContent);
          onChunk?.(chunk);
        }

        return {
          content: fullContent,
          sessionId: newSessionId || sessionId || currentSessionId,
        };
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Something went wrong";
        setError(errorMessage);
        return null;
      } finally {
        setIsStreaming(false);
      }
    },
    [currentSessionId]
  );

  const reset = useCallback(() => {
    setStreamedContent("");
    setError(null);
    setCurrentSessionId(null);
  }, []);

  return {
    sendMessage,
    streamedContent,
    isStreaming,
    error,
    currentSessionId,
    setCurrentSessionId,
    reset,
  };
}

export type { ChatMessage };
