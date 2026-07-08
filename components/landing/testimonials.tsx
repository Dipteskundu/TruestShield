"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "I almost fell for a phishing email that looked exactly like my bank. TrustShield caught the spoofed domain in seconds. Now I scan everything before clicking.",
    name: "Alex Morgan",
    role: "Freelance Designer",
    company: "Designly Studio",
    initials: "AM",
    color: "from-emerald-500 to-teal-500",
  },
  {
    quote:
      "The legal document analysis saved me from signing a freelance contract with a buried non-compete clause. The plain-English breakdown made it obvious.",
    name: "Sarah Kim",
    role: "Software Developer",
    company: "CodeCraft Inc.",
    initials: "SK",
    color: "from-violet-500 to-purple-500",
  },
  {
    quote:
      "I run every job posting through TrustShield before applying. It's caught at least three fake listings with unrealistic salary promises.",
    name: "James Rivera",
    role: "Marketing Manager",
    company: "BrightPath Media",
    initials: "JR",
    color: "from-amber-500 to-orange-500",
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
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Star className="h-3 w-3 fill-primary text-primary" />
            Testimonials
          </div>
          <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl">
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
              className="glass group relative rounded-2xl p-6 transition-all duration-300 hover:shadow-glass-sm hover:border-primary/10"
            >
              <div className="mb-4 flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <Quote className="mb-3 h-6 w-6 text-primary/30" />
              <p className="mb-5 text-sm text-muted-foreground leading-relaxed">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="border-t border-border/50 pt-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br ${item.color} text-xs font-bold text-white shadow-md`}>
                    {item.initials}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.role} at {item.company}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
