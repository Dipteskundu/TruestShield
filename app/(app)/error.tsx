"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10">
        <AlertTriangle className="h-8 w-8 text-destructive" />
      </div>
      <h1 className="mb-2 text-2xl font-bold">Something went wrong</h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        An unexpected error occurred in the dashboard. Please try again.
      </p>
      <Button variant="outline" onClick={reset}>
        Try Again
      </Button>
    </div>
  );
}
