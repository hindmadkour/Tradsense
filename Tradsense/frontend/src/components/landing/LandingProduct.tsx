import { Activity, ShieldCheck, Sparkles, LineChart, Users, Compass } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeader from "@/components/ui/SectionHeader";
import FadeIn from "@/components/motion/FadeIn";

const features = [
  {
    icon: Sparkles,
    title: "AI Signal Engine",
    description: "Real-time opportunity scans with multi-factor confidence scoring.",
  },
  {
    icon: ShieldCheck,
    title: "Risk Guardrails",
    description: "Daily and total drawdown checks enforced across every trade.",
  },
  {
    icon: Activity,
    title: "Execution Hub",
    description: "Unified terminal for BVC, FX, crypto, and US indices.",
  },
  {
    icon: LineChart,
    title: "Analytics Suite",
    description: "Performance insights, journaling, and advanced strategy breakdowns.",
  },
  {
    icon: Users,
    title: "Trader Cohorts",
    description: "Peer groups, mentor rooms, and capital scaling pathways.",
  },
  {
    icon: Compass,
    title: "Capital Ladder",
    description: "Grow allocation after consistent 30-day performance windows.",
  },
];

const LandingProduct = () => (
  <section id="product" className="py-24">
    <div className="container mx-auto px-4 space-y-12">
      <SectionHeader
        kicker="Platform"
        title="Built like a modern trading desk"
        subtitle="Every module is designed to keep you fast, compliant, and confident."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <FadeIn key={feature.title} delay={index * 0.08}>
            <GlassCard className="p-5 space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <feature.icon className="h-6 w-6" />
              </div>
              <div className="text-lg font-semibold">{feature.title}</div>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </GlassCard>
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

export default LandingProduct;
