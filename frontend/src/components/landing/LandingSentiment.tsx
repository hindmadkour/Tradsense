import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeader from "@/components/ui/SectionHeader";
import FadeIn from "@/components/motion/FadeIn";
import { useLanguage } from "@/contexts/LanguageContext";

const LandingSentiment = () => {
  const { t } = useLanguage();
  const sentimentData = [
    { label: t("landing_sentiment_bullish"), value: 65 },
    { label: t("landing_sentiment_neutral"), value: 22 },
    { label: t("landing_sentiment_riskoff"), value: 13 },
  ];

  return (
    <section className="py-24">
      <div className="container mx-auto px-4 space-y-10">
        <SectionHeader
          kicker={t("landing_sentiment_kicker")}
          title={t("landing_sentiment_title")}
          subtitle={t("landing_sentiment_subtitle")}
        />

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <FadeIn>
          <GlassCard className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {t("landing_sentiment_order_flow")}
              </div>
              <span className="text-sm font-semibold text-success">{t("landing_sentiment_rally")}</span>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sentimentData}>
                  <XAxis
                    dataKey="label"
                    stroke="hsl(214 16% 70%)"
                    tick={{ fontSize: 12, fill: "hsl(214 16% 70%)" }}
                  />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(213 16% 12%)",
                      border: "1px solid hsla(196, 96%, 45%, 0.5)",
                      borderRadius: 12,
                    }}
                  />
                  <Bar dataKey="value" fill="url(#sentimentGradient)">
                    <defs>
                      <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(196 96% 45%)" stopOpacity={0.95} />
                        <stop offset="100%" stopColor="hsl(154 96% 54%)" stopOpacity={0.2} />
                      </linearGradient>
                    </defs>
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{t("landing_sentiment_liquidity")}</span>
              <span className="text-primary font-semibold">240M</span>
            </div>
          </GlassCard>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="space-y-4">
            {[
              { label: t("landing_sentiment_macro"), detail: t("landing_sentiment_macro_value") },
              { label: t("landing_sentiment_fx"), detail: t("landing_sentiment_fx_value") },
              { label: t("landing_sentiment_volatility"), detail: t("landing_sentiment_volatility_value") },
            ].map((item) => (
              <GlassCard key={item.label} className="p-4 border border-border/60">
                <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{item.label}</div>
                <div className="text-lg font-semibold">{item.detail}</div>
              </GlassCard>
            ))}
          </div>
        </FadeIn>
      </div>
    </div>
    </section>
  );
};

export default LandingSentiment;
