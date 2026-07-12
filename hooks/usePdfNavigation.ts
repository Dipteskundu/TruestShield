"use client";

import { useState, useCallback } from "react";

export function usePdfNavigation() {
  const [activePage, setActivePage] = useState<number>(1);
  const [highlightedNodeId, setHighlightedNodeId] = useState<string | null>(
    null
  );

  const handleCitationClick = useCallback(
    (nodeId: string, pageStart: number) => {
      setHighlightedNodeId(nodeId);
      setActivePage(pageStart);
    },
    []
  );

  const handleNodeClick = useCallback(
    (nodeId: string, pageStart: number) => {
      setHighlightedNodeId(nodeId);
      setActivePage(pageStart);
    },
    []
  );

  const clearHighlight = useCallback(() => {
    setHighlightedNodeId(null);
  }, []);

  return {
    activePage,
    highlightedNodeId,
    handleCitationClick,
    handleNodeClick,
    clearHighlight,
  };
}
