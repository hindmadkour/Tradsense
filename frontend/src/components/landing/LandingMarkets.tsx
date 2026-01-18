import { Line, LineChart, ResponsiveContainer } from "recharts";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeader from "@/components/ui/SectionHeader";
import FadeIn from "@/components/motion/FadeIn";
import { useLanguage } from "@/contexts/LanguageContext";

const marketData = [
  {
    name: "Bitcoin",
    symbol: "BTC/USD",
    price: "$62,480",
    change: "+2.4%",
    positive: true,
    data: [
      { value: 58 },
      { value: 62 },
      { value: 60 },
      { value: 64 },
      { value: 63 },
      { value: 66 },
      { value: 62 },
    ],
  },
  {
    name: "Nasdaq 100",
    symbol: "NAS100",
    price: "18,252",
    change: "+1.1%",
    positive: true,
    data: [
      { value: 44 },
      { value: 46 },
      { value: 45 },
      { value: 48 },
      { value: 50 },
      { value: 49 },
      { value: 51 },
    ],
  },
  {
    name: "EUR/USD",
    symbol: "EUR/USD",
    price: "1.085",
    change: "-0.2%",
    positive: false,
    data: [
      { value: 30 },
      { value: 29 },
      { value: 28 },
      { value: 29 },
      { value: 27 },
      { value: 26 },
      { value: 27 },
    ],
  },
];

const LandingMarkets = () => {
  const { t } = useLanguage();

  return (
    <section id="markets" className="py-24">
      <div className="container mx-auto px-4 space-y-12">
        <SectionHeader
          kicker={t("landing_markets_kicker")}
          title={t("landing_markets_title")}
          subtitle={t("landing_markets_subtitle")}
        />

      <div className="grid gap-6 lg:grid-cols-3">
        {marketData.map((market, index) => (
          <FadeIn key={market.symbol} delay={index * 0.1}>
            <GlassCard className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">{market.name}</div>
                  <div className="text-lg font-semibold">{market.symbol}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold trading-number">{market.price}</div>
                  <div className={market.positive ? "text-success text-sm" : "text-destructive text-sm"}>
                    {market.change}
                  </div>
                </div>
              </div>
              <div className="h-24">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={market.data}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={market.positive ? "hsl(174 92% 45%)" : "hsl(0 72% 56%)"}
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-[0.2em]">
                {t("landing_markets_range")}
              </div>
            </GlassCard>
          </FadeIn>
        ))}
      </div>
    </div>
    </section>
  );
};

export default LandingMarkets;
