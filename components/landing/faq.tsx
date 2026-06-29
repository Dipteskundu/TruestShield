"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "What can I scan with TrustShield?",
    a: "You can scan emails, job postings, SMS/chat messages for spam and scams. You can also check URLs for safety, detect AI-generated images, and upload legal documents (PDFs or pasted text) for plain-English clause-by-clause analysis.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Uploaded documents are encrypted at rest. We never use your content to train AI models. Scan results expire after 7 days, and you can delete your data at any time. See our Privacy Policy for full details.",
  },
  {
    q: "How accurate is the AI?",
    a: "TrustShield uses Claude AI by Anthropic, one of the most advanced language models available. For fraud detection, it evaluates multiple scam signals before reaching a verdict. For document analysis, it explains only what's in the document — not general legal knowledge.",
  },
  {
    q: "Do I need an account to use TrustShield?",
    a: "No. You can run up to 3 text scans, 5 URL scans, or 2 image scans per day as a guest. Document analysis requires a free account due to processing costs. Signing up takes 30 seconds and increases your limits significantly.",
  },
  {
    q: "Is TrustShield really free?",
    a: "Yes, the Free plan is completely free — no credit card required. You get daily scan limits across all modules and 5 document analyses per month. The Pro plan ($12/mo) removes most limits and adds PDF export reports.",
  },
  {
    q: "Is this legal advice?",
    a: "No. TrustShield is a legal literacy tool. It explains what a document says in plain English so you can understand it better. For decisions with significant financial or legal consequences, you should consult a qualified attorney.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            <HelpCircle className="h-3 w-3" />
            FAQ
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
            Frequently asked questions
          </h2>
          <p className="text-muted-foreground">
            Everything you need to know about TrustShield.
          </p>
        </motion.div>

        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="glass rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between p-5 text-left"
                >
                  <span className="font-medium pr-4">{faq.q}</span>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 shrink-0 text-muted-foreground transition-transform",
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
                      <div className="border-t border-border/50 px-5 py-4">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {faq.a}
                        </p>
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
