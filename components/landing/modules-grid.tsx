"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Link2, Image, FileText, ArrowRight } from "lucide-react";

const modules = [
  {
    href: "/scan/email",
    icon: Mail,
    title: "Spam & Scam Detection",
    description: "Analyze emails, job posts, and messages for fraud patterns, phishing, and impersonation.",
    gradient: "gradient-primary",
  },
  {
    href: "/scan/url",
    icon: Link2,
    title: "URL Scanner",
    description: "Check links for typosquatting, redirect chains, blacklisted domains, and missing HTTPS.",
    gradient: "gradient-accent",
  },
  {
    href: "/scan/image",
    icon: Image,
    title: "AI Image Detection",
    description: "Detect AI-generated and deepfake images using advanced detection APIs.",
    gradient: "bg-gradient-to-br from-amber-500 to-orange-500",
  },
  {
    href: "/documents/upload",
    icon: FileText,
    title: "Legal Document Analysis",
    description: "Upload contracts and get clause-by-clause plain-English explanations with risk scores.",
    gradient: "bg-gradient-to-br from-teal-500 to-emerald-500",
  },
];

export function ModulesGrid() {
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
            Everything you need to stay safe
          </h2>
          <p className="text-muted-foreground">
            Four powerful modules. One unified platform.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-4">
          {modules.map((mod, index) => {
            const Icon = mod.icon;
            return (
              <motion.div
                key={mod.href}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link href={mod.href}>
                  <div className="glass group h-full cursor-pointer rounded-2xl p-6 transition-all duration-300 hover:shadow-glass-sm hover:border-primary/20 hover:-translate-y-1">
                    <div className={`mb-4 inline-flex rounded-xl ${mod.gradient} p-3 shadow-glow-sm`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="mb-2 text-lg font-semibold">{mod.title}</h3>
                    <p className="mb-4 text-sm text-muted-foreground">{mod.description}</p>
                    <span className="flex items-center gap-1 text-sm font-medium text-primary">
                      Open module
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
