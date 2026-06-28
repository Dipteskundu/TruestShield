import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-sm text-muted-foreground">
            TrustShield — Scan anything before you trust it.
          </p>
          <p className="text-xs text-muted-foreground">
            Not legal advice. Consult a qualified attorney for binding decisions.
          </p>
          <div className="flex gap-4 text-sm">
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
            <Link href="/auth/login" className="text-muted-foreground hover:text-foreground">
              Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
