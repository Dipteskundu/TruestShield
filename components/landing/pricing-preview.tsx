"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowRight, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PricingPreview() {
  return (
    <section className="border-b py-20 bg-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="text-muted-foreground">
            Start free. Upgrade when you need more.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="glass rounded-2xl p-8 h-full flex flex-col">
              <h3 className="text-lg font-semibold">Free</h3>
              <p className="text-sm text-muted-foreground">For occasional trust checks</p>
              <div className="my-6">
                <span className="text-4xl font-bold">$0</span>
              </div>
              <ul className="mb-8 flex-1 space-y-3 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                  3 text scans / day
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                  5 URL scans / day
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                  2 image scans / day
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-emerald-500" />
                  5 document analyses / month
                </li>
              </ul>
              <Link href="/auth/signup">
                <Button className="w-full">Get started free</Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            <div className="gradient-primary rounded-2xl p-8 h-full flex flex-col relative overflow-hidden shadow-glow">
              <div className="absolute top-0 right-0 bg-white/20 px-3 py-1 text-xs font-bold rounded-bl-xl flex items-center gap-1">
                <Crown className="h-3 w-3" />
                Popular
              </div>
              <h3 className="text-lg font-semibold text-white">Pro</h3>
              <p className="text-sm text-white/70">For power users and professionals</p>
              <div className="my-6">
                <span className="text-4xl font-bold text-white">$12</span>
                <span className="text-white/70 text-sm">/mo</span>
              </div>
              <ul className="mb-8 flex-1 space-y-3 text-sm text-white/80">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-white" />
                  50 text scans / day
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-white" />
                  30 URL scans / day
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-white" />
                  20 image scans / day
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-white" />
                  Unlimited document analysis
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 shrink-0 text-white" />
                  PDF export reports
                </li>
              </ul>
              <Button variant="secondary" className="w-full bg-white/20 text-white hover:bg-white/30">
                Coming soon
              </Button>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-8 text-center"
        >
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
          >
            Compare plans in detail
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
