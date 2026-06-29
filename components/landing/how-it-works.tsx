"use client";

import { motion } from "framer-motion";
import { Upload, Sparkles, FileCheck } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Submit Content",
    description:
      "Paste a suspicious email, job posting, or message. Drop a link, upload an image, or drag in a PDF contract.",
  },
  {
    icon: Sparkles,
    title: "AI Analyzes",
    description:
      "Claude AI scans the content for scam patterns, phishing signals, deepfake artifacts, or risky legal clauses.",
  },
  {
    icon: FileCheck,
    title: "Get Plain Results",
    description:
      "Receive a clear verdict, confidence score, and plain-English reasons. No technical jargon — just answers.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-b py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            How it works
          </h2>
          <p className="text-muted-foreground">
            Three simple steps to know if something is safe to trust.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative flex flex-col items-center text-center"
              >
                {index < steps.length - 1 && (
                  <div className="absolute right-0 top-8 hidden h-px w-full -translate-y-1/2 border-t border-dashed border-muted-foreground/30 md:block md:translate-x-1/2" />
                )}
                <div className="relative mb-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-glow-sm">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-background border-2 border-primary text-xs font-bold text-primary">
                    {index + 1}
                  </span>
                </div>
                <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
