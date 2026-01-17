import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";

const LandingFooter = () => (
  <footer className="border-t border-border/60 bg-background/80">
    <div className="container mx-auto px-4 py-12 grid gap-8 md:grid-cols-[1.3fr_1fr_1fr]">
      <div>
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[image:var(--gradient-primary)]">
            <TrendingUp className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold">TradeSense</span>
        </Link>
        <p className="text-muted-foreground mt-4 max-w-sm">
          A next-generation prop trading platform with AI execution, risk intelligence, and real-time market access.
        </p>
      </div>
      <div className="space-y-3 text-sm text-muted-foreground">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Product</div>
        <a href="#product" className="block hover:text-foreground">Platform</a>
        <a href="#markets" className="block hover:text-foreground">Markets</a>
        <a href="#pricing" className="block hover:text-foreground">Pricing</a>
        <Link to="/contact" className="block hover:text-foreground">Contact</Link>
      </div>
      <div className="space-y-3 text-sm text-muted-foreground">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Legal</div>
        <Link to="/terms" className="block hover:text-foreground">Terms</Link>
        <Link to="/privacy" className="block hover:text-foreground">Privacy</Link>
        <Link to="/risk" className="block hover:text-foreground">Risk Disclosure</Link>
      </div>
    </div>
    <div className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
      © 2026 TradeSense AI. All rights reserved.
    </div>
  </footer>
);

export default LandingFooter;
