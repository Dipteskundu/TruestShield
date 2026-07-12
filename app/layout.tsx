import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { ThemeTransitionProvider } from "@/components/providers/theme-transition-provider";
import { ToastProvider } from "@/components/ui/toaster";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "TrustShield — Scan anything before you trust it",
    template: "%s | TrustShield",
  },
  description:
    "Detect fraud, scan links, verify images, and understand legal documents in plain English.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ThemeTransitionProvider>
            <AuthProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </AuthProvider>
          </ThemeTransitionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
