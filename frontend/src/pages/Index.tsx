import PageTransition from "@/components/motion/PageTransition";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingHero from "@/components/landing/LandingHero";
import LandingProduct from "@/components/landing/LandingProduct";
import LandingMarkets from "@/components/landing/LandingMarkets";
import LandingSignals from "@/components/landing/LandingSignals";
import LandingStats from "@/components/landing/LandingStats";
import LandingPricing from "@/components/landing/LandingPricing";
import LandingCTA from "@/components/landing/LandingCTA";
import LandingFooter from "@/components/landing/LandingFooter";
import LandingCommandCenter from "@/components/landing/LandingCommandCenter";
import LandingSentiment from "@/components/landing/LandingSentiment";

const Index = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 market-grid opacity-25" />
        <LandingNavbar />
        <LandingHero />
        <LandingCommandCenter />
        <LandingProduct />
        <LandingMarkets />
        <LandingSentiment />
        <LandingSignals />
        <LandingStats />
        <LandingPricing />
        <LandingCTA />
        <LandingFooter />
      </div>
    </PageTransition>
  );
};

export default Index;
