import { Mail, MapPin, Clock } from "lucide-react";
import { ContactForm } from "@/components/contact/contact-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with the TrustShield team.",
};

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@trustshield.app",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "San Francisco, CA",
  },
  {
    icon: Clock,
    label: "Response Time",
    value: "Within 24 hours",
  },
];

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="mb-4 text-4xl font-bold">Contact us</h1>
        <p className="text-lg text-muted-foreground">
          Have a question, suggestion, or found something suspicious?
          We&apos;d love to hear from you.
        </p>
      </div>

      <div className="mx-auto mt-12 grid max-w-5xl gap-12 md:grid-cols-2">
        <ContactForm />

        <div className="space-y-6">
          {contactInfo.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-start gap-4 rounded-lg border bg-card p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.value}</p>
                </div>
              </div>
            );
          })}

          <div className="rounded-lg border bg-muted/30 p-4">
            <p className="text-sm text-muted-foreground">
              <strong className="text-foreground">Report a scam:</strong> If
              you&apos;ve encountered a phishing attempt or fraudulent content
              that you&apos;d like us to investigate, please include the full
              content and any relevant details in your message.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
