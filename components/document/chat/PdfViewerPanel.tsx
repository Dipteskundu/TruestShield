"use client";

import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  documentId: string;
  currentPage: number;
  highlightedNodeId: string | null;
}

export default function PdfViewerPanel({
  documentId,
  currentPage,
  highlightedNodeId,
}: Props) {
  const [totalPages, setTotalPages] = useState(1); // eslint-disable-line @typescript-eslint/no-unused-vars
  const [scale, setScale] = useState(1);
  const [pageInput, setPageInput] = useState(currentPage.toString());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  function handlePageChange(page: number) {
    if (page >= 1 && page <= totalPages) {
      setPageInput(page.toString());
    }
  }

  function handlePageInputSubmit(e: React.FormEvent) {
    e.preventDefault();
    const page = parseInt(pageInput, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      setPageInput(page.toString());
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <form onSubmit={handlePageInputSubmit} className="flex items-center gap-1">
            <input
              type="text"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              className="h-7 w-12 rounded border bg-transparent px-1 text-center text-sm"
            />
            <span className="text-sm text-muted-foreground">/ {totalPages}</span>
          </form>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setScale((s) => Math.max(0.5, s - 0.1))}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setScale((s) => Math.min(2, s + 0.1))}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={containerRef}
        className="flex-1 overflow-auto bg-muted/30 p-4"
      >
        <div className="mx-auto" style={{ maxWidth: `${scale * 800}px` }}>
          <div className="rounded-lg border bg-white shadow-sm">
            <div className="flex items-center justify-center p-8 text-sm text-muted-foreground">
              <div className="text-center">
                <p className="mb-2">PDF Viewer</p>
                <p className="text-xs">
                  Page {currentPage} of {totalPages}
                </p>
                <p className="mt-2 text-xs">
                  Document ID: {documentId}
                </p>
                {highlightedNodeId && (
                  <p className="mt-2 text-xs text-primary">
                    Highlighted: {highlightedNodeId}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
