import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import StageTimeline from "@/components/landing/StageTimeline";
import CTABanner from "@/components/landing/CTABanner";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <Features />
      <StageTimeline />
      <CTABanner />
    </main>
  );
}
