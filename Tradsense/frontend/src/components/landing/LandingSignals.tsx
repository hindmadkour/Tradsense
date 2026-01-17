import { ShieldCheck, Target, Zap } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeader from "@/components/ui/SectionHeader";
import FadeIn from "@/components/motion/FadeIn";

const signals = [
  { asset: "ETH/USD", bias: "Long", confidence: "88%", risk: "Low" },
  { asset: "NAS100", bias: "Long", confidence: "92%", risk: "Medium" },
  { asset: "USD/JPY", bias: "Short", confidence: "81%", risk: "Low" },
];

const LandingSignals = () => (
  <section id="signals" className="py-24">
    <div className="container mx-auto px-4 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-start">
      <FadeIn>
        <SectionHeader
          kicker="AI signals"
          title="AI-powered trade ideas with built-in risk control"
          subtitle="Every signal is scored for momentum, volatility, and rule compliance before it reaches your dashboard."
        />
        <div className="mt-8 grid gap-4">
          {[
            { icon: Target, title: "Momentum scoring", detail: "Signals ranked by trend strength and liquidity." },
            { icon: ShieldCheck, title: "Risk shield", detail: "Auto-checks against drawdown and exposure limits." },
            { icon: Zap, title: "Execution speed", detail: "Alerts arrive with sub-200ms latency." },
          ].map((item) => (
            <GlassCard key={item.title} className="p-4 flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">{item.title}</div>
                <div className="text-xs text-muted-foreground">{item.detail}</div>
              </div>
            </GlassCard>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={0.1}>
        <GlassCard className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Live signals</div>
              <div className="text-lg font-semibold">AI Signal Feed</div>
            </div>
            <span className="rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs text-success">
              Updated now
            </span>
          </div>

          <div className="space-y-3">
            {signals.map((signal) => (
              <div
                key={signal.asset}
                className="rounded-2xl border border-border/60 bg-secondary/30 px-4 py-3 flex items-center justify-between"
              >
                <div>
                  <div className="text-sm font-semibold">{signal.asset}</div>
                  <div className="text-xs text-muted-foreground">{signal.bias} bias • Risk {signal.risk}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Confidence</div>
                  <div className="text-sm font-semibold text-primary">{signal.confidence}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Model health</div>
            <div className="mt-2 flex items-center justify-between text-sm">
              <span>Accuracy (30D)</span>
              <span className="text-success font-semibold">84.7%</span>
            </div>
            <div className="mt-3 h-2 w-full rounded-full bg-background/60">
              <div className="h-full w-4/5 rounded-full bg-[image:var(--gradient-primary)]" />
            </div>
          </div>
        </GlassCard>
      </FadeIn>
    </div>
  </section>
);

export default LandingSignals;
