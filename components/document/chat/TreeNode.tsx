"use client";

import { ChevronRight, ChevronDown, FileText, Hash } from "lucide-react";
import type { TreeNode as TreeNodeType } from "@/types/tree";

interface Props {
  node: TreeNodeType;
  level: number;
  highlightedNodeId: string | null;
  expandedNodes: Set<string>;
  onToggle: (nodeId: string) => void;
  onClick: (nodeId: string, pageStart: number) => void;
}

export default function TreeNode({
  node,
  level,
  highlightedNodeId,
  expandedNodes,
  onToggle,
  onClick,
}: Props) {
  const isExpanded = expandedNodes.has(node.nodeId);
  const isHighlighted = highlightedNodeId === node.nodeId;
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <button
        onClick={() => {
          onClick(node.nodeId, node.pageStart);
          if (hasChildren) {
            onToggle(node.nodeId);
          }
        }}
        className={`flex w-full items-start gap-1.5 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
          isHighlighted
            ? "bg-primary/10 text-primary"
            : "hover:bg-muted text-muted-foreground hover:text-foreground"
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
      >
        {hasChildren ? (
          <span className="mt-0.5 shrink-0">
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </span>
        ) : (
          <span className="mt-0.5 shrink-0">
            {node.isLeaf ? (
              <Hash className="h-3 w-3" />
            ) : (
              <FileText className="h-3 w-3" />
            )}
          </span>
        )}
        <div className="min-w-0 flex-1">
          <div className="truncate font-medium">{node.title}</div>
          {isExpanded && node.summary && (
            <div className="mt-1 text-xs text-muted-foreground line-clamp-2">
              {node.summary}
            </div>
          )}
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">
          p.{node.pageStart}
        </span>
      </button>

      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <TreeNode
              key={child.nodeId}
              node={child}
              level={level + 1}
              highlightedNodeId={highlightedNodeId}
              expandedNodes={expandedNodes}
              onToggle={onToggle}
              onClick={onClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
