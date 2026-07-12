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
} from "lucide-react";
import { cn } from "@/lib/utils";

const navGroups = [
  {
    label: "Overview",
    links: [
      { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
      { href: "/dashboard/usage", label: "Usage", icon: Activity },
      { href: "/dashboard/activity", label: "Activity", icon: ClipboardList },
      { href: "/dashboard/history", label: "History", icon: History },
    ],
  },
  {
    label: "Tools",
    links: [
      { href: "/scan/email", label: "Scan", icon: ScanSearch },
      { href: "/scan/image", label: "Image Scan", icon: Image },
      { href: "/documents/upload", label: "Documents", icon: FileText },
    ],
  },
  {
    label: "Account",
    links: [
      { href: "/dashboard/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-64 z-40 glass-strong border-r-0 hidden md:flex md:flex-col overflow-y-auto no-scrollbar">
      <nav className="flex flex-col gap-6 p-4 pt-6">
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
                    <Icon className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      !isActive && "group-hover:scale-110"
                    )} />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
