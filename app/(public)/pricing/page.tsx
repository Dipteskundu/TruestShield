import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h1 className="mb-4 text-3xl font-bold">Simple pricing</h1>
        <p className="text-muted-foreground">
          Start free. Upgrade when you need more scans and document analysis.
        </p>
      </div>

      <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <CardDescription>For occasional trust checks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-3xl font-bold">$0</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>3 text scans / day (guest)</li>
              <li>5 URL scans / day (guest)</li>
              <li>5 documents / month (registered)</li>
            </ul>
            <Link href="/auth/signup">
              <Button className="w-full">Sign up free</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Pro</CardTitle>
            <CardDescription>For power users and freelancers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-3xl font-bold">$12/mo</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>50 text scans / day</li>
              <li>30 URL scans / day</li>
              <li>Unlimited document analysis</li>
              <li>PDF export reports</li>
            </ul>
            <Button className="w-full" variant="outline">
              Coming soon
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
