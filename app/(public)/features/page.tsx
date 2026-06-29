import { Mail, Link2, Image, FileText, Shield, Check, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Features",
  description: "Explore all four TrustShield modules: spam detection, URL scanner, AI image detection, and legal document analysis.",
};

const modules = [
  {
    icon: Mail,
    title: "Spam & Scam Text Detection",
    description: "Analyze emails, job postings, and messages for fraud patterns.",
    gradient: "gradient-primary",
    features: [
      "Spoofed sender and domain detection",
      "Phishing link identification",
      "Urgency tactic and pressure language detection",
      "Fake job posting with unrealistic salary promises",
      "Lottery scam and impersonation patterns",
      "Grammatical anomaly detection",
    ],
    limits: "3 scans/day (guest) · 50 scans/day (registered)",
    href: "/scan/email",
  },
  {
    icon: Link2,
    title: "URL / Link Scanner",
    description: "Verify links are safe before you click.",
    gradient: "gradient-accent",
    features: [
      "Full redirect chain tracing and unshortening",
      "WHOIS domain age lookup",
      "Google Safe Browsing blacklist check",
      "HTTPS / SSL certificate validation",
      "Typosquatting detection against known domains",
    ],
    limits: "5 scans/day (guest) · 30 scans/day (registered)",
    href: "/scan/url",
  },
  {
    icon: Image,
    title: "AI Image Detection",
    description: "Detect AI-generated and deepfake images.",
    gradient: "bg-gradient-to-br from-amber-500 to-orange-500",
    features: [
      "GAN fingerprint analysis",
      "Diffusion artifact detection",
      "Facial blending analysis for deepfakes",
      "EXIF metadata inspection",
      "Powered by Sightengine / Hive detection API",
    ],
    limits: "2 scans/day (guest, 5MB) · 20 scans/day (registered, 10MB)",
    href: "/scan/image",
  },
  {
    icon: FileText,
    title: "Legal Document Analysis",
    description: "Understand contracts in plain English.",
    gradient: "bg-gradient-to-br from-teal-500 to-emerald-500",
    features: [
      "PDF upload or paste text directly",
      "Document type selection (lease, NDA, freelance, etc.)",
      "Clause-by-clause plain-English breakdown",
      "Risk scoring per clause (Low / Medium / High)",
      "Missing protection detection",
      "Executive summary of the entire document",
      "Auto-generated glossary of legal terms",
      "Ask-the-document chat with clause citations",
      "PDF export report (Pro)",
    ],
    limits: "5 docs/month (free) · Unlimited (Pro)",
    href: "/documents/upload",
  },
];

export default function FeaturesPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto mb-16 max-w-3xl text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight">All features</h1>
        <p className="text-lg text-muted-foreground">
          Four powerful modules. One unified platform. Every scan returns a
          clear verdict, confidence score, and plain-English reasons.
        </p>
      </div>

      <div className="mx-auto max-w-5xl space-y-12">
        {modules.map((mod, index) => {
          const Icon = mod.icon;
          return (
            <div
              key={mod.title}
              className={`grid gap-8 items-center md:grid-cols-2`}
            >
              <div className={index % 2 === 1 ? "md:order-2" : ""}>
                <div className="glass rounded-2xl p-6 transition-all hover:shadow-glass-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-white shadow-glow-sm" style={{background: "var(--gradient-primary)"}}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h2 className="mb-1 text-xl font-semibold">{mod.title}</h2>
                  <p className="mb-4 text-sm text-muted-foreground">{mod.description}</p>
                  <ul className="mb-4 space-y-2">
                    {mod.features.map((feat) => (
                      <li
                        key={feat}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-muted-foreground border-t border-border/50 pt-3 mb-4">
                    Usage: {mod.limits}
                  </p>
                  <Link href={mod.href}>
                    <Button variant="outline" className="gap-2">
                      Try it now
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div
                className={`hidden md:flex items-center justify-center ${
                  index % 2 === 1 ? "md:order-1" : ""
                }`}
              >
                <div className={`flex h-48 w-48 items-center justify-center rounded-full text-white/60 shadow-glow ${mod.gradient}`}>
                  <Icon className="h-20 w-20" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mx-auto mt-20 max-w-2xl glass rounded-2xl p-12 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-glow-sm">
          <Shield className="h-6 w-6 text-white" />
        </div>
        <h2 className="mb-4 text-2xl font-bold">
          Not sure where to start?
        </h2>
        <p className="mb-6 text-muted-foreground">
          Try a free email scan right now — no account required. See how
          TrustShield works in under 30 seconds.
        </p>
        <Link href="/scan/email">
          <Button size="lg">Try a free scan</Button>
        </Link>
      </div>
    </div>
  );
}
