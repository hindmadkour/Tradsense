import { Shield, TrendingUp, GraduationCap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const PillarsSection = () => {
  const { t } = useLanguage();
  const pillars = [
    {
      icon: TrendingUp,
      title: t('pillars_trade_title'),
      description: t('pillars_trade_desc'),
    },
    {
      icon: Shield,
      title: t('pillars_risk_title'),
      description: t('pillars_risk_desc'),
    },
    {
      icon: GraduationCap,
      title: t('pillars_learn_title'),
      description: t('pillars_learn_desc'),
    },
  ];

  return (
    <section className="py-20 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="section-title mb-3">{t('pillars_label')}</div>
          <h2 className="text-3xl md:text-4xl font-bold">{t('pillars_title')}</h2>
          <p className="text-muted-foreground mt-3">{t('pillars_subtitle')}</p>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="hidden md:block absolute top-10 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          {pillars.map((pillar, index) => (
            <div key={pillar.title} className="glass-card p-6 hover:-translate-y-1 transition-transform">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
                  <pillar.icon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-xs text-muted-foreground">0{index + 1}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{pillar.title}</h3>
              <p className="text-muted-foreground text-sm">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PillarsSection;
