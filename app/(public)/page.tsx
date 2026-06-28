import Link from "next/link";
import {
  FileText,
  Image,
  Link2,
  Mail,
  MessageSquare,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
    title: "Email Scan",
    description: "Detect phishing and spoofed sender patterns",
  },
  {
    href: "/scan/job",
    icon: Briefcase,
    title: "Job Post Scan",
    description: "Spot fake listings and upfront payment scams",
  },
  {
    href: "/scan/message",
    icon: MessageSquare,
    title: "Message Scan",
    description: "Check SMS and chat messages for scam patterns",
  },
  {
    href: "/scan/url",
    icon: Link2,
    title: "URL Scanner",
    description: "Verify links before you click",
  },
  {
    href: "/scan/image",
    icon: Image,
    title: "Image Detection",
    description: "Detect AI-generated or manipulated images",
  },
  {
    href: "/documents/upload",
    icon: FileText,
    title: "Document Analysis",
    description: "Understand contracts in plain English",
  },
];

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <section className="mx-auto mb-16 max-w-3xl text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
          Scan anything before you trust it
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          Detect fraud, scan links, verify images, and understand legal documents
          in plain English — all in one place.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/auth/signup">
            <Button size="lg">Get started free</Button>
          </Link>
          <Link href="/scan/email">
            <Button size="lg" variant="outline">
              Try a scan
            </Button>
          </Link>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {modules.map(({ href, icon: Icon, title, description }) => (
          <Link key={href} href={href}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader>
                <Icon className="mb-2 h-8 w-8 text-primary" />
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-sm text-primary">Open module →</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </section>
    </div>
  );
}
