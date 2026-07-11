"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const avatarColors = [
  "from-emerald-400 to-teal-500",
  "from-amber-400 to-orange-500",
  "from-blue-400 to-indigo-500",
  "from-rose-400 to-pink-500",
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?fm=jpg&q=60&w=3000&auto=format&fit=crop')",
        }}
      />

      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/30" />

      {/* Subtle bottom gradient for smooth transition */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

      <div className="container relative mx-auto px-4 py-24 sm:py-32 lg:py-36 z-10">
        <div className="max-w-3xl">
          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-sm sm:text-base font-semibold text-emerald-400 mb-4 tracking-wide"
          >
            Making the internet a safer place!
          </motion.p>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] text-white"
          >
            <span className="block">Scan Anything</span>
            <span className="block">
              <span className="italic font-serif text-emerald-400">Before</span>{" "}
              You Trust
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="mt-6 text-base sm:text-lg text-white/70 max-w-xl leading-relaxed"
          >
            Detect spam, scams, phishing, and deepfakes — or simplify legal
            documents — in one seamless scan.
          </motion.p>

          {/* CTA + Avatar group */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="mt-8 flex flex-col sm:flex-row items-center gap-5"
          >
            <Link href="/auth/signup">
              <Button
                size="lg"
                className="group rounded-full px-8 py-6 text-base font-semibold gradient-primary text-white shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:scale-[1.02] transition-all duration-300"
              >
                Try TrustShield Free
                <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>

            {/* Avatar group */}
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2.5">
                {avatarColors.map((color, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
                    className={`h-9 w-9 rounded-full bg-gradient-to-br ${color} border-2 border-black/30 flex items-center justify-center shadow-sm`}
                  >
                    <span className="text-[10px] font-bold text-white">
                      {String.fromCharCode(65 + i)}
                    </span>
                  </motion.div>
                ))}
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 1 }}
              >
                <span className="text-sm font-bold text-white">5K+</span>
                <span className="text-xs text-white/60 block -mt-0.5">
                  Happy users
                </span>
              </motion.div>
            </div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-10 flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-white/60"
          >
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              No credit card required
            </div>
            <div className="hidden sm:block h-4 w-px bg-white/20" />
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Free tier available
            </div>
            <div className="hidden sm:block h-4 w-px bg-white/20" />
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
