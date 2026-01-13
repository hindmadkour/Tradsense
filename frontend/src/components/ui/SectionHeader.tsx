import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type SectionHeaderProps = HTMLAttributes<HTMLDivElement> & {
  kicker?: string;
  title: string;
  subtitle?: string;
};

const SectionHeader = ({ kicker, title, subtitle, className, ...props }: SectionHeaderProps) => (
  <div className={cn("space-y-4", className)} {...props}>
    {kicker ? (
      <div className="text-xs uppercase tracking-[0.35em] text-muted-foreground">{kicker}</div>
    ) : null}
    <h2 className="text-3xl md:text-4xl font-semibold text-foreground">{title}</h2>
    {subtitle ? <p className="text-muted-foreground text-lg max-w-2xl">{subtitle}</p> : null}
  </div>
);

export default SectionHeader;
