import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "TrustShield terms of service — rules and guidelines for using the platform.",
};

const sections = [
  {
    title: "Acceptance of Terms",
    content:
      "By accessing or using TrustShield, you agree to be bound by these Terms of Service. If you do not agree, you may not use the service. We reserve the right to update these terms at any time, and continued use after changes constitutes acceptance.",
  },
  {
    title: "Service Description",
    content:
      "TrustShield provides AI-powered analysis tools for detecting spam, scams, phishing links, AI-generated images, and simplifying legal documents. The service is provided 'as is' and we make no guarantees about the accuracy, completeness, or reliability of any analysis results.",
  },
  {
    title: "User Accounts",
    content:
      "You are responsible for maintaining the confidentiality of your account credentials. You must be at least 13 years of age to create an account. You agree to provide accurate, current, and complete information during registration and to update it as necessary.",
  },
  {
    title: "Acceptable Use",
    content:
      "You agree to use TrustShield only for lawful purposes. You may not use the service to: violate any laws, infringe on intellectual property rights, distribute malware or harmful content, attempt to bypass rate limits or security measures, or submit content that you do not have the right to submit.",
  },
  {
    title: "Guest Use",
    content:
      "Guest users may access limited features of the service without creating an account. Guest usage is subject to daily rate limits as described on our pricing page. We reserve the right to modify guest limits at any time.",
  },
  {
    title: "Not Legal Advice",
    content:
      "TrustShield's document analysis module is a legal literacy tool, not a substitute for professional legal advice. The plain-language explanations and risk scores provided are for informational purposes only. For decisions with significant financial or legal consequences, you should consult a qualified attorney. Never disregard professional legal advice or delay in seeking it based on something you read on TrustShield.",
  },
  {
    title: "Limitation of Liability",
    content:
      "TrustShield and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the service. This includes, but is not limited to, decisions made based on analysis results, data loss, or service interruptions.",
  },
  {
    title: "Data Handling",
    content:
      "Our data handling practices are described in our Privacy Policy. By using the service, you consent to the collection and use of your data as described therein. You retain ownership of any content you submit, and grant us a limited license to process that content solely for the purpose of providing the requested analysis.",
  },
  {
    title: "Third-Party Services",
    content:
      "TrustShield relies on third-party APIs (Anthropic Claude, Sightengine, Google Safe Browsing) to perform analyses. We are not responsible for the availability, accuracy, or performance of these third-party services. Your use of these services through TrustShield is subject to their respective terms.",
  },
  {
    title: "Termination",
    content:
      "We reserve the right to suspend or terminate accounts that violate these terms or engage in abusive behavior. You may delete your account at any time through your account settings. Upon termination, your data will be deleted in accordance with our Privacy Policy.",
  },
];

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-4xl font-bold">Terms of Service</h1>
        <p className="mb-8 text-muted-foreground">
          Last updated: June 2026
        </p>

        <div className="space-y-8">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="mb-3 text-xl font-semibold">{section.title}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {section.content}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-lg border bg-muted/30 p-6">
          <h3 className="mb-2 font-semibold">Contact</h3>
          <p className="text-sm text-muted-foreground">
            For questions about these terms:{" "}
            <span className="text-primary">legal@trustshield.app</span>
          </p>
        </div>
      </div>
    </div>
  );
}
