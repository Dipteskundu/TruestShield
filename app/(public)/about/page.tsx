import { Shield, Target, Eye, Heart } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about TrustShield's mission to make trust verification accessible to everyone.",
};

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To make trust verification accessible to everyone — whether you're checking a suspicious text message or about to sign a 20-page contract you don't have time to read line by line.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    description:
      "A world where anyone can verify digital content before acting on it. No technical knowledge required. No expensive tools. Just plain answers to one question: Can I trust this?",
  },
  {
    icon: Heart,
    title: "Our Values",
    description:
      "Transparency, privacy, and accessibility. We believe understanding what you're agreeing to shouldn't require a law degree, and spotting a scam shouldn't require cybersecurity training.",
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
            <Shield className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h1 className="mb-4 text-4xl font-bold">About TrustShield</h1>
        <p className="text-lg text-muted-foreground">
          We started with a simple question: why is it so hard to know what
          you&apos;re agreeing to?
        </p>
      </div>

      <div className="mx-auto mt-16 max-w-3xl space-y-6 text-muted-foreground">
        <p>
          TrustShield was born from two separate projects — a fraud-detection
          app and a legal-document simplifier — that turned out to share the
          exact same underlying pattern:
        </p>

        <div className="rounded-lg border bg-muted/30 p-6 text-sm">
          <p className="font-medium text-foreground mb-2">The pattern:</p>
          <ol className="space-y-1 list-decimal list-inside">
            <li>User submits content (text / link / image / document)</li>
            <li>AI analyzes it</li>
            <li>A risk or confidence score is generated</li>
            <li>Plain-language reasons are returned</li>
            <li>User can ask follow-up questions or share the result</li>
          </ol>
        </div>

        <p>
          Rather than build and maintain two separate products with duplicated
          auth, dashboards, history, and infrastructure, we combined them into
          one platform with four detection modules — sharing one user account,
          one dashboard, one history page, and one billing model.
        </p>

        <p>
          A freelancer who uses TrustShield to check a sketchy client email is
          the same person who needs to check the contract that client eventually
          sends. It makes sense for both to live in one place.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-3">
        {values.map((value) => {
          const Icon = value.icon;
          return (
            <div key={value.title} className="rounded-lg border bg-card p-6 text-center">
              <div className="mb-4 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="mb-2 font-semibold">{value.title}</h3>
              <p className="text-sm text-muted-foreground">{value.description}</p>
            </div>
          );
        })}
      </div>

      <div className="mx-auto mt-16 max-w-2xl rounded-lg border bg-muted/30 p-8 text-center">
        <h2 className="mb-4 text-2xl font-bold">The Tech</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Built with Next.js 14, Express.js, Claude API, and MongoDB Atlas. One
          frontend, one backend, zero self-hosted ML services.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {["Next.js", "Express", "Claude API", "MongoDB", "Tailwind CSS", "Redis"].map(
            (tech) => (
              <span
                key={tech}
                className="rounded-full border bg-background px-3 py-1 text-xs font-medium"
              >
                {tech}
              </span>
            )
          )}
        </div>
      </div>
    </div>
  );
}
