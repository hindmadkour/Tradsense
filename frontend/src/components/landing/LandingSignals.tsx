import { ShieldCheck, Target, Zap } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeader from "@/components/ui/SectionHeader";
import FadeIn from "@/components/motion/FadeIn";
import { useLanguage } from "@/contexts/LanguageContext";

const LandingSignals = () => {
  const { t } = useLanguage();
  const signals = [
    { asset: "ETH/USD", bias: t("landing_signals_bias_long"), confidence: "88%", risk: t("landing_signals_risk_low") },
    { asset: "NAS100", bias: t("landing_signals_bias_long"), confidence: "92%", risk: t("landing_signals_risk_medium") },
    { asset: "USD/JPY", bias: t("landing_signals_bias_short"), confidence: "81%", risk: t("landing_signals_risk_low") },
  ];
  const cards = [
    { icon: Target, title: t("landing_signals_card_momentum"), detail: t("landing_signals_card_momentum_desc") },
    { icon: ShieldCheck, title: t("landing_signals_card_risk"), detail: t("landing_signals_card_risk_desc") },
    { icon: Zap, title: t("landing_signals_card_speed"), detail: t("landing_signals_card_speed_desc") },
  ];

  return (
    <section id="signals" className="py-24">
      <div className="container mx-auto px-4 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] items-start">
        <FadeIn>
          <SectionHeader
            kicker={t("landing_signals_kicker")}
            title={t("landing_signals_title")}
            subtitle={t("landing_signals_subtitle")}
          />
          <div className="mt-8 grid gap-4">
            {cards.map((item) => (
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
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {t("landing_signals_live")}
                </div>
                <div className="text-lg font-semibold">{t("landing_signals_feed")}</div>
              </div>
              <span className="rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs text-success">
                {t("landing_signals_updated")}
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
                    <div className="text-xs text-muted-foreground">
                      {signal.bias} {t("landing_signals_bias_label")} • {t("landing_signals_risk_label")} {signal.risk}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {t("landing_signals_confidence")}
                    </div>
                    <div className="text-sm font-semibold text-primary">{signal.confidence}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-border/60 bg-card/60 p-4">
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {t("landing_signals_model_health")}
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span>{t("landing_signals_accuracy")}</span>
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
};

export default LandingSignals;
