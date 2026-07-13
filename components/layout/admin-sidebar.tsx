"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, ScanSearch, Settings, Users, Shield, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Overview", icon: BarChart3 },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/scans", label: "Scans", icon: ScanSearch },
  { href: "/admin/chatbot", label: "Chatbot", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

interface AdminSidebarProps {
  collapsed?: boolean;
}

export function AdminSidebar({ collapsed = false }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "hidden glass-strong border-r-0 md:block transition-all duration-300 ease-in-out",
        collapsed ? "w-16 shrink-0" : "w-64 shrink-0"
      )}
    >
      <div className={cn(
        "flex items-center gap-2.5 border-b border-border/50",
        collapsed ? "justify-center px-2 py-5" : "px-5 py-5"
      )}>
        <div className="relative">
          <div className="absolute inset-0 gradient-primary rounded-lg opacity-20 blur-sm" />
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
            <Shield className="h-4 w-4 text-white" />
          </div>
        </div>
        {!collapsed && (
          <span className="text-sm font-bold tracking-tight">
            Trust<span className="text-gradient">Shield</span>
          </span>
        )}
      </div>
      {!collapsed && (
        <div className="px-5 py-3">
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary/70">
            Admin Panel
          </span>
        </div>
      )}
      <nav className="flex flex-col gap-1 p-3">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-all duration-200",
                collapsed && "justify-center px-0",
                isActive
                  ? "bg-primary/10 font-medium text-primary"
                  : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full gradient-primary" />
              )}
              <Icon className="h-4 w-4 shrink-0" />
              {!collapsed && label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
