"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  X,
  ShieldCheck,
  Shield,
  ShieldAlert,
  Mail,
  LinkIcon,
  Image as ImageIcon,
  FileText,
  Briefcase,
  MessageSquare,
  Clock,
  ChevronRight,
  Copy,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityItem {
  id: string;
  category: "scan" | "document";
  type: string;
  label: string;
  input: string;
  inputFull: string;
  verdict: string | null;
  confidence: number;
  reasons: string[];
  metadata: Record<string, unknown>;
  date: string;
}

interface ActivityDetailPanelProps {
  item: ActivityItem | null;
  onClose: () => void;
}

function VerdictIcon({ verdict }: { verdict: string }) {
  if (verdict === "safe") return <ShieldCheck className="h-5 w-5 text-emerald-500" />;
  if (verdict === "suspicious") return <Shield className="h-5 w-5 text-amber-500" />;
  if (verdict === "dangerous") return <ShieldAlert className="h-5 w-5 text-red-500" />;
  return <Shield className="h-5 w-5 text-muted-foreground" />;
}

function VerdictBadge({ verdict }: { verdict: string }) {
  if (verdict === "safe") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
        <ShieldCheck className="h-3.5 w-3.5" />
        Safe
      </span>
    );
  }
  if (verdict === "suspicious") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
        <Shield className="h-3.5 w-3.5" />
        Suspicious
      </span>
    );
  }
  if (verdict === "dangerous") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-900/50 dark:text-red-300">
        <ShieldAlert className="h-3.5 w-3.5" />
        Dangerous
      </span>
    );
  }
  return null;
}

function TypeIcon({ type, category }: { type: string; category: string }) {
  if (category === "document") return <FileText className="h-5 w-5" />;
  switch (type) {
    case "email":
      return <Mail className="h-5 w-5" />;
    case "url":
      return <LinkIcon className="h-5 w-5" />;
    case "image":
      return <ImageIcon className="h-5 w-5" />;
    case "job":
      return <Briefcase className="h-5 w-5" />;
    case "message":
      return <MessageSquare className="h-5 w-5" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
}

function formatFullDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ActivityDetailPanel({ item, onClose }: ActivityDetailPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (item) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [item, onClose]);

  if (!item) return null;

  const verdictColor =
    item.verdict === "safe"
      ? "border-emerald-500/20 bg-emerald-500/5"
      : item.verdict === "suspicious"
        ? "border-amber-500/20 bg-amber-500/5"
        : item.verdict === "dangerous"
          ? "border-red-500/20 bg-red-500/5"
          : "border-border";

  function copyInput() {
    if (item?.inputFull) {
      navigator.clipboard.writeText(item.inputFull);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className="relative h-full w-full max-w-lg glass-strong border-l border-border/50 shadow-2xl animate-in slide-in-from-right duration-300 overflow-y-auto"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border/50 bg-background/80 backdrop-blur-xl px-6 py-4">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl",
                item.category === "scan" ? "bg-primary/10 text-primary" : "bg-teal-500/10 text-teal-600 dark:text-teal-400"
              )}
            >
              <TypeIcon type={item.type} category={item.category} />
            </div>
            <div>
              <h2 className="font-semibold">{item.label}</h2>
              <p className="text-xs text-muted-foreground capitalize">
                {item.category === "scan" ? `${item.type} scan` : `Document \u00B7 ${item.type}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className={cn("rounded-xl border p-4", verdictColor)}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <VerdictIcon verdict={item.verdict || ""} />
                <div>
                  <p className="text-sm font-medium">Verdict</p>
                  <VerdictBadge verdict={item.verdict || ""} />
                </div>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold tabular-nums">{item.confidence}%</p>
                <p className="text-xs text-muted-foreground">Confidence</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-muted-foreground">Timestamp</h3>
              <div className="flex items-center gap-1.5 text-sm">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                {formatFullDate(item.date)}
              </div>
            </div>
          </div>

          {item.category === "scan" && item.inputFull && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-muted-foreground">Scanned Input</h3>
                <Button variant="ghost" size="sm" onClick={copyInput} className="h-7 px-2">
                  <Copy className="h-3.5 w-3.5 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="rounded-xl border border-border/50 bg-muted/30 p-4">
                <pre className="text-sm text-foreground whitespace-pre-wrap break-words font-sans max-h-60 overflow-y-auto">
                  {item.inputFull}
                </pre>
              </div>
            </div>
          )}

          {item.category === "scan" && item.reasons.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">Analysis Reasons</h3>
              <div className="space-y-2">
                {item.reasons.map((reason, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2 rounded-xl border border-border/50 p-3"
                  >
                    <ChevronRight className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                    <p className="text-sm">{reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {item.category === "document" && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Document Details</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border/50 p-3">
                  <p className="text-xs text-muted-foreground">File Name</p>
                  <p className="text-sm font-medium mt-1">{item.label}</p>
                </div>
                <div className="rounded-xl border border-border/50 p-3">
                  <p className="text-xs text-muted-foreground">Document Type</p>
                  <p className="text-sm font-medium mt-1 capitalize">{item.type}</p>
                </div>
                <div className="rounded-xl border border-border/50 p-3">
                  <p className="text-xs text-muted-foreground">Risk Score</p>
                  <p className="text-sm font-medium mt-1">{item.confidence}%</p>
                </div>
                <div className="rounded-xl border border-border/50 p-3">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className="text-sm font-medium mt-1 capitalize">
                    {(item.metadata.status as string) || "unknown"}
                  </p>
                </div>
              </div>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href={`/documents/${item.id}`}>
                  View Full Document
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}

          {item.category === "scan" && (
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href={`/result/${item.id}`}>
                View Full Result
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
