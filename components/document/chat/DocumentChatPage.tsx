"use client";

import Link from "next/link";
import { useDocumentTree } from "@/hooks/useDocumentTree";
import { usePdfNavigation } from "@/hooks/usePdfNavigation";
import TreeOutlinePanel from "./TreeOutlinePanel";
import PdfViewerPanel from "./PdfViewerPanel";
import ChatPanel from "./ChatPanel";
import ProcessingScreen from "./ProcessingScreen";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MessageSquare } from "lucide-react";

interface Props {
  documentId: string;
}

export default function DocumentChatPage({ documentId }: Props) {
  const { tree, isLoading, isBuilding } = useDocumentTree(documentId);
  const {
    activePage,
    highlightedNodeId,
    handleCitationClick,
    handleNodeClick,
  } = usePdfNavigation();

  if (isBuilding) {
    return <ProcessingScreen message="Building document tree — this takes 15–30 seconds..." />;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-background">
      <div className="flex h-12 items-center gap-4 border-b px-4">
        <Link href={`/documents/${documentId}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Document Chat</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 flex-shrink-0 border-r overflow-y-auto">
          <TreeOutlinePanel
            tree={tree}
            highlightedNodeId={highlightedNodeId}
            onNodeClick={handleNodeClick}
          />
        </div>

        <div className="flex-1 overflow-y-auto border-r">
          <PdfViewerPanel
            documentId={documentId}
            currentPage={activePage}
            highlightedNodeId={highlightedNodeId}
          />
        </div>

        <div className="w-96 flex-shrink-0 flex flex-col">
          <ChatPanel
            documentId={documentId}
            onCitationClick={handleCitationClick}
          />
        </div>
      </div>
    </div>
  );
}
