"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Search, Send } from "lucide-react";
import type { ScanType } from "@/lib/constants";

interface ScanInputProps {
  type: ScanType;
  placeholder: string;
  onSubmit: (content: string) => Promise<void>;
  loading?: boolean;
}

export function ScanInput({ type, placeholder, onSubmit, loading }: ScanInputProps) {
  const [content, setContent] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    await onSubmit(content.trim());
  }

  if (type === "url") {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            type="url"
            placeholder={placeholder}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            className="h-14 pl-12 text-base"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50" />
        </div>
        <Button type="submit" disabled={loading} size="lg" className="w-full">
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-2 h-4 w-4" />
          )}
          {loading ? "Scanning..." : "Scan URL"}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        className="flex min-h-[200px] w-full rounded-xl border border-input/50 bg-background/50 backdrop-blur-sm px-4 py-3 text-sm ring-offset-background placeholder:text-muted-foreground/60 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:border-primary/50 focus-visible:bg-background resize-none"
        placeholder={placeholder}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading} size="lg" className="w-full">
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Send className="mr-2 h-4 w-4" />
        )}
        {loading ? "Analyzing..." : "Run Scan"}
      </Button>
    </form>
  );
}
