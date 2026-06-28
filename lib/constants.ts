export const SCAN_TYPES = {
  email: {
    label: "Email Scan",
    description: "Detect phishing and spoofed sender patterns",
    placeholder: "Paste the full email content here...",
  },
  job: {
    label: "Job Post Scan",
    description: "Spot fake job listings and upfront payment scams",
    placeholder: "Paste the job description here...",
  },
  message: {
    label: "Message Scan",
    description: "Check SMS and chat messages for scam patterns",
    placeholder: "Paste the message text here...",
  },
  url: {
    label: "URL Scan",
    description: "Verify links before you click",
    placeholder: "https://example.com/suspicious-link",
  },
  image: {
    label: "Image Scan",
    description: "Detect AI-generated or manipulated images",
    placeholder: "Upload an image file",
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
  safe: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  suspicious:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  dangerous: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
} as const;
