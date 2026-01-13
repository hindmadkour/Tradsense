import { useLanguage } from '@/contexts/LanguageContext';
import { partnerLogos } from '@/data/partners';

const TrustSection = () => {
  const { t } = useLanguage();
  const stats = [
    { label: t('trust_stat_traders'), value: '2,500+' },
    { label: t('trust_stat_payout'), value: '$3,200' },
    { label: t('trust_stat_winrate'), value: '81%' },
    { label: t('trust_stat_markets'), value: t('trust_stat_markets_value') },
  ];
  const logoStrip = [...partnerLogos, ...partnerLogos];

  return (
    <section className="py-16 relative">
      <div className="container mx-auto px-4">
        <div className="glass-card p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{stat.label}</div>
                <div className="text-2xl font-bold trading-number mt-2">{stat.value}</div>
              </div>
            ))}
          </div>
          <div className="marquee">
            <div className="ticker-track">
              {logoStrip.map((logo, index) => (
                <div key={`${logo.name}-${index}`} className="px-4 py-2 rounded-full border border-border/70 bg-secondary/40 text-xs text-muted-foreground">
                  {logo.logoSrc ? (
                    <img src={logo.logoSrc} alt={logo.name} className="h-4" />
                  ) : (
                    logo.name
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
