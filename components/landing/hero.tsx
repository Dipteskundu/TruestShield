"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight, Eye, Zap, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

function FloatingCard({
  children,
  className,
  delay = 0,
  duration = 6,
  rotateX = 0,
  rotateZ = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  rotateX?: number;
  rotateZ?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={`absolute pointer-events-none ${className || ""}`}
    >
      <motion.div
        animate={{
          y: [-4, 4, -4],
          rotateX: [rotateX - 2, rotateX + 2, rotateX - 2],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
        }}
        style={{
          transformStyle: "preserve-3d",
          perspective: "800px",
        }}
      >
        <div style={{ transform: `rotateZ(${rotateZ}deg) rotateX(${rotateX}deg)` }}>
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background min-h-screen flex items-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(5,150,105,0.06),transparent_60%)]" />

      {/* 1. Trust badge card */}
      <FloatingCard className="left-[20%] top-[14%] hidden lg:block" delay={0.3} rotateX={8} rotateZ={-0}>
        <div className="relative w-56 rounded-2xl bg-white dark:bg-gray-900 p-4 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] dark:border dark:border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Trust Score</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Last scanned 2m ago</p>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <div className="h-2 flex-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50">
              <div className="h-full w-[92%] rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" />
            </div>
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">92%</span>
          </div>
        </div>
      </FloatingCard>

      {/* 2. Phone mockup */}
      <FloatingCard className="left-[3%] top-[42%] hidden xl:block" delay={0.5} rotateX={4} rotateZ={8}>
        <div className="relative w-40 rounded-[1.5rem] bg-gray-900 p-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.35)]">
          <div className="rounded-[1.25rem] bg-white dark:bg-gray-800 p-3 space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-1.5 w-8 rounded-full bg-gray-200 dark:bg-gray-600" />
              <div className="flex gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-gray-200 dark:bg-gray-600" />
                <div className="h-1.5 w-1.5 rounded-full bg-gray-200 dark:bg-gray-600" />
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 p-2">
              <div className="h-7 w-7 rounded-md bg-emerald-500 flex items-center justify-center">
                <ShieldCheck className="h-3.5 w-3.5 text-white" />
              </div>
              <div className="flex-1">
                <div className="h-1.5 w-14 rounded-full bg-emerald-300 dark:bg-emerald-600" />
                <div className="mt-1 h-1 w-10 rounded-full bg-emerald-200 dark:bg-emerald-700" />
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="h-1 w-full rounded-full bg-gray-100 dark:bg-gray-700" />
              <div className="h-1 w-3/4 rounded-full bg-gray-100 dark:bg-gray-700" />
              <div className="h-1 w-1/2 rounded-full bg-gray-100 dark:bg-gray-700" />
            </div>
          </div>
        </div>
      </FloatingCard>

      {/* 3. Glassmorphism shield */}
      <FloatingCard className="right-[10%] top-[12%] hidden lg:block" delay={0.4} rotateX={-6} rotateZ={-10}>
        <div className="relative h-20 w-20 rounded-[1.25rem] bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.5)] border border-white/60 dark:border-white/10 flex items-center justify-center">
          <Eye className="h-8 w-8 text-emerald-500" />
          <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/40">
            <ShieldCheck className="h-3 w-3 text-white" />
          </div>
        </div>
      </FloatingCard>

      {/* 4. Feature card */}
      <FloatingCard className="right-[4%] top-[38%] hidden lg:block" delay={0.6} rotateX={6} rotateZ={5}>
        <div className="relative w-48 rounded-2xl bg-white dark:bg-gray-900 p-4 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.04)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] dark:border dark:border-white/10">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-9 w-9 rounded-lg bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center">
              <Zap className="h-4 w-4 text-amber-500" />
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Instant Scan</span>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">Results in under 2 seconds with AI-powered analysis.</p>
        </div>
      </FloatingCard>

      {/* 5. Lock badge */}
      <FloatingCard className="right-[12%] bottom-[22%] hidden lg:block" delay={0.7} rotateX={-4} rotateZ={8}>
        <div className="relative h-14 w-14 rounded-2xl bg-white dark:bg-gray-900 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.04)] dark:shadow-[0_16px_48px_-12px_rgba(0,0,0,0.4)] dark:border dark:border-white/10 flex items-center justify-center">
          <Lock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
        </div>
      </FloatingCard>

      {/* Main content */}
      <div className="container relative mx-auto px-4 py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="font-black tracking-tight leading-[1.1]"
          >
            <span className="block text-[2.75rem] sm:text-5xl md:text-6xl lg:text-[5.5rem] text-foreground">
              Scan
            </span>
            <span className="block text-[1.75rem] sm:text-3xl md:text-4xl lg:text-5xl text-foreground ml-6 sm:ml-10 md:ml-16 mt-0.5">
              anything
            </span>
            <span className="block text-[2.25rem] sm:text-5xl md:text-6xl lg:text-[5.5rem] text-gradient mt-1">
              before you trust it
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="mx-auto mt-6 max-w-xl text-lg text-muted-foreground md:text-xl leading-relaxed"
          >
            Detect spam, scams, phishing, and deepfakes — or simplify legal
            documents — in one seamless scan.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href="/auth/signup">
              <Button size="lg" variant="hero" className="group rounded-full px-8 py-6 text-base font-semibold">
                <span className="relative z-10 flex items-center gap-2">
                  Get started free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="ghost" className="group px-6 py-6 text-base font-semibold">
                Try a scan
                <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-12 flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              No credit card required
            </div>
            <div className="hidden sm:block h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Free tier available
            </div>
            <div className="hidden sm:block h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              SOC 2 compliant
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
