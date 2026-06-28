"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "I almost fell for a phishing email that looked exactly like my bank. TrustShield caught the spoofed domain in seconds. Now I scan everything before clicking.",
    name: "Alex M.",
    role: "Freelance Designer",
  },
  {
    quote:
      "The legal document analysis saved me from signing a freelance contract with a buried non-compete clause. The plain-English breakdown made it obvious.",
    name: "Sarah K.",
    role: "Software Developer",
  },
  {
    quote:
      "I run every job posting through TrustShield before applying. It's caught at least three fake listings with unrealistic salary promises.",
    name: "James R.",
    role: "Marketing Manager",
  },
];

export function Testimonials() {
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
            Trusted by users like you
          </h2>
          <p className="text-muted-foreground">
            Real stories from people who use TrustShield every day.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
          {testimonials.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="relative rounded-lg border bg-card p-6"
            >
              <Quote className="mb-3 h-6 w-6 text-primary/40" />
              <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div>
                <p className="text-sm font-semibold">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
