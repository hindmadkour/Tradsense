import { motion } from "framer-motion";
import type { PropsWithChildren } from "react";

type FadeInProps = PropsWithChildren<{
  delay?: number;
  className?: string;
}>;

const FadeIn = ({ children, delay = 0, className }: FadeInProps) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.5, ease: "easeOut", delay }}
  >
    {children}
  </motion.div>
);

export default FadeIn;
