"use client";

import { Loader2, TreePine } from "lucide-react";

interface Props {
  message?: string;
}

export default function ProcessingScreen({
  message = "Building document tree...",
}: Props) {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="relative">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl gradient-primary">
          <TreePine className="h-10 w-10 text-white" />
        </div>
        <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-background border-2 border-primary">
          <Loader2 className="h-4 w-4 text-primary animate-spin" />
        </div>
      </div>
      <h1 className="mt-6 text-2xl font-bold">Processing document...</h1>
      <p className="mt-2 text-center text-muted-foreground max-w-md">
        {message}
      </p>
      <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>This may take a moment for large documents</span>
      </div>
    </div>
  );
}
