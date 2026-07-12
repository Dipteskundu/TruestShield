"use client";

import type { CitedNode } from "@/types/documentChat";
import { FileText } from "lucide-react";

interface Props {
  node: CitedNode;
  onClick: (nodeId: string, pageStart: number) => void;
}

export default function CitationTag({ node, onClick }: Props) {
  return (
    <button
      onClick={() => onClick(node.nodeId, node.pageStart)}
      className="inline-flex items-center gap-1 rounded-md border border-primary/20 bg-primary/5 px-2 py-0.5 text-xs text-primary hover:bg-primary/10 transition-colors"
    >
      <FileText className="h-3 w-3" />
      <span className="font-medium">{node.title}</span>
      <span className="text-muted-foreground">p.{node.pageStart}</span>
    </button>
  );
}
