import { Check, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeader from "@/components/ui/SectionHeader";
import FadeIn from "@/components/motion/FadeIn";
import { useLanguage } from "@/contexts/LanguageContext";

const LandingPricing = () => {
  const { t } = useLanguage();
  const plans = [
    {
      name: t("plan_starter"),
      price: "200 DH",
      account: "$5,000",
      highlights: [
        t("landing_pricing_starter_item_1"),
        t("landing_pricing_starter_item_2"),
        t("landing_pricing_starter_item_3"),
        t("landing_pricing_starter_item_4"),
      ],
    },
    {
      name: t("plan_pro"),
      price: "500 DH",
      account: "$10,000",
      highlights: [
        t("landing_pricing_pro_item_1"),
        t("landing_pricing_pro_item_2"),
        t("landing_pricing_pro_item_3"),
        t("landing_pricing_pro_item_4"),
      ],
      featured: true,
    },
    {
      name: t("plan_elite"),
      price: "1,000 DH",
      account: "$25,000",
      highlights: [
        t("landing_pricing_elite_item_1"),
        t("landing_pricing_elite_item_2"),
        t("landing_pricing_elite_item_3"),
        t("landing_pricing_elite_item_4"),
      ],
    },
  ];

  return (
    <section id="pricing" className="py-24">
      <div className="container mx-auto px-4 space-y-12">
        <SectionHeader
          kicker={t("landing_pricing_kicker")}
          title={t("landing_pricing_title")}
          subtitle={t("landing_pricing_subtitle")}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <FadeIn key={plan.name} delay={index * 0.1}>
              <GlassCard className={`p-6 space-y-6 ${plan.featured ? "border-primary/60" : ""}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold">{plan.name}</div>
                    <div className="text-sm text-muted-foreground">{plan.account} {t("landing_pricing_account")}</div>
                  </div>
                  {plan.featured ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                      <Star className="h-3 w-3" />
                      {t("landing_pricing_popular")}
                    </span>
                  ) : null}
                </div>

                <div className="text-3xl font-semibold">{plan.price}</div>

                <div className="space-y-3">
                  {plan.highlights.map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success/20">
                        <Check className="h-3 w-3 text-success" />
                      </span>
                      {item}
                    </div>
                  ))}
                </div>

                <Button variant={plan.featured ? "hero" : "outline"} className="w-full">
                  {t("start_challenge")}
                </Button>
              </GlassCard>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingPricing;
