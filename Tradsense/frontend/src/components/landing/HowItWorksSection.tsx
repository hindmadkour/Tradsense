import { CreditCard, Target, Award, Wallet } from 'lucide-react';

const steps = [
  {
    icon: CreditCard,
    step: '01',
    title: 'Choose a Plan',
    description: 'Select the challenge that matches your trading experience and goals. Pay a one-time fee to start.',
  },
  {
    icon: Target,
    step: '02',
    title: 'Pass the Challenge',
    description: 'Trade on real market data. Hit 10% profit without exceeding drawdown limits. AI assists you throughout.',
  },
  {
    icon: Award,
    step: '03',
    title: 'Get Funded',
    description: 'Once you pass, you\'re verified as a skilled trader. Receive a funded account to trade with our capital.',
  },
  {
    icon: Wallet,
    step: '04',
    title: 'Trade & Earn',
    description: 'Keep up to 80% of the profits you make. Scale your account as you prove consistent profitability.',
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      <div className="container mx-auto px-4 relative z-10 grid lg:grid-cols-[0.9fr_1.1fr] gap-12 items-start">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            From registration to funded trader in four simple steps. Our AI-powered platform guides you every step of the way.
          </p>
          <div className="mt-8 glass-panel p-6">
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <Target className="h-4 w-4 text-primary" />
              Profit target reached? Get funded in days, not months.
            </div>
            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-3">
              <Award className="h-4 w-4 text-success" />
              Scale capital as you prove consistency.
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {steps.map((step, index) => (
            <div key={index} className="relative glass-card p-6 flex gap-4 items-start">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-[#7b1e2b]/20 flex items-center justify-center">
                  <step.icon className="w-6 h-6 text-primary" />
                </div>
                {index < steps.length - 1 && (
                  <div className="w-px h-10 bg-gradient-to-b from-primary/50 to-transparent mt-3" />
                )}
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  Step {step.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
