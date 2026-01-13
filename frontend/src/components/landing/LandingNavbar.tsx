import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useLanguage } from "@/contexts/LanguageContext";

const LandingNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const isDark = (resolvedTheme ?? theme) === "dark";
  const links = [
    { label: t("nav_product"), href: "#product" },
    { label: t("nav_markets"), href: "#markets" },
    { label: t("pricing"), href: "#pricing" },
    { label: t("nav_signals"), href: "#signals" },
  ];
  const languages = ["en", "fr", "ar"] as const;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-2xl">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[image:var(--gradient-primary)]">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold">TradeSense</span>
          </Link>

          <div className="hidden items-center gap-2 rounded-full border border-border/60 bg-card/60 px-2 py-1 md:flex">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-border/70 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
              aria-label={isDark ? t("theme_light") : t("theme_dark")}
              title={isDark ? t("theme_light") : t("theme_dark")}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <div className="flex items-center gap-1 rounded-full border border-border/70 bg-card/70 p-1">
              {languages.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang)}
                  className={cn(
                    "text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all",
                    language === lang
                      ? "bg-primary text-white shadow-sm"
                      : "text-muted-foreground hover:text-primary"
                  )}
                  aria-pressed={language === lang}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
            <Button variant="ghost" asChild>
              <Link to="/login">{t("login")}</Link>
            </Button>
            <Button variant="hero" asChild>
              <Link to="/register">{t("start_challenge")}</Link>
            </Button>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="rounded-xl border border-border/60 px-3 py-2 text-xs font-semibold text-muted-foreground md:hidden"
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
          >
            Menu
          </button>
        </div>

        <div
          id="mobile-nav"
          className={cn(
            "overflow-hidden transition-[max-height] duration-300 md:hidden",
            isOpen ? "max-h-64" : "max-h-0"
          )}
        >
          <div className="space-y-2 pb-4 pt-2">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="block rounded-xl border border-border/40 bg-card/60 px-4 py-3 text-sm font-semibold text-muted-foreground"
              >
                {link.label}
              </a>
            ))}
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" asChild className="w-full">
                <Link to="/login">{t("login")}</Link>
              </Button>
              <Button variant="hero" asChild className="w-full">
                <Link to="/register">{t("start_challenge")}</Link>
              </Button>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="flex items-center justify-center gap-2 text-sm font-semibold px-3 py-2 rounded-xl border border-border/70 text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {isDark ? t("theme_light") : t("theme_dark")}
              </button>
              <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-background/70 p-2">
                {languages.map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={cn(
                      "text-sm font-bold flex-1 py-2 rounded-lg",
                      language === lang ? "bg-primary text-white" : "bg-secondary text-muted-foreground"
                    )}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
