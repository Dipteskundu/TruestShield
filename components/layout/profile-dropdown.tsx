"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User, Settings, LayoutDashboard, LogOut, ChevronDown, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import api from "@/lib/api";

export function ProfileDropdown() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (session?.user) {
      api.get("/api/user/profile").then(({ data }) => {
        setAvatar(data.data.avatar || null);
      }).catch(() => {});
    }
  }, [session?.user]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!session?.user) return null;

  const initials = (session.user.name || session.user.email || "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-xl px-2 py-1.5 transition-all hover:bg-primary/5"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-primary text-xs font-bold text-white overflow-hidden">
          {avatar ? (
            <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </div>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 glass rounded-2xl border border-border/50 p-1.5 shadow-glass animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-3 py-2.5 mb-1">
            <p className="text-sm font-medium truncate">{session.user.name || "User"}</p>
            <p className="text-xs text-muted-foreground truncate">{session.user.email}</p>
          </div>
          <div className="h-px bg-border/50 my-1" />
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-primary/5 hover:text-foreground transition-all"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/dashboard/profile"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-primary/5 hover:text-foreground transition-all"
          >
            <UserCircle className="h-4 w-4" />
            Profile Information
          </Link>
          <Link
            href="/dashboard/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-primary/5 hover:text-foreground transition-all"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          <div className="h-px bg-border/50 my-1" />
          <button
            onClick={() => { signOut(); setOpen(false); }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-muted-foreground hover:bg-destructive/5 hover:text-destructive transition-all"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
