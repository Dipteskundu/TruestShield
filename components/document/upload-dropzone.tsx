"use client";

import { useCallback, useState } from "react";
import { Upload, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface UploadDropzoneProps {
  onFileSelect: (file: File) => void;
  accept?: string;
}

export function UploadDropzone({
  onFileSelect,
  accept = ".pdf,application/pdf",
}: UploadDropzoneProps) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-12 transition-all duration-300",
        dragging
          ? "border-primary bg-primary/5 shadow-glow-sm"
          : "border-border/50 bg-muted/20 hover:border-primary/30 hover:bg-primary/5"
      )}
    >
      <div className={cn(
        "flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-300",
        dragging
          ? "gradient-primary text-white"
          : "bg-primary/10 text-primary"
      )}>
        {dragging ? <FileText className="h-8 w-8" /> : <Upload className="h-8 w-8" />}
      </div>
      <p className="mt-4 text-sm font-medium">
        {dragging ? "Drop your file here" : "Drag and drop a PDF here"}
      </p>
      <p className="mt-1 text-xs text-muted-foreground">or click to browse</p>
      <input
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelect(file);
        }}
      />
    </label>
  );
}
