import { Check, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h1 className="mb-4 text-3xl font-bold tracking-tight">Simple pricing</h1>
        <p className="text-muted-foreground">
          Start free. Upgrade when you need more scans and document analysis.
        </p>
      </div>

      <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
        <div className="glass rounded-2xl p-8 flex flex-col">
          <h3 className="text-lg font-semibold">Free</h3>
          <p className="text-sm text-muted-foreground">For occasional trust checks</p>
          <div className="my-6">
            <span className="text-4xl font-bold">$0</span>
          </div>
          <ul className="mb-8 flex-1 space-y-3 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-emerald-500" />
              3 text scans / day (guest)
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-emerald-500" />
              5 URL scans / day (guest)
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-emerald-500" />
              5 documents / month (registered)
            </li>
          </ul>
          <Link href="/auth/signup">
            <Button className="w-full">Sign up free</Button>
          </Link>
        </div>

        <div className="gradient-primary rounded-2xl p-8 flex flex-col relative overflow-hidden shadow-glow">
          <div className="absolute top-0 right-0 bg-white/20 px-3 py-1 text-xs font-bold rounded-bl-xl flex items-center gap-1">
            <Crown className="h-3 w-3" />
            Popular
          </div>
          <h3 className="text-lg font-semibold text-white">Pro</h3>
          <p className="text-sm text-white/70">For power users and freelancers</p>
          <div className="my-6">
            <span className="text-4xl font-bold text-white">$12</span>
            <span className="text-white/70 text-sm">/mo</span>
          </div>
          <ul className="mb-8 flex-1 space-y-3 text-sm text-white/80">
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-white" />
              50 text scans / day
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-white" />
              30 URL scans / day
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-white" />
              Unlimited document analysis
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-4 w-4 shrink-0 text-white" />
              PDF export reports
            </li>
          </ul>
          <Button variant="secondary" className="w-full bg-white/20 text-white hover:bg-white/30">
            Coming soon
          </Button>
        </div>
      </div>
    </div>
  );
}
