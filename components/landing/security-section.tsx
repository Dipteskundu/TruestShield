"use client";

import { motion } from "framer-motion";
import { Lock, EyeOff, Trash2, Scale, ShieldCheck, Server } from "lucide-react";

const securityItems = [
  {
    icon: Lock,
    title: "Encrypted at Rest",
    description: "Uploaded documents are encrypted using AES-256 encryption standards.",
  },
  {
    icon: EyeOff,
    title: "No AI Training",
    description: "Your content is never used to train AI models. Period.",
  },
  {
    icon: Trash2,
    title: "Auto-Delete Option",
    description: "Set documents to auto-delete after 30 days. You stay in control.",
  },
  {
    icon: Scale,
    title: "Not Legal Advice",
    description: "We explain what a document says — never what you should do.",
  },
  {
    icon: ShieldCheck,
    title: "JWT Authentication",
    description: "Secure token-based auth with bcrypt password hashing.",
  },
  {
    icon: Server,
    title: "Rate Limited",
    description: "API usage is rate-limited across all modules to prevent abuse.",
  },
];

export function SecuritySection() {
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
            Security & Privacy
          </h2>
          <p className="text-muted-foreground">
            We treat your data with the same seriousness as a financial platform.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {securityItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="flex flex-col items-center rounded-lg border bg-card p-6 text-center"
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-1 font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
