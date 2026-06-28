"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

interface DocumentStatus {
  status: string;
  overallRiskScore?: number;
  executiveSummary?: string;
}

export function useDocumentStatus(id: string, enabled = true) {
  return useQuery({
    queryKey: ["document-status", id],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: DocumentStatus }>(
        `/api/documents/${id}/status`
      );
      return data.data;
    },
    enabled: Boolean(id) && enabled,
    refetchInterval: (query) =>
      query.state.data?.status === "processing" ? 3000 : false,
  });
}
