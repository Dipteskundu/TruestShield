"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Shield,
  LayoutDashboard,
  LogOut,
  Home,
  Sparkles,
  ArrowRight,
  Settings,
  Tag,
  Info,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { cn } from "@/lib/utils";
import { ProfileDropdown } from "./profile-dropdown";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/features", label: "Features", icon: Sparkles },
  { href: "/pricing", label: "Pricing", icon: Tag },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact", icon: MessageSquare },
];

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
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
  }, [mobileOpen]);

  const handleClose = () => {
    setMobileOpen(false);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "glass-strong border-border/50 shadow-glass"
          : "bg-transparent border-transparent"
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="absolute inset-0 gradient-primary rounded-lg opacity-20 blur-sm group-hover:opacity-40 transition-opacity" />
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
              <Shield className="h-[18px] w-[18px] text-white" />
            </div>
          </div>
          <span className="text-lg font-bold tracking-tight">
            Trust<span className="text-gradient">Shield</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3 py-2 text-sm rounded-full transition-all duration-200",
                  isActive
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-primary/5"
                )}
              >
                {isActive && (
                  <span className="absolute inset-0 glass rounded-full shadow-glow-sm" />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
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

        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex h-11 w-11 items-center justify-center rounded-xl hover:bg-primary/5 transition-all duration-200 active:scale-95 z-50 relative"
          onClick={() => {
            if (mobileOpen) {
              handleClose();
            } else {
              setMobileOpen(true);
            }
          }}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <div className="relative h-5 w-5">
            <span
              className={cn(
                "absolute inset-0 h-0.5 w-5 bg-foreground rounded-full transition-all duration-300",
                mobileOpen ? "rotate-45 translate-y-2 bg-foreground" : "translate-y-0"
              )}
            />
            <span
              className={cn(
                "absolute inset-0 h-0.5 w-5 bg-foreground rounded-full transition-all duration-300 top-2",
                mobileOpen ? "opacity-0 scale-x-0" : "opacity-100 scale-x-100"
              )}
            />
            <span
              className={cn(
                "absolute inset-0 h-0.5 w-5 bg-foreground rounded-full transition-all duration-300 top-4",
                mobileOpen ? "-rotate-45 -translate-y-2 bg-foreground" : "translate-y-0"
              )}
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {shouldRender && (
        <div className="md:hidden fixed inset-0 z-40 flex justify-end">
          {/* Backdrop */}
          <div
            className={cn(
              "fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-md transition-opacity duration-300",
              isAnimating ? "opacity-100" : "opacity-0"
            )}
            onClick={handleClose}
          />

          {/* Menu Panel */}
          <div
            className={cn(
              "relative z-10 w-full max-w-sm h-full mobile-menu-panel shadow-2xl flex flex-col transition-transform duration-300 ease-out-quint overflow-hidden",
              isAnimating ? "translate-x-0" : "translate-x-full"
            )}
          >
            {/* Glowing background decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[40%] rounded-full bg-primary/10 dark:bg-primary/5 blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[40%] rounded-full bg-accent/10 dark:bg-accent/5 blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border/30 z-10">
              <Link href="/" className="flex items-center gap-2.5 group" onClick={handleClose}>
                <div className="relative">
                  <div className="absolute inset-0 gradient-primary rounded-lg opacity-20 blur-sm group-hover:opacity-40 transition-opacity" />
                  <div className="relative flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                    <Shield className="h-[18px] w-[18px] text-white" />
                  </div>
                </div>
                <span className="text-base font-bold tracking-tight">
                  Trust<span className="text-gradient">Shield</span>
                </span>
              </Link>
              
            </div>

            {/* Navigation links */}
            <div className="flex-1 overflow-y-auto px-4 py-6 no-scrollbar space-y-8 z-10">
              {/* Section: Menu */}
              <div>
                <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60 mb-3">
                  Navigation
                </p>
                <nav className="space-y-1">
                  {navLinks.map((link, index) => {
                    const isActive =
                      link.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(link.href);
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                          "flex items-center gap-4 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 group relative",
                          isActive
                            ? "bg-primary/10 text-primary shadow-glow-sm border border-primary/20"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/30 border border-transparent",
                          "opacity-0 animate-stagger-fade-in"
                        )}
                        style={{ animationDelay: `${index * 50 + 50}ms` }}
                        onClick={handleClose}
                      >
                        {Icon && (
                          <div
                            className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-200",
                              isActive
                                ? "bg-primary/20 text-primary"
                                : "bg-muted/30 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
                            )}
                          >
                            <Icon className="h-4 w-4" />
                          </div>
                        )}
                        <span className="flex-1">{link.label}</span>
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
                </nav>
              </div>

              {/* Section: Preferences */}
              <div>
                <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60 mb-3">
                  Preferences
                </p>
                <div
                  className={cn(
                    "flex items-center justify-between rounded-xl border border-border/40 bg-muted/20 dark:bg-muted/10 p-4 opacity-0 animate-stagger-fade-in"
                  )}
                  style={{ animationDelay: "300ms" }}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">Theme Mode</span>
                    <span className="text-xs text-muted-foreground">Switch between light & dark</span>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-background border border-border/30 shadow-sm flex items-center justify-center">
                    <ThemeToggle />
                  </div>
                </div>
              </div>

              {/* Section: User Account */}
              <div>
                <p className="px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground/60 mb-3">
                  {session ? "User Profile" : "Access"}
                </p>
                
                {session ? (
                  <div className="space-y-4">
                    {/* User Card */}
                    <div
                      className={cn(
                        "rounded-xl border border-primary/15 bg-gradient-to-br from-primary/5 to-transparent p-4 flex items-center gap-3.5 opacity-0 animate-stagger-fade-in"
                      )}
                      style={{ animationDelay: "350ms" }}
                    >
                      <div className="relative">
                        <div className="absolute inset-0 avatar-glow rounded-full opacity-30" />
                        <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 text-sm font-bold text-primary ring-2 ring-primary/20">
                          {(session.user?.name || session.user?.email || "U")
                            .split(" ")
                            .map((w: string) => w[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase()}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate text-foreground">
                          {session.user?.name || "User"}
                        </p>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                            {session.user?.email}
                          </p>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-primary/10 text-primary border border-primary/20">
                            Free
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Access Menu */}
                    <div
                      className={cn(
                        "grid grid-cols-2 gap-2.5 opacity-0 animate-stagger-fade-in"
                      )}
                      style={{ animationDelay: "400ms" }}
                    >
                      <Link
                        href="/dashboard"
                        onClick={handleClose}
                        className="flex items-center justify-center gap-2 h-11 rounded-xl bg-muted/40 hover:bg-muted/70 dark:bg-muted/10 dark:hover:bg-muted/20 border border-border/30 text-sm font-medium transition-all duration-200 active:scale-95"
                      >
                        <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                        Dashboard
                      </Link>
                      <Link
                        href="/dashboard/settings"
                        onClick={handleClose}
                        className="flex items-center justify-center gap-2 h-11 rounded-xl bg-muted/40 hover:bg-muted/70 dark:bg-muted/10 dark:hover:bg-muted/20 border border-border/30 text-sm font-medium transition-all duration-200 active:scale-95"
                      >
                        <Settings className="h-4 w-4 text-muted-foreground" />
                        Settings
                      </Link>
                    </div>

                    {/* Sign Out */}
                    <button
                      className={cn(
                        "flex w-full items-center justify-center gap-2 h-11 rounded-xl text-sm font-medium border border-destructive/20 text-destructive bg-destructive/5 hover:bg-destructive/10 transition-all duration-200 active:scale-95 opacity-0 animate-stagger-fade-in"
                      )}
                      style={{ animationDelay: "450ms" }}
                      onClick={() => {
                        handleClose();
                        signOut();
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* CTA Buttons */}
                    <div
                      className={cn(
                        "space-y-2.5 opacity-0 animate-stagger-fade-in"
                      )}
                      style={{ animationDelay: "350ms" }}
                    >
                      <Link
                        href="/auth/login"
                        onClick={handleClose}
                        className="flex items-center justify-center h-11 rounded-xl border border-primary/20 text-sm font-semibold hover:bg-primary/5 hover:border-primary/30 transition-all duration-200 active:scale-95"
                      >
                        Log in
                      </Link>
                      <Link href="/auth/signup" onClick={handleClose}>
                        <Button size="lg" className="w-full h-11 text-sm font-semibold shadow-lg shadow-primary/20">
                          Get started free
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>

                    {/* Trust Info */}
                    <p
                      className={cn(
                        "text-center text-[10px] text-muted-foreground/50 opacity-0 animate-fade-in-up"
                      )}
                      style={{ animationDelay: "450ms" }}
                    >
                      No credit card required • Free forever
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Version / branding footer */}
            <div className="p-6 border-t border-border/20 bg-muted/10 text-center z-10">
              <span className="text-[10px] font-medium text-muted-foreground/45 uppercase tracking-widest">
                TrustShield API v1.0.0
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
