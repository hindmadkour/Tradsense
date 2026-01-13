import { ShieldCheck, Layers, Clock, Zap, TrendingUp } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeader from "@/components/ui/SectionHeader";
import FadeIn from "@/components/motion/FadeIn";

const tickerPhases = [
  { label: "Pre-market", value: "3.4k trades" },
  { label: "Open", value: "12.8k trades" },
  { label: "After hours", value: "5.1k trades" },
];

const LandingCommandCenter = () => (
  <section className="py-24">
    <div className="container mx-auto px-4 space-y-10">
      <SectionHeader
        kicker="Command center"
        title="Orchestrate trades from a single glass cockpit"
        subtitle="Cinematic motion, live monitors, and compliance overlays keep every decision precise."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <FadeIn>
          <GlassCard className="p-6 space-y-6 border border-border/60">
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-[0.3em]">Order workflow</div>
            <div className="space-y-4">
              {tickerPhases.map((phase) => (
                <div key={phase.label} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-primary/70" />
                    <span>{phase.label}</span>
                  </div>
                  <span className="text-foreground font-semibold">{phase.value}</span>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-border/50 bg-secondary/20 p-4 text-xs text-muted-foreground">
              Alpha indicators highlight momentum before you execute. All charts pulse with a cinematic fade on ticks.
            </div>
          </GlassCard>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="grid gap-4">
            {[
              { icon: Layers, title: "Portfolio overlays", desc: "Multi-asset view with risk corridors." },
              { icon: ShieldCheck, title: "Compliance watch", desc: "Rule engine enforces drawdown limits." },
              { icon: Zap, title: "Signal automation", desc: "AI filters the loudest setups every hour." },
              { icon: TrendingUp, title: "Execution desk", desc: "Routing + liquidity depth in one panel." },
            ].map((card) => (
              <GlassCard key={card.title} className="p-5 border border-border/40 flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                  <card.icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold">{card.title}</div>
                  <div className="text-xs text-muted-foreground">{card.desc}</div>
                </div>
              </GlassCard>
            ))}
          </div>
        </FadeIn>
      </div>
    </div>
  </section>
);

export default LandingCommandCenter;
