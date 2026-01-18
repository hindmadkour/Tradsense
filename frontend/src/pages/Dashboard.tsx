import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { ShieldCheck, Sparkles, TrendingUp, Zap } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PageTransition from "@/components/motion/PageTransition";
import GlassCard from "@/components/ui/GlassCard";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import TickerTape from "@/components/ui/TickerTape";
import SkeletonBlock from "@/components/ui/SkeletonBlock";
import { usePortfolio } from "@/lib/api";
import { getCurrentUserId } from "@/lib/auth";
import { useLanguage } from "@/contexts/LanguageContext";

const buildEquitySeries = (initialValue: number, trades: Array<{ profit?: number; timestamp?: string }>) => {
  const dailyProfit: Record<string, number> = {};
  trades.forEach((trade) => {
    if (!trade.timestamp) return;
    const key = new Date(trade.timestamp).toISOString().slice(0, 10);
    dailyProfit[key] = (dailyProfit[key] || 0) + (trade.profit || 0);
  });
  const series: Array<{ name: string; value: number }> = [];
  let running = initialValue;
  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const key = date.toISOString().slice(0, 10);
    running += dailyProfit[key] || 0;
    series.push({
      name: date.toLocaleDateString("en-US", { weekday: "short" }),
      value: Math.max(0, Math.round(running)),
    });
  }
  return series;
};

const momentumData = [
  { name: "09:00", value: 62 },
  { name: "11:00", value: 68 },
  { name: "13:00", value: 64 },
  { name: "15:00", value: 72 },
  { name: "17:00", value: 76 },
  { name: "19:00", value: 71 },
];

const tickers = [
  { symbol: "BTC/USD", price: "62,480", change: "+2.4%", positive: true },
  { symbol: "NAS100", price: "18,252", change: "+1.1%", positive: true },
  { symbol: "EUR/USD", price: "1.085", change: "-0.2%", positive: false },
  { symbol: "XAU/USD", price: "2,385", change: "+0.6%", positive: true },
  { symbol: "USD/MAD", price: "10.12", change: "-0.4%", positive: false },
];

const confidenceWidth = (value: number) => {
  const map: Record<number, string> = {
    72: "w-[72%]",
    86: "w-[86%]",
    88: "w-[88%]",
    91: "w-[91%]",
  };
  return map[value] ?? "w-3/4";
};

