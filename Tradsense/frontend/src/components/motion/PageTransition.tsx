import { motion } from "framer-motion";
import type { PropsWithChildren } from "react";

const pageVariants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

const PageTransition = ({ children }: PropsWithChildren) => (
  <motion.main
    className="min-h-screen"
    initial="initial"
    animate="animate"
    exit="exit"
    variants={pageVariants}
    transition={{ duration: 0.4, ease: "easeOut" }}
  >
    {children}
  </motion.main>
);

export default PageTransition;
