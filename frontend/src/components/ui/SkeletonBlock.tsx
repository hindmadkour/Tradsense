import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const SkeletonBlock = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("animate-pulse rounded-xl bg-muted/60", className)}
    {...props}
  />
);

export default SkeletonBlock;
