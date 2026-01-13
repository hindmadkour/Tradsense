import AnimatedNumber from "@/components/ui/AnimatedNumber";
import GlassCard from "@/components/ui/GlassCard";
import FadeIn from "@/components/motion/FadeIn";

const stats = [
  { label: "Capital funded", value: 22000000, format: (val: number) => `$${Math.round(val / 1000000)}M+` },
  { label: "Active traders", value: 4200, format: (val: number) => `${Math.round(val).toLocaleString()}+` },
  { label: "Success rate", value: 82, format: (val: number) => `${val.toFixed(0)}%` },
  { label: "Average payout", value: 3200, format: (val: number) => `$${val.toFixed(0)}` },
];

const LandingStats = () => (
  <section className="py-16">
    <div className="container mx-auto px-4 grid gap-6 md:grid-cols-4">
      {stats.map((stat, index) => (
        <FadeIn key={stat.label} delay={index * 0.05}>
          <GlassCard className="p-4 text-center">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</div>
            <AnimatedNumber value={stat.value} format={stat.format} className="text-2xl font-semibold mt-2 block" />
          </GlassCard>
        </FadeIn>
      ))}
    </div>
  </section>
);

export default LandingStats;
