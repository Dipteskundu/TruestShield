"use client";

import { AlertTriangle } from "lucide-react";

interface FlaggedMessageBannerProps {
  reason?: string | null;
}

export function FlaggedMessageBanner({ reason }: FlaggedMessageBannerProps) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2 mb-2">
      <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
      <p className="text-xs text-amber-600 dark:text-amber-400">
        {reason === "prompt_injection_attempt"
          ? "This message was flagged for attempting to override guidelines."
          : reason === "server_command_attempt"
          ? "This message was flagged for requesting restricted operations."
          : "This message was flagged for review."}
      </p>
    </div>
  );
}
