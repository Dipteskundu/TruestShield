"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Shield, Menu, X, LayoutDashboard, LogOut, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ProfileDropdown } from "./profile-dropdown";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/features", label: "Features", icon: null },
  { href: "/pricing", label: "Pricing", icon: null },
  { href: "/about", label: "About", icon: null },
  { href: "/contact", label: "Contact", icon: null },
];

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full glass-strong border-b-0">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="absolute inset-0 gradient-primary rounded-lg opacity-20 blur-sm group-hover:opacity-40 transition-opacity" />
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <Shield className="h-4.5 w-4.5 text-white" />
            </div>
          </div>
          <span className="text-lg font-bold tracking-tight">
            Trust<span className="text-gradient">Shield</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-2 text-sm rounded-full transition-all duration-200",
                  isActive
                    ? "glass text-foreground font-medium shadow-glow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {session ? (
            <ProfileDropdown />
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">
                  Get started free
                </Button>
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden flex h-10 w-10 items-center justify-center rounded-xl hover:bg-primary/5 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="glass-strong border-t md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => {
              const isActive = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm transition-all",
                    isActive
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                  )}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.icon && <link.icon className="h-4 w-4" />}
                  {link.label}
                </Link>
              );
            })}
            <div className="my-2 h-px bg-border" />
            {session ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2.5 mb-1">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-primary text-xs font-bold text-white">
                    {(session.user?.name || session.user?.email || "U")
                      .split(" ")
                      .map((w: string) => w[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{session.user?.name || "User"}</p>
                    <p className="text-xs text-muted-foreground truncate">{session.user?.email}</p>
                  </div>
                </div>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm text-muted-foreground hover:bg-primary/5 hover:text-foreground transition-all"
                  onClick={() => setMobileOpen(false)}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/settings"
                  className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm text-muted-foreground hover:bg-primary/5 hover:text-foreground transition-all"
                  onClick={() => setMobileOpen(false)}
                >
                  Settings
                </Link>
                <div className="h-px bg-border/50 my-1" />
                <button
                  className="flex w-full items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm text-muted-foreground hover:bg-destructive/5 hover:text-destructive transition-all"
                  onClick={() => { signOut(); setMobileOpen(false); }}
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="rounded-xl px-4 py-2.5 text-sm text-muted-foreground hover:bg-primary/5 hover:text-foreground transition-all"
                  onClick={() => setMobileOpen(false)}
                >
                  Log in
                </Link>
                <Link href="/auth/signup" onClick={() => setMobileOpen(false)}>
                  <Button size="sm" className="w-full mt-2">
                    Get started free
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
