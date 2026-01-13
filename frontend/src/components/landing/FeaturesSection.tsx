import {
  Brain,
  LineChart,
  Shield,
  Trophy,
  GraduationCap,
  Users
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Assistance Trading IA',
    description: 'Signaux Achat/Vente/Stop directement sur la page. Plans de trade personnalisés et alertes de détection de risque.',
    color: 'from-primary to-blue-400',
  },
  {
    icon: LineChart,
    title: "Hub d'Actualités en Direct",
    description: 'Actualités financières en temps réel, résumés de marché par IA et alertes d\'événements économiques.',
    color: 'from-sky-500 to-cyan-400',
  },
  {
    icon: Shield,
    title: 'Gestion des Risques IA',
    description: 'Tri intelligent qui filtre automatiquement les bons trades des risqués pour un parcours plus sûr.',
    color: 'from-success to-[#7b1e2b]',
  },
  {
    icon: Users,
    title: 'Zone Communautaire',
    description: 'Partagez des stratégies, rejoignez des groupes thématiques et apprenez des experts.',
    color: 'from-warning to-orange-400',
  },
  {
    icon: GraduationCap,
    title: 'MasterClass Academy',
    description: 'Cours complets du débutant à l\'avancé, webinaires en direct et parcours d\'apprentissage assistés par IA.',
    color: 'from-amber-500 to-orange-400',
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/40 to-background" />

      <div className="container mx-auto px-4 relative z-10 grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-start">
        <div>
          <div className="section-title mb-4">Platform Overview</div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            A modern prop desk built for{' '}
            <span className="gradient-text">precision trading</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            From AI signals to risk automation, everything is structured like a real trading desk. Stay fast, stay disciplined.
          </p>
          <div className="mt-8 glass-panel p-6">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Signal latency</span>
              <span className="text-success font-semibold">&lt; 200ms</span>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>Risk alignment</span>
              <span className="text-primary font-semibold">Auto-enforced</span>
            </div>
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <span>Markets</span>
              <span className="text-foreground font-semibold">BVC, FX, Crypto, Nasdaq</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card p-6 group hover:border-primary/30 transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className="flex items-center justify-between mb-5">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} p-3 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-full h-full text-white" />
                </div>
                <div className="text-xs text-muted-foreground">0{index + 1}</div>
              </div>
              <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
