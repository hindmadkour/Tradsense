import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const GlassCard = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "rounded-2xl border border-border/60 bg-card/70 backdrop-blur-xl shadow-[0_20px_45px_-30px_rgba(0,0,0,0.7)]",
      className
    )}
    {...props}
  />
);

export default GlassCard;
