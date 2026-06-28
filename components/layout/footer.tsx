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

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Shield className="h-6 w-6 text-primary" />
              TrustShield
            </Link>
            <p className="text-sm text-muted-foreground">
              AI-powered platform that detects spam, scams, phishing links,
              AI-generated images, and simplifies legal documents into plain
              English — all in one place.
            </p>
            <div className="flex gap-3">
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {footerSections.map((section) => (
            <div key={section.title} className="space-y-3">
              <h4 className="text-sm font-semibold">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t pt-6">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} TrustShield. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground max-w-lg text-center md:text-right">
              Not legal advice. The document analysis module is a legal literacy
              tool, not a substitute for a licensed attorney.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