const Dashboard = () => {
  const userId = getCurrentUserId();
  const { t } = useLanguage();
  const { portfolio, isLoading, isFetching } = usePortfolio(userId);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      setLoading(false);
    }
  }, [isLoading]);

  const account = portfolio?.account;
  const trades = portfolio?.trades || [];
  const dailyStartEquity = account?.daily_starting_equity ?? account?.equity ?? 0;
  const initialBalance = account?.initial_balance ?? account?.equity ?? 0;
  const equityValue = account?.equity ?? 0;

  const todayKey = new Date().toISOString().slice(0, 10);
  const dailyProfit = trades.reduce((sum, trade) => {
    if (!trade.timestamp) return sum;
    const key = new Date(trade.timestamp).toISOString().slice(0, 10);
    if (key !== todayKey) return sum;
    return sum + (trade.profit || 0);
  }, 0);
  const dailyPnlPct = dailyStartEquity ? (dailyProfit / dailyStartEquity) * 100 : 0;
  const dailyDrawdownPct = dailyStartEquity ? Math.max(0, ((dailyStartEquity - equityValue) / dailyStartEquity) * 100) : 0;
  const totalDrawdownPct = initialBalance ? Math.max(0, ((initialBalance - equityValue) / initialBalance) * 100) : 0;

  const winRate = useMemo(() => {
    const closed = trades.filter((trade) => trade.status === "closed" || trade.exit_price != null);
    if (!closed.length) return 0;
    const wins = closed.filter((trade) => (trade.profit || 0) > 0).length;
    return (wins / closed.length) * 100;
  }, [trades]);

  const equityData = useMemo(() => {
    if (!account) return [];
    return buildEquitySeries(initialBalance || equityValue, trades);
  }, [account, initialBalance, equityValue, trades]);

  const confidence = [
    { label: t("dashboard_confidence_trend"), value: 86 },
    { label: t("dashboard_confidence_volatility"), value: 72 },
    { label: t("dashboard_confidence_liquidity"), value: 91 },
    { label: t("dashboard_confidence_risk_fit"), value: 88 },
  ];

  return (
    <PageTransition>
      <DashboardLayout>
        <div className="space-y-6">
          <TickerTape items={tickers} />

          <div className="grid gap-4 lg:grid-cols-4">
            {[
              { label: t("dashboard_stat_equity"), value: equityValue || 0, format: (val: number) => `$${val.toFixed(0)}` },
              { label: t("dashboard_stat_daily_pnl"), value: dailyPnlPct || 0, format: (val: number) => `${val.toFixed(1)}%` },
              { label: t("dashboard_stat_drawdown"), value: dailyDrawdownPct || 0, format: (val: number) => `${val.toFixed(1)}%` },
              { label: t("dashboard_stat_win_rate"), value: winRate || 0, format: (val: number) => `${val.toFixed(0)}%` },
            ].map((stat) => (
              <GlassCard key={stat.label} className="p-4">
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</div>
                {loading || isFetching ? (
                  <SkeletonBlock className="mt-3 h-8 w-24" />
                ) : (
                  <AnimatedNumber value={stat.value} format={stat.format} className="mt-2 text-2xl font-semibold" />
                )}
              </GlassCard>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]">
            <GlassCard className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{t("dashboard_equity_curve")}</div>
                  <div className="text-lg font-semibold">{t("dashboard_equity_window")}</div>
                </div>
                <span className="text-sm text-success">+9.4% {t("dashboard_equity_week")}</span>
              </div>
              <div className="mt-6 h-64">
                {loading || isFetching ? (
                  <SkeletonBlock className="h-full w-full" />
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={equityData}>
                      <defs>
                        <linearGradient id="equityGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(174 92% 45%)" stopOpacity={0.6} />
                          <stop offset="100%" stopColor="hsl(174 92% 45%)" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="hsl(214 16% 70%)" fontSize={12} />
                      <YAxis stroke="hsl(214 16% 70%)" fontSize={12} />
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke="hsl(174 92% 45%)"
                        strokeWidth={2}
                        fill="url(#equityGlow)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
              </div>
            </GlassCard>

            <div className="space-y-6">
              <GlassCard className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">{t("dashboard_ai_momentum")}</div>
                  <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
                    {t("dashboard_live")}
                  </span>
                </div>
                <div className="rounded-2xl border border-border/60 bg-secondary/40 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20 text-primary">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{t("dashboard_breakout_title")}</div>
                      <div className="text-xs text-muted-foreground">
                        {t("dashboard_breakout_confidence")} 92% • {t("dashboard_breakout_risk")}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 h-2 w-full rounded-full bg-background/60">
                    <div className="h-full w-4/5 rounded-full bg-[image:var(--gradient-primary)]" />
                  </div>
                </div>
                <div className="h-20">
                  {loading ? (
                    <SkeletonBlock className="h-full w-full" />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={momentumData}>
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="hsl(195 95% 55%)"
                          strokeWidth={2}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </GlassCard>

              <GlassCard className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">{t("dashboard_risk_shield")}</div>
                  <ShieldCheck className="h-5 w-5 text-success" />
                </div>
                <div className="space-y-3 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>{t("dashboard_daily_drawdown_label")}</span>
                    <span className="text-foreground">{dailyDrawdownPct.toFixed(1)}% / 5%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-background/60">
                    <div className="h-full rounded-full bg-success" style={{ width: `${Math.min(100, (dailyDrawdownPct / 5) * 100)}%` }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span>{t("dashboard_total_drawdown_label")}</span>
                    <span className="text-foreground">{totalDrawdownPct.toFixed(1)}% / 10%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-background/60">
                    <div className="h-full rounded-full bg-warning" style={{ width: `${Math.min(100, (totalDrawdownPct / 10) * 100)}%` }} />
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
            <GlassCard className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <TrendingUp className="h-5 w-5 text-primary" />
                {t("dashboard_confidence_meters")}
              </div>
              <div className="space-y-4">
                {confidence.map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">{item.label}</span>
                      <span>{item.value}%</span>
                    </div>
                    <div className="mt-2 h-2 w-full rounded-full bg-background/60">
                      <div className={`h-full rounded-full bg-[image:var(--gradient-primary)] ${confidenceWidth(item.value)}`} />
                    </div>
                  </div>
                ))}
              </div>
            </GlassCard>

            <GlassCard className="p-6 space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Zap className="h-5 w-5 text-warning" />
                {t("dashboard_trade_checklist")}
              </div>
              <div className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-center justify-between rounded-xl border border-border/60 bg-secondary/40 px-4 py-3">
                  <span>{t("dashboard_check_news")}</span>
                  <span className="text-success">{t("dashboard_check_cleared")}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-border/60 bg-secondary/40 px-4 py-3">
                  <span>{t("dashboard_check_exposure")}</span>
                  <span className="text-success">{t("dashboard_check_ok")}</span>
                </div>
                <div className="flex items-center justify-between rounded-xl border border-border/60 bg-secondary/40 px-4 py-3">
                  <span>{t("dashboard_check_stops")}</span>
                  <span className="text-warning">{t("dashboard_check_pending")}</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </DashboardLayout>
    </PageTransition>
  );
};

export default Dashboard;
