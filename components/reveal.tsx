"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function Reveal({
  children,
  className,
  delay = 0,
  mask = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  mask?: boolean;
}) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      data-testid="reveal"
      className={className}
      initial={
        mask
          ? { clipPath: "inset(0 0 100% 0)" }
          : { opacity: 0, transform: "translateY(22px)" }
      }
      whileInView={
        mask
          ? { clipPath: "inset(0 0 -15% 0)" }
          : { opacity: 1, transform: "translateY(0px)" }
      }
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{
        duration: reduced ? 0 : 0.55,
        ease: [0.16, 1, 0.3, 1],
        delay: reduced ? 0 : delay,
      }}
    >
      {children}
    </motion.div>
  );
}
