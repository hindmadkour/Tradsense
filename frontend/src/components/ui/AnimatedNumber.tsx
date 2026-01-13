import { animate, useMotionValue } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type AnimatedNumberProps = {
  value: number;
  duration?: number;
  format?: (value: number) => string;
  className?: string;
};

const AnimatedNumber = ({ value, duration = 1.4, format, className }: AnimatedNumberProps) => {
  const motionValue = useMotionValue(0);
  const [display, setDisplay] = useState("0");

  const formatter = useMemo(() => {
    if (format) return format;
    return (val: number) => Math.round(val).toLocaleString();
  }, [format]);

  useEffect(() => {
    const controls = animate(motionValue, value, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => setDisplay(formatter(latest)),
    });
    return () => controls.stop();
  }, [value, duration, formatter, motionValue]);

  return <span className={className}>{display}</span>;
};

export default AnimatedNumber;
