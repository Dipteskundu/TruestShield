"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Briefcase,
  ClipboardList,
  FileText,
  History,
  Home,
  Image,
  LayoutDashboard,
  Link as LinkIcon,
  LogOut,
  Mail,
  MessageSquare,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navGroups = [
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
  {
    label: "Account",
    links: [
      { href: "/dashboard/settings", label: "Settings", icon: Settings },
      { href: "/", label: "Return to Home", icon: Home },
    ],
  },
];

interface AppSidebarProps {
  collapsed?: boolean;
}

export function AppSidebar({ collapsed = false }: AppSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-14 bottom-0 z-40 glass-strong border-r-0 hidden md:flex md:flex-col overflow-y-auto no-scrollbar transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <nav className="flex flex-col gap-6 p-4 pt-6">
        {navGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2 px-3">
                {group.label}
              </p>
            )}
            <div className="flex flex-col gap-0.5">
              {group.links.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    title={collapsed ? label : undefined}
                    className={cn(
                      "relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-all duration-200 group",
                      collapsed && "justify-center px-0",
                      isActive
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                    )}
                  >
                    {isActive && (
                      <div
                        className={cn(
                          "absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full gradient-primary",
                          collapsed && "left-0"
                        )}
                      />
                    )}
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-transform duration-200",
                        !isActive && "group-hover:scale-110"
                      )}
                    />
                    {!collapsed && <span>{label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
        {session && (
          <div>
            {!collapsed && (
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2 px-3">
                Account
              </p>
            )}
            <div className="flex flex-col gap-0.5">
              <button
                onClick={handleSignOut}
                title={collapsed ? "Sign out" : undefined}
                className={cn(
                  "relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-muted-foreground hover:bg-destructive/5 hover:text-destructive transition-all duration-200 group",
                  collapsed && "justify-center px-0"
                )}
              >
                <LogOut className="h-4 w-4 shrink-0" />
                {!collapsed && <span>Sign out</span>}
              </button>
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
}
