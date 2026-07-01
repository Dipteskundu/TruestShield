"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  FileText,
  History,
  LayoutDashboard,
  ScanSearch,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/usage", label: "Usage", icon: Activity },
  { href: "/dashboard/history", label: "History", icon: History },
  { href: "/scan/email", label: "Scan", icon: ScanSearch },
  { href: "/documents/upload", label: "Documents", icon: FileText },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-64 z-40 glass-strong border-r-0 hidden md:flex md:flex-col overflow-y-auto no-scrollbar">
      <nav className="flex flex-col gap-1 p-3">
        {links.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-base transition-all duration-200",
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
    </aside>
  );
}
