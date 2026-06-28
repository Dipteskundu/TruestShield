"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
        <Input
          type="url"
          placeholder={placeholder}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Scanning..." : "Scan URL"}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        placeholder={placeholder}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      />
      <Button type="submit" disabled={loading}>
        {loading ? "Analyzing..." : "Run Scan"}
      </Button>
    </form>
  );
}
