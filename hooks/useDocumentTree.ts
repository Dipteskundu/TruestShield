"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import type { TreeData } from "@/types/tree";

export function useDocumentTree(documentId: string) {
  const { data, isLoading, error } = useQuery<TreeData>({
    queryKey: ["document-tree", documentId],
    queryFn: async () => {
      const res = await api.get(`/api/documents/${documentId}/tree`);
      return res.data;
    },
    retry: (failureCount, error: any) => {
      if (error?.response?.status === 202) return failureCount < 20;
      return false;
    },
    retryDelay: 3000,
    staleTime: 1000 * 60 * 10,
  });

  const isBuilding = (error as any)?.response?.status === 202;

  return {
    tree: data?.tree || [],
    flat: data?.flat || [],
    nodeCount: data?.nodeCount || 0,
    leafCount: data?.leafCount || 0,
    isLoading,
    isBuilding,
    error: isBuilding ? null : error,
  };
}
