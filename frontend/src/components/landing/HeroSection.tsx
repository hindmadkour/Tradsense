import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, TrendingUp, Shield, Zap, Activity } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const marketCards = [
  { symbol: 'BTC/USD', price: '62,480', change: '+2.4%', positive: true },
  { symbol: 'NAS100', price: '18,252', change: '+1.1%', positive: true },
  { symbol: 'USD/MAD', price: '10.12', change: '-0.4%', positive: false },
];

const HeroSection = () => {
  const { t } = useLanguage();
  return (
    <section className="relative min-h-screen overflow-hidden pt-24 pb-20">
      <div className="absolute inset-0 market-grid opacity-30" />
      <div className="absolute top-10 left-10 h-80 w-80 rounded-full bg-primary/20 blur-[160px]" />
      <div className="absolute bottom-10 right-0 h-96 w-96 rounded-full bg-success/20 blur-[160px]" />

      <div className="container mx-auto px-4 relative z-10 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm text-primary mb-6 animate-fade-in">
            <Zap className="h-4 w-4" />
            {t('hero_badge')}
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            <span className="gradient-text">{t('hero_title_line1')}</span>
            <br />
            <span className="text-3xl md:text-5xl">{t('hero_title_line2')}</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-xl mb-8">
            {t('hero_subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
            <Button variant="hero" size="xl" asChild>
              <Link to="/register">
                Start Challenge
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <a href="#pricing">
                <Play className="w-5 h-5" />
                {t('hero_view_plans')}
              </a>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-xl">
            {[
              { value: '$10M+', label: t('hero_stat_capital') },
              { value: '2,500+', label: t('hero_stat_traders') },
              { value: '85%', label: t('hero_stat_success') },
              { value: '24/7', label: t('hero_stat_risk') },
            ].map((stat) => (
              <div key={stat.label} className="glass-card p-4">
                <div className="text-2xl font-bold gradient-text trading-number">{stat.value}</div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="glass-card-elevated p-6 space-y-6 scanline">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Live Terminal</div>
                <div className="text-lg font-semibold mt-2">Momentum Scanner</div>
              </div>
              <div className="flex items-center gap-2 text-success text-sm">
                <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
                Active
              </div>
            </div>

            <div className="glass-panel p-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                <span>AI Signal Strength</span>
                <span className="text-success font-semibold">Strong</span>
              </div>
              <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                <div className="h-full w-4/5 bg-gradient-to-r from-primary to-success rounded-full" />
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                <span>Confidence</span>
                <span className="text-foreground font-semibold">92%</span>
              </div>
            </div>

            <div className="glass-panel p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">TSX Momentum</div>
                  <div className="text-xs text-muted-foreground">Multi-asset trend score</div>
                </div>
                <div className="flex items-center gap-2 text-success">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-sm font-semibold">+4.6%</span>
                </div>
              </div>
              <svg viewBox="0 0 240 60" className="w-full h-16 mt-4">
                <path
                  d="M0 52 L30 40 L60 44 L90 28 L120 32 L150 18 L180 22 L210 12 L240 8"
                  fill="none"
                  stroke="url(#grad)"
                  strokeWidth="3"
                />
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="hsl(190 92% 50%)" />
                    <stop offset="100%" stopColor="hsl(142 72% 45%)" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {marketCards.map((card) => (
                <div key={card.symbol} className="glass-panel p-3">
                  <div className="text-xs text-muted-foreground">{card.symbol}</div>
                  <div className="text-sm font-semibold trading-number">{card.price}</div>
                  <div className={`text-xs font-semibold ${card.positive ? 'text-success' : 'text-destructive'}`}>
                    {card.change}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[90%] glass-panel px-4 py-3">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <Activity className="h-4 w-4 text-primary" />
              <div className="overflow-hidden">
                <div className="ticker-track">
                  {['AAPL +1.4%', 'BTC +2.4%', 'EUR/USD -0.2%', 'TSLA +0.8%', 'XAU +0.6%', 'NAS100 +1.1%'].map((item) => (
                    <span key={item} className="px-3 py-1 rounded-full bg-secondary/60 text-foreground/80">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="absolute -top-6 -right-6 hidden lg:flex items-center gap-2 rounded-full bg-card/80 border border-border/60 px-4 py-2 text-xs text-muted-foreground">
            <Shield className="h-4 w-4 text-primary" />
            AI risk shield active
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
