"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import api from "@/lib/api";
import { ActivityDetailPanel } from "@/components/activity-detail-panel";
import {
  Activity,
  Search,
  Filter,
  X,
  Mail,
  LinkIcon,
  Image,
  FileText,
  Briefcase,
  MessageSquare,
  ShieldCheck,
  Shield,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Clock,
  SlidersHorizontal,
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

interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const TYPE_FILTERS = [
  { value: "", label: "All Types" },
  { value: "email", label: "Email", icon: Mail },
  { value: "url", label: "URL", icon: LinkIcon },
  { value: "image", label: "Image", icon: Image },
  { value: "job", label: "Job Post", icon: Briefcase },
  { value: "message", label: "Message", icon: MessageSquare },
  { value: "document", label: "Documents", icon: FileText },
];

const VERDICT_FILTERS = [
  { value: "", label: "All Verdicts" },
  { value: "safe", label: "Safe", icon: ShieldCheck, color: "text-emerald-500" },
  { value: "suspicious", label: "Suspicious", icon: Shield, color: "text-amber-500" },
  { value: "dangerous", label: "Dangerous", icon: ShieldAlert, color: "text-red-500" },
];

function TypeIcon({ type, category }: { type: string; category: string }) {
  if (category === "document") return <FileText className="h-4 w-4" />;
  switch (type) {
    case "email":
      return <Mail className="h-4 w-4" />;
    case "url":
      return <LinkIcon className="h-4 w-4" />;
    case "image":
      return <Image className="h-4 w-4" />;
    case "job":
      return <Briefcase className="h-4 w-4" />;
    case "message":
      return <MessageSquare className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
}

function VerdictBadge({ verdict }: { verdict: string | null }) {
  if (verdict === "safe") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
        <ShieldCheck className="h-3 w-3" />
        Safe
      </span>
    );
  }
  if (verdict === "suspicious") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-900/50 dark:text-amber-300">
        <Shield className="h-3 w-3" />
        Suspicious
      </span>
    );
  }
  if (verdict === "dangerous") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-[11px] font-semibold text-red-700 dark:bg-red-900/50 dark:text-red-300">
        <ShieldAlert className="h-3 w-3" />
        Dangerous
      </span>
    );
  }
  return null;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHrs = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHrs < 24) return `${diffHrs}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function truncateInput(input: string, maxLen = 80) {
  if (!input) return "";
  const cleaned = input.replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxLen) return cleaned;
  return cleaned.slice(0, maxLen) + "...";
}

export default function ActivityPage() {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [selectedItem, setSelectedItem] = useState<ActivityItem | null>(null);

  const [typeFilter, setTypeFilter] = useState("");
  const [verdictFilter, setVerdictFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchActivity = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {
        page: String(currentPage),
        limit: "20",
      };
      if (typeFilter) params.type = typeFilter;
      if (verdictFilter) params.verdict = verdictFilter;
      if (debouncedSearch) params.search = debouncedSearch;

      const { data } = await api.get("/api/user/activity", { params });
      setItems(data.data.items);
      setPagination(data.data.pagination);
    } catch {
      setItems([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [currentPage, typeFilter, verdictFilter, debouncedSearch]);

  useEffect(() => {
    fetchActivity();
  }, [fetchActivity]);

  const hasActiveFilters = typeFilter || verdictFilter || debouncedSearch;

  function clearFilters() {
    setTypeFilter("");
    setVerdictFilter("");
    setSearchQuery("");
    setDebouncedSearch("");
    setCurrentPage(1);
  }

  function handleTypeFilter(value: string) {
    setTypeFilter(value);
    setCurrentPage(1);
  }

  function handleVerdictFilter(value: string) {
    setVerdictFilter(value);
    setCurrentPage(1);
  }

  function getPageNumbers(): (number | "...")[] {
    if (!pagination) return [];
    const { page, totalPages } = pagination;
    const pages: (number | "...")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Activity</h1>
          <p className="text-muted-foreground">
            Every scan and document analysis, fully traceable.
          </p>
        </div>
        {pagination && (
          <Badge variant="secondary" className="text-sm">
            {pagination.totalCount} total
          </Badge>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search scanned content or file names..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant={showFilters ? "default" : "outline"}
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className="shrink-0"
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground shrink-0">
              <X className="h-3.5 w-3.5 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {showFilters && (
          <div className="flex flex-wrap items-center gap-2 animate-in slide-in-from-top duration-200">
            <div className="flex items-center gap-1.5">
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Type:</span>
            </div>
            {TYPE_FILTERS.map((f) => (
              <Button
                key={f.value}
                variant={typeFilter === f.value ? "default" : "outline"}
                size="sm"
                onClick={() => handleTypeFilter(f.value)}
                className="h-7 text-xs"
              >
                {f.icon && <f.icon className="h-3 w-3 mr-1" />}
                {f.label}
              </Button>
            ))}

            <div className="w-px h-5 bg-border mx-1" />

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">Verdict:</span>
            </div>
            {VERDICT_FILTERS.map((f) => (
              <Button
                key={f.value}
                variant={verdictFilter === f.value ? "default" : "outline"}
                size="sm"
                onClick={() => handleVerdictFilter(f.value)}
                className="h-7 text-xs"
              >
                {f.icon && <f.icon className={cn("h-3 w-3 mr-1", f.color)} />}
                {f.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <Activity className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
            <p className="text-sm text-muted-foreground">
              {hasActiveFilters ? "No activity matches your filters." : "No activity yet."}
            </p>
            {hasActiveFilters && (
              <Button variant="link" onClick={clearFilters} className="mt-2 text-sm">
                Clear filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-2">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="w-full text-left"
              >
                <Card className="group cursor-pointer hover:border-primary/20 transition-all duration-200">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          "flex h-10 w-10 items-center justify-center rounded-xl shrink-0",
                          item.category === "scan"
                            ? "bg-primary/10 text-primary"
                            : "bg-teal-500/10 text-teal-600 dark:text-teal-400"
                        )}
                      >
                        <TypeIcon type={item.type} category={item.category} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-sm">{item.label}</span>
                          <VerdictBadge verdict={item.verdict} />
                          {item.confidence > 0 && (
                            <span className="text-[11px] text-muted-foreground tabular-nums">
                              {item.confidence}%
                            </span>
                          )}
                        </div>
                        {item.category === "scan" && item.input && (
                          <p className="text-xs text-muted-foreground mt-1 truncate max-w-lg">
                            {truncateInput(item.input)}
                          </p>
                        )}
                        <div className="flex items-center gap-1.5 mt-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          <span className="text-[11px] text-muted-foreground">
                            {formatDate(item.date)}
                          </span>
                          <span className="text-[11px] text-muted-foreground capitalize">
                            {" \u00B7 "}{item.category === "scan" ? `${item.type} scan` : `Document \u00B7 ${item.type}`}
                          </span>
                        </div>
                      </div>

                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </button>
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-muted-foreground">
                Page {pagination.page} of {pagination.totalPages}
              </p>
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={!pagination.hasPrev}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                {getPageNumbers().map((num, i) =>
                  num === "..." ? (
                    <span key={`ellipsis-${i}`} className="px-1 text-muted-foreground">
                      ...
                    </span>
                  ) : (
                    <Button
                      key={num}
                      variant={currentPage === num ? "default" : "outline"}
                      size="icon"
                      className="h-8 w-8 text-xs"
                      onClick={() => setCurrentPage(num)}
                    >
                      {num}
                    </Button>
                  )
                )}
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  disabled={!pagination.hasNext}
                  onClick={() => setCurrentPage((p) => p + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      <ActivityDetailPanel item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
}
