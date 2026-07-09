"use client";

import { ShieldAlert } from "lucide-react";

export function BlockedBanner() {
  return (
    <div className="flex items-center gap-2 bg-destructive/10 border-b border-destructive/20 px-4 py-2.5">
      <ShieldAlert className="h-4 w-4 text-destructive shrink-0" />
      <p className="text-xs text-destructive">
        Your access to the AI Assistant has been restricted. Please contact support if
        you believe this is an error.
      </p>
    </div>
  );
}
