"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Shield, Menu } from "lucide-react";
import { ProfileDropdown } from "./profile-dropdown";

interface TopBarProps {
  onMenuClick?: () => void;
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-40 glass-strong border-b">
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-primary/5 transition-colors md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/dashboard" className="flex items-center gap-2 md:hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg gradient-primary">
              <Shield className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-sm font-bold tracking-tight">
              Trust<span className="text-gradient">Shield</span>
            </span>
          </Link>
        </div>

        <div className="flex items-center">
          {session && <ProfileDropdown />}
        </div>
      </div>
    </header>
  );
}
