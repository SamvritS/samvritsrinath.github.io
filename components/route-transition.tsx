"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, useReducedMotion } from "motion/react";

// The layout mounts once. This flag suppresses the first-load fade and enables
// it on later pathname changes, without a render-time ref or a mount setState.
let hasMounted = false;

export function RouteTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduced = useReducedMotion();

  useEffect(() => {
    hasMounted = true;
    return () => {
      hasMounted = false;
    };
  }, []);

  const initial = hasMounted && !reduced ? { opacity: 0 } : false;

  return (
    <motion.main
      id="main-content"
      className="relative z-1"
      key={pathname}
      data-testid="route-transition"
      initial={initial}
      animate={{ opacity: 1 }}
      transition={{
        duration: reduced ? 0 : 0.22,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      {children}
    </motion.main>
  );
}
