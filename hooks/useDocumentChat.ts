"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import type {
  DocumentChatSession,
  DocumentChatMessage,
  DocumentChatResponse,
} from "@/types/documentChat";

export function useDocumentChat(documentId: string) {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: sessions } = useQuery<DocumentChatSession[]>({
    queryKey: ["doc-chat-sessions", documentId],
    queryFn: async () => {
      const res = await api.get(`/api/documents/${documentId}/chat/sessions`);
      return res.data.sessions;
    },
  });

  const { data: messages } = useQuery<DocumentChatMessage[]>({
    queryKey: ["doc-chat-messages", activeSessionId],
    queryFn: async () => {
      const res = await api.get(
        `/api/documents/${documentId}/chat/sessions/${activeSessionId}`
      );
      return res.data.messages;
    },
    enabled: !!activeSessionId,
  });

  const { mutateAsync: sendMessage, isPending } = useMutation<
    DocumentChatResponse,
    Error,
    string
 >({
    mutationFn: async (message: string) => {
      const res = await api.post(`/api/documents/${documentId}/chat/message`, {
        message,
        sessionId: activeSessionId,
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (!activeSessionId) {
        setActiveSessionId(data.sessionId);
      }
      queryClient.invalidateQueries({
        queryKey: ["doc-chat-messages", data.sessionId],
      });
      queryClient.invalidateQueries({
        queryKey: ["doc-chat-sessions", documentId],
      });
    },
  });

  const { mutate: deleteSession } = useMutation({
    mutationFn: async (sessionId: string) => {
      await api.delete(
        `/api/documents/${documentId}/chat/sessions/${sessionId}`
      );
    },
    onSuccess: () => {
      setActiveSessionId(null);
      queryClient.invalidateQueries({
        queryKey: ["doc-chat-sessions", documentId],
      });
    },
  });

  return {
    sessions,
    messages,
    activeSessionId,
    setActiveSessionId,
    sendMessage,
    isSending: isPending,
    deleteSession,
  };
}
