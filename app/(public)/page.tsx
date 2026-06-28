import { Hero } from "@/components/landing/hero";
import { StatsBar } from "@/components/landing/stats-bar";
import { HowItWorks } from "@/components/landing/how-it-works";
import { ModulesGrid } from "@/components/landing/modules-grid";
import { WhyTrustShield } from "@/components/landing/why-trustshield";
import { UseCases } from "@/components/landing/use-cases";
import { FeaturesDeepDive } from "@/components/landing/features-deepdive";
import { Testimonials } from "@/components/landing/testimonials";
import { PricingPreview } from "@/components/landing/pricing-preview";
import { FAQ } from "@/components/landing/faq";
import { SecuritySection } from "@/components/landing/security-section";
import { CTABanner } from "@/components/landing/cta-banner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBar />
      <HowItWorks />
      <ModulesGrid />
      <WhyTrustShield />
      <UseCases />
      <FeaturesDeepDive />
      <Testimonials />
      <PricingPreview />
      <FAQ />
      <SecuritySection />
      <CTABanner />
    </>
  );
}
