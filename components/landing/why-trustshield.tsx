"use client";

import { motion } from "framer-motion";
import { Sparkles, Languages, LayoutDashboard, Smartphone } from "lucide-react";

const benefits = [
  {
    icon: Sparkles,
    title: "AI-Powered Accuracy",
    description:
      "Powered by Claude AI to detect sophisticated scam patterns, phishing attempts, and deepfake artifacts that rule-based systems miss.",
  },
  {
    icon: Languages,
    title: "Plain-Language Results",
    description:
      "No technical or legal knowledge required. Every result comes back in simple English with a risk score and specific reasons.",
  },
  {
    icon: LayoutDashboard,
    title: "All-in-One Platform",
    description:
      "One account, one dashboard, one history page. Scan text, check URLs, verify images, and analyze documents without switching tools.",
  },
  {
    icon: Smartphone,
    title: "Zero Setup Required",
    description:
      "No downloads, no installations, no API keys. Try a scan as a guest in seconds — sign up only when you need more.",
  },
];

export function WhyTrustShield() {
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
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
            Why TrustShield?
          </h2>
          <p className="text-muted-foreground">
            Built for everyone — from freelancers checking a client email to
            anyone about to sign a contract.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex gap-4 rounded-lg border bg-card p-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="mb-1 font-semibold">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
