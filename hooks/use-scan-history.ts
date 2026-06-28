"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";

export function useScanHistory(module?: string) {
  return useQuery({
    queryKey: ["scan-history", module],
    queryFn: async () => {
      const { data } = await api.get("/api/user/history", {
        params: module ? { module } : undefined,
      });
      return data.data;
    },
  });
}
