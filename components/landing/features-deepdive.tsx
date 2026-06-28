"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Link2, Image, FileText, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    id: "spam",
    icon: Mail,
    title: "Spam & Scam Text Detection",
    color: "from-blue-500 to-cyan-500",
    items: [
      "Detect phishing emails with spoofed sender domains",
      "Spot fake job postings with unrealistic salary promises",
      "Identify lottery scams and impersonation in SMS/chat",
      "Flag urgency tactics, grammar anomalies, and malicious links",
      "Guest: 3 scans/day · Registered: 50 scans/day",
    ],
  },
  {
    id: "url",
    icon: Link2,
    title: "URL / Link Scanner",
    color: "from-purple-500 to-pink-500",
    items: [
      "Unshorten and trace full redirect chains",
      "WHOIS lookup for domain registration age",
      "Google Safe Browsing blacklist check",
      "HTTPS/SSL certificate verification",
      "Typosquatting detection against known domains",
      "Guest: 5 scans/day · Registered: 30 scans/day",
    ],
  },
  {
    id: "image",
    icon: Image,
    title: "AI Image Detection",
    color: "from-orange-500 to-yellow-500",
    items: [
      "GAN fingerprint and diffusion artifact detection",
      "Facial blending analysis for deepfakes",
      "EXIF metadata inspection",
      "API-powered detection via Sightengine / Hive",
      "Guest: 2/day (5MB max) · Registered: 20/day (10MB max)",
    ],
  },
  {
    id: "legal",
    icon: FileText,
    title: "Legal Document Analysis",
    color: "from-green-500 to-emerald-500",
    items: [
      "Upload PDF or paste contract text directly",
      "Clause-by-clause plain-English breakdown",
      "Risk scoring (Low / Medium / High) per clause",
      "Missing protection detection",
      "Executive summary + glossary of legal terms",
      "Ask-the-document chat with clause citations",
      "Registered: 5 docs/month (free) · Unlimited (pro)",
    ],
  },
];

export function FeaturesDeepDive() {
  const [openId, setOpenId] = useState<string | null>(null);

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
            Features in detail
          </h2>
          <p className="text-muted-foreground">
            Click each module to see exactly what it detects and your usage
            limits.
          </p>
        </motion.div>

        <div className="mx-auto max-w-3xl space-y-3">
          {features.map((feat) => {
            const Icon = feat.icon;
            const isOpen = openId === feat.id;

            return (
              <motion.div
                key={feat.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3 }}
                className="rounded-lg border bg-card"
              >
                <button
                  onClick={() => setOpenId(isOpen ? null : feat.id)}
                  className="flex w-full items-center justify-between p-5 text-left"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br",
                        feat.color
                      )}
                    >
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-semibold">{feat.title}</span>
                  </div>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 text-muted-foreground transition-transform",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t px-5 py-4">
                        <ul className="space-y-2">
                          {feat.items.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
