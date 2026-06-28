"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTABanner() {
  return (
    <section className="border-b">
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl bg-gradient-to-br from-primary/90 via-primary to-primary/80 px-8 py-16 text-center text-primary-foreground md:px-16"
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsla(0,0%,100%,.05)_1px,transparent_1px),linear-gradient(to_bottom,hsla(0,0%,100%,.05)_1px,transparent_1px)] bg-[size:3rem_3rem]" />

          <div className="relative">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                <Shield className="h-8 w-8" />
              </div>
            </div>

            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Ready to scan anything?
            </h2>
            <p className="mx-auto mb-8 max-w-lg text-primary-foreground/80">
              Join thousands of users who verify before they trust. Start
              scanning emails, URLs, images, and documents in seconds.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  variant="secondary"
                  className="group gap-2 bg-white text-primary hover:bg-white/90"
                >
                  Get started free
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/scan/email">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-primary-foreground bg-blue/20 hover:bg-white/10 hover:text-primary-foreground"
                >
                  Try a scan
                </Button>
              </Link>
            </div>

            <p className="mt-6 text-xs text-primary-foreground/60">
              No credit card required. Free plan includes daily scans and 5
              document analyses per month.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
