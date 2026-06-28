import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "TrustShield privacy policy — how we handle your data.",
};

const sections = [
  {
    title: "Information We Collect",
    content:
      "When you create an account, we collect your name and email address. When you use our scanning services, we temporarily store the content you submit (text, URLs, images, documents) to perform the analysis and return results. We do not collect any personal information beyond what is necessary to operate the service.",
  },
  {
    title: "How We Use Your Information",
    content:
      "Your account information is used to authenticate you and manage your usage limits. Submitted content is used exclusively to perform the requested analysis via our AI providers (Anthropic's Claude API, Sightengine, Google Safe Browsing). We do not use your content to train AI models, improve algorithms, or for any purpose beyond fulfilling your scan request.",
  },
  {
    title: "Data Storage and Encryption",
    content:
      "Scan results are stored in our database and encrypted at rest. Uploaded documents are encrypted using AES-256 encryption standards. We use MongoDB Atlas for database storage and Cloudinary for file hosting. All data is transmitted over HTTPS.",
  },
  {
    title: "Data Retention",
    content:
      "Scan results automatically expire and are deleted after 7 days. Uploaded documents are retained until you delete them or the auto-delete period you selected expires (default: 30 days). You can delete your account and all associated data at any time through your account settings.",
  },
  {
    title: "Third-Party Services",
    content:
      "We use the following third-party services to provide our analysis: Anthropic (Claude API) for text classification and document analysis, Sightengine for AI image detection, Google Safe Browsing for URL safety checks, and MongoDB Atlas for database hosting. Each of these services has their own privacy policy governing how they handle data submitted to them.",
  },
  {
    title: "AI Training",
    content:
      "We explicitly prohibit the use of your content for training AI models. Our agreement with Anthropic (Claude API) specifies that submitted content is not used for model training. Your documents, scans, and personal information remain your property and are never used to improve third-party AI systems.",
  },
  {
    title: "Cookies",
    content:
      "We use essential cookies for authentication and session management. We do not use tracking cookies, analytics cookies, or third-party marketing cookies. You can control cookie settings through your browser.",
  },
  {
    title: "Your Rights",
    content:
      "You have the right to access, correct, or delete your personal data at any time. You can export your scan history, delete individual documents, or delete your entire account through the dashboard settings. For any privacy-related requests, contact us at privacy@trustshield.app.",
  },
  {
    title: "Changes to This Policy",
    content:
      "We may update this privacy policy from time to time. We will notify you of any material changes via email or through the application. Continued use of the service after changes constitutes acceptance of the updated policy.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-4 text-4xl font-bold">Privacy Policy</h1>
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
            For privacy-related inquiries:{" "}
            <span className="text-primary">privacy@trustshield.app</span>
          </p>
        </div>
      </div>
    </div>
  );
}
