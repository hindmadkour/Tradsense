import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  TrendingUp,
  Trophy,
  Wallet,
  User,
  LogOut,
  Menu,
  Target,
  Shield,
  Sun,
  Moon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import { useTheme } from "next-themes";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, language, setLanguage } = useLanguage();
  const { theme, resolvedTheme, setTheme } = useTheme();
  const isDark = (resolvedTheme ?? theme) === "dark";
  const languages = ["en", "fr", "ar"] as const;
  const isAdmin = typeof window !== 'undefined' && localStorage.getItem('auth_is_admin') === 'true';
  const menuItems = [
    { icon: LayoutDashboard, label: t('nav_dashboard'), path: '/dashboard' },
    { icon: TrendingUp, label: t('nav_trading'), path: '/dashboard/trading' },
    { icon: Target, label: t('nav_challenge'), path: '/dashboard/challenge' },
    { icon: Trophy, label: t('nav_leaderboard'), path: '/dashboard/leaderboard' },
    { icon: Wallet, label: t('nav_wallet'), path: '/dashboard/wallet' },
    { icon: User, label: t('nav_profile'), path: '/dashboard/profile' },
  ];
  if (isAdmin) {
    menuItems.push({ icon: Shield, label: t('nav_admin'), path: '/admin' });
  }

  const primaryItems = menuItems.filter((item) =>
    ['/dashboard', '/dashboard/trading', '/dashboard/challenge', '/dashboard/leaderboard'].includes(item.path)
  );
  const accountItems = menuItems.filter((item) =>
    ['/dashboard/wallet', '/dashboard/profile', '/admin'].includes(item.path)
  );

  const pageTitle = (() => {
    const match = menuItems.find((item) => item.path === location.pathname);
    if (match) return match.label;
    if (location.pathname.startsWith('/admin')) return t('nav_admin');
    return t('nav_dashboard');
  })();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <motion.aside
        className="hidden lg:flex flex-col border-r border-border/60 bg-sidebar/70 backdrop-blur-2xl"
        animate={{ width: sidebarOpen ? 260 : 92 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between px-4 py-5">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-2xl bg-[image:var(--gradient-primary)]" />
            {sidebarOpen ? <span className="text-lg font-semibold">TradeSense</span> : null}
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="rounded-xl border border-border/60 px-2 py-1 text-xs text-muted-foreground"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? "Collapse" : "Expand"}
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-6">
          <div className="space-y-2">
            {sidebarOpen ? (
              <div className="px-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Core</div>
            ) : null}
            {primaryItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                    isActive ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-secondary/40"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {sidebarOpen ? <span>{item.label}</span> : null}
                </Link>
              );
            })}
          </div>
          <div className="space-y-2">
            {sidebarOpen ? (
              <div className="px-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Account</div>
            ) : null}
            {accountItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all",
                    isActive ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-secondary/40"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {sidebarOpen ? <span>{item.label}</span> : null}
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="px-3 pb-6">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10",
              !sidebarOpen && "justify-center"
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            {sidebarOpen ? <span className="ml-3">{t("nav_logout")}</span> : null}
          </Button>
        </div>
      </motion.aside>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between border-b border-border/60 bg-background/70 px-4 py-4 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="rounded-xl border border-border/60 px-3 py-2 text-xs text-muted-foreground"
          >
            {t('nav_menu')}
          </button>
          <div className="text-sm font-semibold">{pageTitle}</div>
        </div>

        {mobileMenuOpen ? (
          <div className="lg:hidden border-b border-border/60 bg-background px-4 py-4">
            <div className="grid gap-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="rounded-xl border border-border/60 bg-card/60 px-4 py-3 text-sm text-muted-foreground"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <div className="p-4 lg:p-8 space-y-6">
          <GlassCard className="p-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">{t('dashboard')}</div>
              <h1 className="text-2xl md:text-3xl font-semibold">{pageTitle}</h1>
            </div>
            <div className="flex flex-col items-start gap-3 md:flex-row md:items-center md:gap-4">
              <div className="text-xs text-muted-foreground">
                {t('dashboard_session_status')} {t('dashboard_session_live')}
              </div>
              <div className="flex items-center gap-2">
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
              </div>
            </div>
          </GlassCard>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
