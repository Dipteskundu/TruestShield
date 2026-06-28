"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { ScanResult } from "@/types/scan";

export function useScanResult(id: string) {
  return useQuery({
    queryKey: ["scan-result", id],
    queryFn: async () => {
      const { data } = await api.get<{ success: boolean; data: ScanResult }>(
        `/api/scan/result/${id}`
      );
      return data.data;
    },
    enabled: Boolean(id),
  });
}
