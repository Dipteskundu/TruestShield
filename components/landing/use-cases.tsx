"use client";

import { motion } from "framer-motion";
import { Briefcase, Search, MessageCircle, FileSignature } from "lucide-react";

const cases = [
  {
    icon: Briefcase,
    title: "Freelancers",
    description:
      "Verify client emails and contracts before accepting work. Spot fake job offers that promise high pay but ask for upfront fees.",
  },
  {
    icon: Search,
    title: "Job Seekers",
    description:
      "Check job postings for red flags — unrealistic salaries, vague descriptions, and requests for banking details before an interview.",
  },
  {
    icon: MessageCircle,
    title: "Everyone with an Inbox",
    description:
      "Scan suspicious emails and SMS messages for phishing links, impersonation, and urgency tactics designed to trick you.",
  },
  {
    icon: FileSignature,
    title: "Contract Signers",
    description:
      "Upload leases, NDAs, and freelance contracts to get a plain-English breakdown. Know what you're agreeing to before you sign.",
  },
];

export function UseCases() {
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
            Who is it for?
          </h2>
          <p className="text-muted-foreground">
            TrustShield helps anyone who needs to verify something before
            trusting it.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-2">
          {cases.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="glass group rounded-2xl p-6 transition-all duration-300 hover:shadow-glass-sm hover:border-primary/20"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-glow-sm transition-transform group-hover:scale-110">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 font-semibold">{item.title}</h3>
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
