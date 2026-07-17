"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  Briefcase,
  ClipboardList,
  FileText,
  History,
  Image,
  LayoutDashboard,
  Link as LinkIcon,
  Mail,
  MessageSquare,
  ScanSearch,
  Settings,
  X,
  Shield,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";

const appNavGroups = [
  {
    label: "Overview",
    links: [
      { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
      { href: "/dashboard/activity", label: "Activity", icon: ClipboardList },
      { href: "/dashboard/history", label: "History", icon: History },
    ],
  },
  {
    label: "Tools",
    links: [
      { href: "/scan/email", label: "Email Scan", icon: Mail },
      { href: "/scan/url", label: "URL Scan", icon: LinkIcon },
      { href: "/scan/image", label: "Image Scan", icon: Image },
      { href: "/scan/job", label: "Job Scan", icon: Briefcase },
      { href: "/scan/message", label: "Message Scan", icon: MessageSquare },
      { href: "/documents/upload", label: "Documents", icon: FileText },
    ],
  },
];

const adminNavGroups = [
  {
    label: "Overview",
    links: [
      { href: "/admin", label: "Overview", icon: LayoutDashboard },
      { href: "/admin/users", label: "Users", icon: MessageSquare },
      { href: "/admin/scans", label: "Scans", icon: ScanSearch },
      { href: "/admin/chatbot", label: "Chatbot", icon: MessageSquare },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
];

interface MobileSidebarProps {
  role?: string;
  open?: boolean;
  onClose?: () => void;
}

export function MobileSidebar({ role, open = false, onClose }: MobileSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const navGroups = role === "admin" ? adminNavGroups : appNavGroups;
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      const timer = requestAnimationFrame(() => {
        setIsAnimating(true);
      });
      document.body.style.overflow = "hidden";
      return () => cancelAnimationFrame(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      document.body.style.overflow = "";
      return () => clearTimeout(timer);
    }
  }, [open]);

  const handleClose = () => {
    onClose?.();
  };

  if (!shouldRender) return null;

  const user = session?.user;
  const userName = user?.name || user?.email?.split("@")[0] || "User";
  const userImage = user?.image || "";
  const userPlan = (user as { plan?: string })?.plan || "free";
  const planLabel = userPlan === "pro" ? "Pro" : "Free";
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="md:hidden">
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 mobile-menu-backdrop transition-opacity duration-300",
          isAnimating ? "opacity-100" : "opacity-0"
        )}
        onClick={handleClose}
      />

      {/* Sidebar Panel */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[320px] mobile-menu-panel shadow-2xl transition-transform duration-300 ease-out-quint",
          isAnimating ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Glowing background decorations */}
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[40%] rounded-full bg-primary/10 dark:bg-primary/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[40%] rounded-full bg-accent/10 dark:bg-accent/5 blur-3xl pointer-events-none" />

        <div className="flex h-full flex-col relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-5 border-b border-border/30">
            <Link href="/" className="flex items-center gap-3 group" onClick={handleClose}>
              <div className="relative">
                <div className="absolute inset-0 gradient-primary rounded-xl opacity-25 blur-md group-hover:opacity-40 transition-opacity duration-300" />
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl gradient-primary shadow-lg shadow-primary/20">
                  <Shield className="h-5 w-5 text-white" />
                </div>
              </div>
              <div>
                <span className="text-base font-bold tracking-tight">
                  Trust<span className="text-gradient">Shield</span>
                </span>
                <p className="text-[10px] text-muted-foreground/60 font-medium uppercase tracking-wider">
                  {role === "admin" ? "Admin Panel" : "Dashboard"}
                </p>
              </div>
            </Link>
            <button
              onClick={handleClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl hover:bg-muted/50 transition-all duration-200 active:scale-95 border border-transparent hover:border-border/30"
            >
              <X className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 no-scrollbar">
            <div className="space-y-6">
              {navGroups.map((group, groupIndex) => (
                <div
                  key={group.label}
                  className="opacity-0 animate-stagger-fade-in"
                  style={{ animationDelay: `${(groupIndex * 100) + 100}ms` }}
                >
                  {/* Section Header */}
                  <div className="flex items-center gap-2 mb-3 px-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-border/50 to-transparent" />
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/50">
                      {group.label}
                    </p>
                    <div className="h-px flex-1 bg-gradient-to-l from-border/50 to-transparent" />
                  </div>

                  {/* Navigation Items */}
                  <div className="space-y-1">
                    {group.links.map(({ href, label, icon: Icon }, linkIndex) => {
                      const isActive = pathname === href;
                      return (
                        <Link
                          key={href}
                          href={href}
                          onClick={handleClose}
                          className={cn(
                            "mobile-nav-item relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group",
                            isActive
                              ? "mobile-nav-active text-primary"
                              : "text-muted-foreground hover:text-foreground",
                            "opacity-0 animate-stagger-fade-in"
                          )}
                          style={{ animationDelay: `${(groupIndex * 100) + (linkIndex * 50) + 200}ms` }}
                        >
                          {/* Active Indicator */}
                          {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full gradient-primary shadow-lg shadow-primary/30" />
                          )}

                          {/* Icon Container */}
                          <div
                            className={cn(
                              "flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200",
                              isActive
                                ? "bg-primary/10 text-primary"
                                : "bg-muted/30 text-muted-foreground group-hover:bg-primary/5 group-hover:text-primary group-hover:scale-105"
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </div>

                          {/* Label */}
                          <span className="flex-1">{label}</span>

                          {/* Arrow */}
                          <ChevronRight
                            className={cn(
                              "h-4 w-4 transition-all duration-200",
                              isActive
                                ? "text-primary opacity-100 translate-x-0"
                                : "text-muted-foreground/30 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                            )}
                          />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </nav>

          {/* Bottom Section */}
          {session && (
            <div className="border-t border-border/30 p-4 space-y-3">
              {/* User Card */}
              <div
                className="mobile-user-card rounded-xl p-3 opacity-0 animate-stagger-fade-in"
                style={{ animationDelay: "400ms" }}
              >
                <Link
                  href="/dashboard/settings"
                  onClick={handleClose}
                  className="flex items-center gap-3 group"
                >
                  <div className="relative">
                    <div className="absolute inset-0 avatar-glow rounded-full opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-sm font-semibold text-primary overflow-hidden ring-2 ring-primary/20">
                      {userImage ? (
                        <img
                          src={userImage}
                          alt={userName}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        initials
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {userName}
                    </p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-muted-foreground truncate">
                        {user?.email}
                      </p>
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-primary/10 text-primary">
                        {planLabel}
                      </span>
                    </div>
                  </div>
                  <Settings className="h-4 w-4 shrink-0 text-muted-foreground/50 group-hover:text-primary group-hover:rotate-90 transition-all duration-300" />
                </Link>
              </div>

              {/* Action Buttons */}
              <div
                className="flex items-center gap-2 opacity-0 animate-stagger-fade-in"
                style={{ animationDelay: "450ms" }}
              >
                <ThemeToggle className="flex-1 h-10 rounded-xl bg-muted/30 hover:bg-muted/50" />
                <button
                  onClick={() => {
                    handleClose();
                    import("next-auth/react").then(({ signOut }) => signOut());
                  }}
                  className="flex-1 flex items-center justify-center gap-2 h-10 rounded-xl bg-destructive/5 text-destructive hover:bg-destructive/10 transition-all duration-200 text-sm font-medium active:scale-95"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
