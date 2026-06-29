"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b bg-gradient-to-b from-background to-muted/30">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--primary)/.03)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--primary)/.03)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/10 to-emerald-500/10 blur-3xl" />
      <div className="absolute right-1/4 top-1/4 w-[300px] h-[300px] rounded-full bg-teal-500/5 blur-3xl" />

      <div className="container relative mx-auto px-4 py-24 md:py-32">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm text-primary backdrop-blur-sm">
              <Shield className="h-4 w-4" />
              AI-Powered Trust & Safety Platform
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 text-4xl font-bold tracking-tight md:text-6xl lg:text-7xl"
          >
            Scan anything{" "}
            <span className="text-gradient">
              before you trust it
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground md:text-xl"
          >
            Detect spam, scams, phishing links, AI-generated images, and
            simplify legal documents into plain English — all in one place. No
            technical knowledge required.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link href="/auth/signup">
              <Button size="lg" className="group gap-2 px-8">
                Get started free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/scan/email">
              <Button size="lg" variant="outline" className="px-8">
                Try a scan
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
