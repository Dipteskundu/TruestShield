"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Shield, Menu, Bell } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ProfileDropdown } from "./profile-dropdown";

interface TopBarProps {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { data: session } = useSession();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-strong border-b">
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-primary/5 transition-colors md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl gradient-primary shadow-md shadow-primary/20 group-hover:shadow-lg group-hover:shadow-primary/30 transition-all duration-300 group-hover:scale-105">
              <Shield className="h-4 w-4 text-white animate-glow-pulse" />
            </div>
            <span className="text-sm font-bold tracking-tight">
              Trust<span className="text-gradient">Shield</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-primary/5 transition-colors relative group">
            <Bell className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary animate-pulse" />
          </button>
          <ThemeToggle />
          {session && <ProfileDropdown />}
        </div>
      </div>
    </header>
  );
}
