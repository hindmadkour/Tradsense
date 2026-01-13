import { motion } from "framer-motion";
import { ArrowUpRight, Globe, Sparkles, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import GlassCard from "@/components/ui/GlassCard";
import AnimatedNumber from "@/components/ui/AnimatedNumber";
import TickerTape from "@/components/ui/TickerTape";
import { Line, LineChart, ResponsiveContainer } from "recharts";

const heroCurve = [
  { time: "08:00", value: 11800 },
  { time: "10:00", value: 12140 },
  { time: "12:00", value: 11960 },
  { time: "14:00", value: 12320 },
  { time: "16:00", value: 12480 },
  { time: "18:00", value: 12390 },
  { time: "20:00", value: 12610 },
];

const tickers = [
  { symbol: "BVC:IAM", price: "213.40", change: "+1.8%", positive: true },
  { symbol: "NAS100", price: "18,252", change: "+1.1%", positive: true },
  { symbol: "EUR/USD", price: "1.085", change: "-0.2%", positive: false },
  { symbol: "XAU/USD", price: "2,385", change: "+0.6%", positive: true },
];

const LandingHero = () => {
  return (
    <section className="relative overflow-hidden pt-24 pb-24">
      <div className="absolute inset-0 bg-hero-pattern opacity-35 blur-xl" />
      <div className="absolute -top-24 left-14 h-80 w-80 rounded-full bg-primary/20 blur-[150px]" />
      <div className="absolute bottom-0 right-0 h-[320px] w-[320px] rounded-full bg-accent/20 blur-[190px]" />

      <div className="container mx-auto px-4 grid gap-10 lg:grid-cols-[1.1fr_1fr] items-center">
        <div className="space-y-8 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-4 py-2 text-xs uppercase tracking-[0.3em] text-muted-foreground"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            Trading floor intelligence
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl font-semibold leading-tight"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Command every market with{" "}
            <span className="bg-[image:var(--gradient-primary)] bg-clip-text text-transparent">
              cinematic precision.
            </span>
          </motion.h1>

          <motion.p
            className="text-lg text-muted-foreground max-w-2xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            TradeSense unifies AI signals, live market data, and institutional compliance into a single
            glass cockpit. Switch between clear and dark modes while keeping high-impact visuals and
            cinematic motion.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button variant="hero" size="xl" asChild>
              <Link to="/register">
                Start Challenge
                <ArrowUpRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <a href="#pricing">View Pricing</a>
            </Button>
          </motion.div>
        </div>

        <div className="space-y-6 z-10">
          <GlassCard className="p-6 space-y-4 border border-border/60 bg-card/80 backdrop-blur-3xl">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Market pulse</div>
                <div className="text-lg font-semibold">BVC • NASDAQ • FX</div>
              </div>
              <div className="flex items-center gap-2 text-success text-xs">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                Live
              </div>
            </div>

            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={heroCurve}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="hsl(184 96% 45%)"
                    strokeWidth={3}
                    dot={{ r: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-xs text-muted-foreground">
              {[
                { label: "Bid/Ask spread", value: "0.03%" },
                { label: "Latency", value: "< 180ms" },
                { label: "AI confidence", value: "94%" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-[0.4em]">{item.label}</span>
                  <span className="text-base font-semibold text-foreground">{item.value}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-5 border border-border/50">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Global reach</div>
              <Globe className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-4 text-center">
              {[
                { label: "50+", value: "Markets" },
                { label: "96%", value: "Signal uptime" },
                { label: "24/7", value: "Desk support" },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="text-sm font-semibold">{item.value}</div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-12 z-10">
        <GlassCard className="p-4">
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Live ticker</div>
          <TickerTape items={tickers} className="mt-3" />
        </GlassCard>
      </div>
    </section>
  );
};

export default LandingHero;
