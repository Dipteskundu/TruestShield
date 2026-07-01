"use client";

import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Lock,
  Unlock,
  Globe,
  Calendar,
  ArrowRight,
  AlertTriangle,
  ExternalLink,
  Link2,
  Search,
} from "lucide-react";

interface UrlMetadataProps {
  metadata: Record<string, unknown>;
  verdict: string;
}

function getVerdictIcon(verdict: string) {
  switch (verdict) {
    case "safe":
      return <ShieldCheck className="h-5 w-5 text-emerald-500" />;
    case "suspicious":
      return <ShieldAlert className="h-5 w-5 text-amber-500" />;
    case "dangerous":
      return <ShieldX className="h-5 w-5 text-red-500" />;
    default:
      return <Shield className="h-5 w-5 text-muted-foreground" />;
  }
}

function getVerdictColor(verdict: string) {
  switch (verdict) {
    case "safe":
      return "text-emerald-500";
    case "suspicious":
      return "text-amber-500";
    case "dangerous":
      return "text-red-500";
    default:
      return "text-muted-foreground";
  }
}

function formatAge(days: number | null): string {
  if (days === null) return "Unknown";
  if (days < 30) return `${days} days`;
  if (days < 365) return `${Math.floor(days / 30)} months`;
  const years = Math.floor(days / 365);
  const remainingMonths = Math.floor((days % 365) / 30);
  return remainingMonths > 0 ? `${years}y ${remainingMonths}m` : `${years} year${years > 1 ? "s" : ""}`;
}

function getAgeColor(days: number | null): string {
  if (days === null) return "text-muted-foreground";
  if (days < 30) return "text-red-500";
  if (days < 90) return "text-amber-500";
  return "text-emerald-500";
}

export function UrlMetadata({ metadata, verdict }: UrlMetadataProps) {
  const domain = metadata.domain as string;
  const hasHttps = metadata.hasHttps as boolean;
  const domainAgeDays = metadata.domainAgeDays as number | null;
  const domainCreatedDate = metadata.domainCreatedDate as string | null;
  const domainRegistrar = metadata.domainRegistrar as string | null;
  const redirectCount = metadata.redirectCount as number;
  const redirectChain = metadata.redirectChain as string[];
  const phishingKeywords = metadata.phishingKeywords as string[];
  const safeBrowsingThreat = metadata.safeBrowsingThreat as string | null;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold flex items-center gap-2">
        <Link2 className="h-4 w-4" />
        URL Analysis Details
      </h3>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-border/50 p-3 space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Globe className="h-3.5 w-3.5" />
            Domain
          </div>
          <p className="text-sm font-medium truncate">{domain || "Unknown"}</p>
          {domainRegistrar && (
            <p className="text-xs text-muted-foreground">Registrar: {domainRegistrar}</p>
          )}
        </div>

        <div className="rounded-xl border border-border/50 p-3 space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {hasHttps ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
            HTTPS
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
              hasHttps
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                : "bg-amber-500/10 text-amber-600 dark:text-amber-400"
            }`}
          >
            {hasHttps ? "Secured" : "Not Secured"}
          </span>
        </div>

        <div className="rounded-xl border border-border/50 p-3 space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5" />
            Domain Age
          </div>
          <p className={`text-sm font-medium ${getAgeColor(domainAgeDays)}`}>
            {formatAge(domainAgeDays)}
          </p>
          {domainCreatedDate && (
            <p className="text-xs text-muted-foreground">Registered: {new Date(domainCreatedDate).toLocaleDateString()}</p>
          )}
        </div>

        <div className="rounded-xl border border-border/50 p-3 space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Search className="h-3.5 w-3.5" />
            Safety Check
          </div>
          {safeBrowsingThreat ? (
            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium bg-red-500/10 text-red-600 dark:text-red-400">
              <AlertTriangle className="h-3 w-3" />
              {safeBrowsingThreat}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-3 w-3" />
              Clean
            </span>
          )}
        </div>
      </div>

      {redirectCount > 0 && (
        <div className="rounded-xl border border-border/50 p-3 space-y-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ArrowRight className="h-3.5 w-3.5" />
            Redirect Chain ({redirectCount} hop{redirectCount > 1 ? "s" : ""})
          </div>
          <div className="flex flex-wrap items-center gap-1 text-xs">
            {redirectChain.slice(0, 5).map((url, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className="truncate max-w-[200px] text-muted-foreground">{new URL(url).hostname}</span>
                {i < Math.min(redirectChain.length, 5) - 1 && (
                  <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                )}
              </span>
            ))}
            {redirectChain.length > 5 && (
              <span className="text-muted-foreground">+{redirectChain.length - 5} more</span>
            )}
          </div>
        </div>
      )}

      {phishingKeywords.length > 0 && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 space-y-2">
          <div className="flex items-center gap-2 text-xs text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-3.5 w-3.5" />
            Suspicious Keywords Detected ({phishingKeywords.length})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {phishingKeywords.map((keyword) => (
              <span
                key={keyword}
                className="inline-flex items-center rounded-full bg-amber-500/10 px-2 py-0.5 text-xs text-amber-600 dark:text-amber-400"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
        {getVerdictIcon(verdict)}
        <span className={getVerdictColor(verdict)}>
          Overall: {verdict.charAt(0).toUpperCase() + verdict.slice(1)}
        </span>
      </div>
    </div>
  );
}
