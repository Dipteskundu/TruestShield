export const SCAN_TYPES = {
  email: {
    label: "Email Scan",
    description: "Detect phishing and spoofed sender patterns",
    placeholder: "Paste the full email content here...",
    icon: "📧",
  },
  job: {
    label: "Job Post Scan",
    description: "Spot fake job listings and upfront payment scams",
    placeholder: "Paste the job description here...",
    icon: "💼",
  },
  message: {
    label: "Message Scan",
    description: "Check SMS and chat messages for scam patterns",
    placeholder: "Paste the message text here...",
    icon: "💬",
  },
  url: {
    label: "URL Scan",
    description: "Verify links before you click",
    placeholder: "https://example.com/suspicious-link",
    icon: "🔗",
  },
  image: {
    label: "Image Scan",
    description: "Detect AI-generated or manipulated images",
    placeholder: "Upload an image file",
    icon: "🖼️",
  },
} as const;

export type ScanType = keyof typeof SCAN_TYPES;

export const DOCUMENT_TYPES = [
  { value: "lease", label: "Lease Agreement" },
  { value: "freelance", label: "Freelance Contract" },
  { value: "nda", label: "NDA" },
  { value: "employment", label: "Employment Offer" },
  { value: "tos", label: "Terms of Service" },
  { value: "vendor", label: "Vendor Agreement" },
  { value: "other", label: "Other" },
] as const;

export const VERDICT_COLORS = {
  safe: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300",
  suspicious:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300",
  dangerous: "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300",
} as const;
