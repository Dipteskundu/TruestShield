"use client";

import { useState } from "react";
import TreeNode from "./TreeNode";
import type { TreeNode as TreeNodeType } from "@/types/tree";
import { FileText, ChevronDown, ChevronRight } from "lucide-react";

interface Props {
  tree: TreeNodeType[];
  highlightedNodeId: string | null;
  onNodeClick: (nodeId: string, pageStart: number) => void;
}

export default function TreeOutlinePanel({
  tree,
  highlightedNodeId,
  onNodeClick,
}: Props) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  function toggleNode(nodeId: string) {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }

  function expandAll() {
    const allNodeIds = new Set<string>();
    function collectIds(nodes: TreeNodeType[]) {
      nodes.forEach((n) => {
        if (n.children && n.children.length > 0) {
          allNodeIds.add(n.nodeId);
          collectIds(n.children);
        }
      });
    }
    collectIds(tree);
    setExpandedNodes(allNodeIds);
  }

  function collapseAll() {
    setExpandedNodes(new Set());
  }

  return (
    <div className="p-3">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">Document Outline</span>
        </div>
        <div className="flex gap-1">
          <button
            onClick={expandAll}
            className="rounded p-1 text-xs text-muted-foreground hover:bg-muted"
          >
            <ChevronDown className="h-3 w-3" />
          </button>
          <button
            onClick={collapseAll}
            className="rounded p-1 text-xs text-muted-foreground hover:bg-muted"
          >
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="space-y-0.5">
        {tree.map((node) => (
          <TreeNode
            key={node.nodeId}
            node={node}
            level={0}
            highlightedNodeId={highlightedNodeId}
            expandedNodes={expandedNodes}
            onToggle={toggleNode}
            onClick={onNodeClick}
          />
        ))}
      </div>
    </div>
  );
}
