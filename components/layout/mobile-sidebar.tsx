"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
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

  if (!open) return null;

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

          <nav className="flex flex-col gap-5 p-4 overflow-y-auto flex-1 no-scrollbar">
            {navGroups.map((group) => (
              <div key={group.label}>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2 px-3">
                  {group.label}
                </p>
                <div className="flex flex-col gap-0.5">
                  {group.links.map(({ href, label, icon: Icon }) => {
                    const isActive = pathname === href;
                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={onClose}
                        className={cn(
                          "relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-all duration-200 group",
                          isActive
                            ? "bg-primary/10 font-medium text-primary"
                            : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                        )}
                      >
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full gradient-primary" />
                        )}
                        <Icon className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110" />
                        <span>{label}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {session && (
            <div className="border-t border-border/50 p-3">
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard/settings"
                  onClick={onClose}
                  className="flex items-center gap-3 flex-1 min-w-0 rounded-xl bg-muted/30 px-3 py-2.5 hover:bg-muted/50 transition-all group"
                >
                  <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-xs font-semibold text-primary overflow-hidden ring-2 ring-primary/10">
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
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {userName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {planLabel} plan
                    </p>
                  </div>
                  <Settings className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
                </Link>
                <ThemeToggle />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
