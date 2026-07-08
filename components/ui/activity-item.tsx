"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Link,
  ImageIcon,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  File,
  Clock,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ActivityItemProps {
  id: string;
  category: "scan" | "document";
  type: string;
  detail: string;
  verdict?: string;
  confidence?: number;
  status?: string;
  date: string;
  className?: string;
}

const typeIcons: Record<string, typeof FileText> = {
  text: FileText,
  url: Link,
  image: ImageIcon,
  document: File,
};

const verdictConfig: Record<
  string,
  { icon: typeof Shield; badge: "glow-safe" | "glow-suspicious" | "glow-dangerous"; label: string }
> = {
  safe: { icon: ShieldCheck, badge: "glow-safe", label: "Safe" },
  suspicious: { icon: ShieldAlert, badge: "glow-suspicious", label: "Suspicious" },
  dangerous: { icon: ShieldX, badge: "glow-dangerous", label: "Dangerous" },
};

const statusConfig: Record<string, { badge: "default" | "secondary" | "destructive" | "outline"; label: string }> = {
  completed: { badge: "default", label: "Completed" },
  processing: { badge: "secondary", label: "Processing" },
  failed: { badge: "destructive", label: "Failed" },
};

export function ActivityItem({
  category,
  type,
  detail,
  verdict,
  confidence,
  status,
  date,
  className,
}: ActivityItemProps) {
  const Icon = typeIcons[type] || FileText;
  const verdictInfo = verdict ? verdictConfig[verdict] : null;
  const statusInfo = status ? statusConfig[status] : null;

  return (
    <div
      className={cn(
        "group flex items-start gap-4 p-4 rounded-xl transition-all duration-200",
        "hover:bg-muted/30 hover:shadow-glass-sm",
        className
      )}
    >
      <div
        className={cn(
          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110",
          category === "scan"
            ? "bg-gradient-to-br from-emerald-500 to-teal-400 text-white shadow-md shadow-emerald-500/20"
            : "bg-gradient-to-br from-violet-500 to-purple-400 text-white shadow-md shadow-violet-500/20"
        )}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-medium truncate">{detail}</p>
          {verdictInfo && (
            <Badge variant={verdictInfo.badge} className="text-[10px] px-2 py-0.5">
              <verdictInfo.icon className="mr-1 h-2.5 w-2.5" />
              {verdictInfo.label}
            </Badge>
          )}
          {statusInfo && !verdictInfo && (
            <Badge variant={statusInfo.badge} className="text-[10px] px-2 py-0.5">
              {statusInfo.label}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(date)}
          </span>
          {confidence !== undefined && (
            <span className="text-xs text-muted-foreground">
              {confidence}% confidence
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
