import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const LandingFooter = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border/60 bg-background/80">
      <div className="container mx-auto px-4 py-12 grid gap-8 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[image:var(--gradient-primary)]">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold">TradeSense</span>
          </Link>
          <p className="text-muted-foreground mt-4 max-w-sm">
            {t("landing_footer_tagline")}
          </p>
        </div>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("landing_footer_product")}</div>
          <a href="#product" className="block hover:text-foreground">{t("landing_footer_platform")}</a>
          <a href="#markets" className="block hover:text-foreground">{t("landing_footer_markets")}</a>
          <a href="#pricing" className="block hover:text-foreground">{t("pricing")}</a>
          <Link to="/contact" className="block hover:text-foreground">{t("contact")}</Link>
        </div>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("landing_footer_legal")}</div>
          <Link to="/terms" className="block hover:text-foreground">{t("landing_footer_terms")}</Link>
          <Link to="/privacy" className="block hover:text-foreground">{t("landing_footer_privacy")}</Link>
          <Link to="/risk" className="block hover:text-foreground">{t("landing_footer_risk")}</Link>
        </div>
      </div>
      <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
        © 2026 TradeSense AI. {t("landing_footer_rights")}
      </div>
    </footer>
  );
};

export default LandingFooter;
