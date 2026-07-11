import { Hero } from "@/components/marketing/hero";
import {
  Features,
  HowItWorks,
  PlansPreview,
  Roadmap,
  Testimonials,
  FAQ,
  FinalCTA,
} from "@/components/marketing/sections";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <PlansPreview />
      <Roadmap />
      <Testimonials />
      <FAQ />
      <FinalCTA />
    </>
  );
}
