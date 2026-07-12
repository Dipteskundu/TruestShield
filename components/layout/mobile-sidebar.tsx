"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  ClipboardList,
  FileText,
  History,
  Image,
  LayoutDashboard,
  ScanSearch,
  Settings,
  X,
  Shield,
  MessageSquare,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

const appLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/usage", label: "Usage", icon: Activity },
  { href: "/dashboard/activity", label: "Activity", icon: ClipboardList },
  { href: "/dashboard/history", label: "History", icon: History },
  { href: "/scan/email", label: "Scan", icon: ScanSearch },
  { href: "/scan/image", label: "Image Scan", icon: Image },
  { href: "/documents/upload", label: "Documents", icon: FileText },
];

const adminLinks = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/users", label: "Users", icon: FileText },
  { href: "/admin/scans", label: "Scans", icon: ScanSearch },
  { href: "/admin/chatbot", label: "Chatbot", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

interface MobileSidebarProps {
  role?: string;
  open?: boolean;
  onClose?: () => void;
}

export function MobileSidebar({ role, open = false, onClose }: MobileSidebarProps) {
  const pathname = usePathname();
  const links = role === "admin" ? adminLinks : appLinks;

  if (!open) return null;

  return (
    <div className="md:hidden">
      <div
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 left-0 z-50 w-72 glass-strong shadow-2xl animate-in slide-in-from-left duration-300">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-border/50 px-5 py-5">
            <Link href="/" className="flex items-center gap-2.5" onClick={onClose}>
              <div className="relative">
                <div className="absolute inset-0 gradient-primary rounded-lg opacity-20 blur-sm" />
                <div className="relative flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                  <Shield className="h-4 w-4 text-white" />
                </div>
              </div>
              <span className="text-sm font-bold tracking-tight">
                Trust<span className="text-gradient">Shield</span>
              </span>
            </Link>
            <button
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-primary/5 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <nav className="flex flex-col gap-1 p-3 flex-1">
            {links.map(({ href, label, icon: Icon }) => {
              const isActive = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={onClose}
                  className={cn(
                    "relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-all duration-200",
                    isActive
                      ? "bg-primary/10 font-medium text-primary"
                      : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full gradient-primary" />
                  )}
                  <Icon className="h-4 w-4" />
                  {label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-border/50 p-3">
            <div className="flex items-center gap-3 rounded-xl px-3.5 py-2.5">
              <ThemeToggle />
              <span className="text-sm text-muted-foreground">Toggle theme</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
