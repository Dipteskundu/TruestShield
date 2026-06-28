"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, Link2, Image, FileText, ArrowRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const modules = [
  {
    href: "/scan/email",
    icon: Mail,
    title: "Spam & Scam Detection",
    description: "Analyze emails, job posts, and messages for fraud patterns, phishing, and impersonation.",
    gradient: "from-blue-500/20 to-cyan-500/20",
  },
  {
    href: "/scan/url",
    icon: Link2,
    title: "URL Scanner",
    description: "Check links for typosquatting, redirect chains, blacklisted domains, and missing HTTPS.",
    gradient: "from-purple-500/20 to-pink-500/20",
  },
  {
    href: "/scan/image",
    icon: Image,
    title: "AI Image Detection",
    description: "Detect AI-generated and deepfake images using advanced detection APIs.",
    gradient: "from-orange-500/20 to-yellow-500/20",
  },
  {
    href: "/documents/upload",
    icon: FileText,
    title: "Legal Document Analysis",
    description: "Upload contracts and get clause-by-clause plain-English explanations with risk scores.",
    gradient: "from-green-500/20 to-emerald-500/20",
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
          <h2 className="mb-4 text-3xl font-bold md:text-4xl">
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
                  <Card className="group h-full cursor-pointer border-2 transition-all hover:shadow-lg hover:-translate-y-1">
                    <CardHeader>
                      <div
                        className={`mb-3 inline-flex rounded-lg bg-gradient-to-br ${mod.gradient} p-3`}
                      >
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">{mod.title}</CardTitle>
                      <CardDescription>{mod.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <span className="flex items-center gap-1 text-sm font-medium text-primary">
                        Open module
                        <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
