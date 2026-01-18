import { Activity, ShieldCheck, Sparkles, LineChart, Users, Compass } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeader from "@/components/ui/SectionHeader";
import FadeIn from "@/components/motion/FadeIn";
import { useLanguage } from "@/contexts/LanguageContext";

const LandingProduct = () => {
  const { t } = useLanguage();
  const features = [
    {
      icon: Sparkles,
      title: t("landing_product_feature_ai_title"),
      description: t("landing_product_feature_ai_desc"),
    },
    {
      icon: ShieldCheck,
      title: t("landing_product_feature_risk_title"),
      description: t("landing_product_feature_risk_desc"),
    },
    {
      icon: Activity,
      title: t("landing_product_feature_execution_title"),
      description: t("landing_product_feature_execution_desc"),
    },
    {
      icon: LineChart,
      title: t("landing_product_feature_analytics_title"),
      description: t("landing_product_feature_analytics_desc"),
    },
    {
      icon: Users,
      title: t("landing_product_feature_cohorts_title"),
      description: t("landing_product_feature_cohorts_desc"),
    },
    {
      icon: Compass,
      title: t("landing_product_feature_capital_title"),
      description: t("landing_product_feature_capital_desc"),
    },
  ];

  return (
    <section id="product" className="py-24">
      <div className="container mx-auto px-4 space-y-12">
        <SectionHeader
          kicker={t("landing_product_kicker")}
          title={t("landing_product_title")}
          subtitle={t("landing_product_subtitle")}
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
};

export default LandingProduct;
