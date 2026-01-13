import DashboardLayout from "@/components/dashboard/DashboardLayout";
import PageTransition from "@/components/motion/PageTransition";
import FadeIn from "@/components/motion/FadeIn";
import GlassCard from "@/components/ui/GlassCard";
import SectionHeader from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/button";
import { Check, Star } from "lucide-react";

const plans = [
  {
    name: "Starter",
    account: "$5,000",
    price: "200 DH",
    features: ["BVC + Crypto (delayed)", "Basic charts", "5 trades/day", "Email support"],
  },
  {
    name: "Pro",
    account: "$10,000",
    price: "500 DH",
    featured: true,
    features: ["Live data", "AI signals", "Risk automation", "Priority support"],
  },
  {
    name: "Elite",
    account: "$25,000",
    price: "1,000 DH",
    features: ["Unlimited signals", "Advanced analytics", "Bot sandbox", "1:1 coaching"],
  },
];

const comparison = [
  { label: "Profit target", starter: "10%", pro: "10%", elite: "8%" },
  { label: "Daily drawdown", starter: "5%", pro: "5%", elite: "4%" },
  { label: "Max drawdown", starter: "10%", pro: "10%", elite: "8%" },
  { label: "Challenge length", starter: "30 days", pro: "30 days", elite: "45 days" },
  { label: "Profit split", starter: "75%", pro: "80%", elite: "85%" },
];

const Challenge = () => {
  return (
    <PageTransition>
      <DashboardLayout>
        <div className="space-y-10">
          <SectionHeader
            kicker="Challenges"
            title="Choose the plan that matches your capital goals"
            subtitle="Pass the evaluation and unlock a funded account with a clear, transparent rule-set."
          />

          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan, index) => (
              <FadeIn key={plan.name} delay={index * 0.08}>
                <GlassCard className={`p-6 space-y-5 ${plan.featured ? "border-primary/60" : ""}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-lg font-semibold">{plan.name}</div>
                      <div className="text-sm text-muted-foreground">{plan.account} account</div>
                    </div>
                    {plan.featured ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                        <Star className="h-3 w-3" />
                        Most popular
                      </span>
                    ) : null}
                  </div>

                  <div className="text-3xl font-semibold">{plan.price}</div>

                  <div className="space-y-3">
                    {plan.features.map((item) => (
                      <div key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success/20">
                          <Check className="h-3 w-3 text-success" />
                        </span>
                        {item}
                      </div>
                    ))}
                  </div>

                  <Button variant={plan.featured ? "hero" : "outline"} className="w-full">
                    Start Challenge
                  </Button>
                </GlassCard>
              </FadeIn>
            ))}
          </div>

          <GlassCard className="p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Feature comparison</div>
            <div className="mt-6 grid grid-cols-[1.3fr_repeat(3,1fr)] gap-3 text-sm">
              <div className="text-muted-foreground">Challenge rules</div>
              {plans.map((plan) => (
                <div key={plan.name} className="text-center font-semibold">
                  {plan.name}
                </div>
              ))}
              {comparison.map((row) => (
                <div key={row.label} className="contents">
                  <div className="py-3 text-muted-foreground">{row.label}</div>
                  <div className="py-3 text-center">{row.starter}</div>
                  <div className="py-3 text-center">{row.pro}</div>
                  <div className="py-3 text-center">{row.elite}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </DashboardLayout>
    </PageTransition>
  );
};

export default Challenge;
