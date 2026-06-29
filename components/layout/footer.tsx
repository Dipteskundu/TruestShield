import Link from "next/link";
import { Shield, Github, Twitter, Linkedin, Mail } from "lucide-react";

const footerSections = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/scan/email", label: "Email Scan" },
      { href: "/scan/url", label: "URL Scanner" },
      { href: "/scan/image", label: "Image Detection" },
      { href: "/documents/upload", label: "Document Analysis" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/contact", label: "Contact" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
    ],
  },
];

const socialLinks = [
  { href: "#", icon: Github, label: "GitHub" },
  { href: "#", icon: Twitter, label: "Twitter" },
  { href: "#", icon: Linkedin, label: "LinkedIn" },
  { href: "#", icon: Mail, label: "Email" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-border/50 bg-gradient-to-b from-transparent via-muted/30 to-muted/60">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative">
                <div className="absolute inset-0 gradient-primary rounded-lg opacity-20 blur-sm group-hover:opacity-40 transition-opacity" />
                <div className="relative flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                  <Shield className="h-4 w-4 text-white" />
                </div>
              </div>
              <span className="text-lg font-bold tracking-tight">
                Trust<span className="text-gradient">Shield</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              AI-powered platform that detects spam, scams, phishing links,
              AI-generated images, and simplifies legal documents into plain
              English.
            </p>
            <div className="flex gap-2">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <Link
                  key={label}
                  href={href}
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-primary/5 hover:text-primary transition-all duration-200"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              <h4 className="text-sm font-semibold text-foreground">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border/50 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} TrustShield. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground/70 max-w-lg text-center md:text-right">
              Not legal advice. The document analysis module is a legal literacy
              tool, not a substitute for a licensed attorney.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
