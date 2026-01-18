import { ShieldCheck, Layers, Clock, Zap, TrendingUp } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeader from "@/components/ui/SectionHeader";
import FadeIn from "@/components/motion/FadeIn";
import { useLanguage } from "@/contexts/LanguageContext";

const LandingCommandCenter = () => {
  const { t } = useLanguage();
  const tickerPhases = [
    { label: t("landing_command_phase_premarket"), value: t("landing_command_phase_premarket_value") },
    { label: t("landing_command_phase_open"), value: t("landing_command_phase_open_value") },
    { label: t("landing_command_phase_afterhours"), value: t("landing_command_phase_afterhours_value") },
  ];
  const cards = [
    { icon: Layers, title: t("landing_command_card_overlays"), desc: t("landing_command_card_overlays_desc") },
    { icon: ShieldCheck, title: t("landing_command_card_compliance"), desc: t("landing_command_card_compliance_desc") },
    { icon: Zap, title: t("landing_command_card_automation"), desc: t("landing_command_card_automation_desc") },
    { icon: TrendingUp, title: t("landing_command_card_execution"), desc: t("landing_command_card_execution_desc") },
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 space-y-10">
        <SectionHeader
          kicker={t("landing_command_kicker")}
          title={t("landing_command_title")}
          subtitle={t("landing_command_subtitle")}
        />

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <FadeIn>
          <GlassCard className="p-6 space-y-6 border border-border/60">
            <div className="text-sm font-semibold text-muted-foreground uppercase tracking-[0.3em]">
              {t("landing_command_workflow")}
            </div>
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
              {t("landing_command_note")}
            </div>
          </GlassCard>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="grid gap-4">
            {cards.map((card) => (
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
};

export default LandingCommandCenter;
