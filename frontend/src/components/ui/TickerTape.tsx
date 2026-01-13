import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type TickerItem = {
  symbol: string;
  price: string;
  change: string;
  positive?: boolean;
};

type TickerTapeProps = HTMLAttributes<HTMLDivElement> & {
  items: TickerItem[];
};

const TickerTape = ({ items, className, ...props }: TickerTapeProps) => (
  <div className={cn("overflow-hidden rounded-full border border-border/60 bg-card/60", className)} {...props}>
    <div className="ticker-track px-4 py-2 text-sm">
      {[...items, ...items].map((item, index) => (
        <div
          key={`${item.symbol}-${index}`}
          className="flex items-center gap-2 rounded-full bg-secondary/60 px-3 py-1 text-xs"
        >
          <span className="text-muted-foreground">{item.symbol}</span>
          <span className="trading-number text-foreground">{item.price}</span>
          <span className={item.positive ? "text-success" : "text-destructive"}>{item.change}</span>
        </div>
      ))}
    </div>
  </div>
);

export default TickerTape;
