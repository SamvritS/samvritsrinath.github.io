"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const reduced = useReducedMotion();
  const spring = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  const scaleX = reduced ? scrollYProgress : spring;

  return (
    <motion.div
      data-testid="scroll-progress"
      aria-hidden
      className="scroll-progress fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-wavelength"
      style={{ scaleX }}
    />
  );
}
