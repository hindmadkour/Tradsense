import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import GlassCard from "@/components/ui/GlassCard";
import { useLanguage } from "@/contexts/LanguageContext";

const LandingCTA = () => {
  const { t } = useLanguage();

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <GlassCard className="p-8 md:p-12 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t("landing_cta_kicker")}</div>
            <h3 className="text-2xl md:text-3xl font-semibold mt-3">
              {t("landing_cta_title")}
            </h3>
            <p className="text-muted-foreground mt-3 max-w-xl">
              {t("landing_cta_subtitle")}
            </p>
          </div>
          <Button variant="hero" size="xl" className="shrink-0">
            {t("start_challenge")}
            <ArrowUpRight className="h-5 w-5" />
          </Button>
        </GlassCard>
      </div>
    </section>
  );
};

export default LandingCTA;
