"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Shield, AlertTriangle, FileText, Users } from "lucide-react";

const stats = [
  { icon: Shield, value: 10000, suffix: "+", label: "Scans Run" },
  { icon: AlertTriangle, value: 2000, suffix: "+", label: "Fraud Caught" },
  { icon: FileText, value: 500, suffix: "+", label: "Documents Analyzed" },
  { icon: Users, value: 5000, suffix: "+", label: "Active Users" },
];

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    const duration = 2000;
    const startTime = performance.now();

    function easeOutExpo(t: number): number {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    }

    function update(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);
      setCount(Math.floor(easedProgress * target));
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        setCount(target);
      }
    }

    requestAnimationFrame(update);
  }, [isInView, target]);

  return (
    <span ref={ref} className="font-mono tabular-nums">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

export function StatsBar() {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/50 to-muted/30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(5,150,105,0.04),transparent_70%)]" />
      <div className="relative container mx-auto px-4 py-16">
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="glass group flex flex-col items-center gap-3 rounded-2xl py-6 text-center hover:shadow-glass-sm transition-all duration-300"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <p className="text-2xl font-bold sm:text-3xl">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
