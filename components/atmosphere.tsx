"use client";

import { useEffect, useRef } from "react";
import { cn, mulberry32 } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";

type Star = {
  id: number;
  left: number;
  top: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
};

export function Atmosphere() {
  const reduced = useReducedMotion();
  const nebulaRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  // Deterministic stars — identical on server and client.
  const stars: Star[] = (() => {
    const rand = mulberry32(42);
    return Array.from({ length: 150 }, (_, i) => ({
      id: i,
      left: rand() * 100,
      top: rand() * 100,
      size: rand() * 1.8 + 0.6,
      delay: rand() * 6,
      duration: 4 + rand() * 6,
      opacity: 0.35 + rand() * 0.55,
    }));
  })();

  useEffect(() => {
    if (reduced) return;
    const el = nebulaRef.current;
    const glow = glowRef.current;
    if (!el || !glow) return;
    let targetX = 0;
    let targetY = 0;
    let glowX = -100;
    let glowY = -100;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      targetX = (e.clientX / window.innerWidth - 0.5) * 80;
      targetY = (e.clientY / window.innerHeight - 0.5) * 80;
      glowX = e.clientX;
      glowY = e.clientY;
      if (!raf) {
        raf = requestAnimationFrame(() => {
          el.style.transform = `translate3d(${targetX.toFixed(2)}px, ${targetY.toFixed(2)}px, 0)`;
          glow.style.left = `${glowX.toFixed(1)}px`;
          glow.style.top = `${glowY.toFixed(1)}px`;
          raf = 0;
        });
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      style={{ backgroundColor: "var(--void)" }}
    >
      {/* Base gradient wash */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,color-mix(in_srgb,var(--accent-indigo)_20%,transparent)_0%,transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(90%_70%_at_85%_100%,color-mix(in_srgb,var(--accent-violet)_17%,transparent)_0%,transparent_60%)]" />

      {/* Cursor-responsive nebula field */}
      <div
        ref={nebulaRef}
        className={cn(
          "absolute inset-[-6%] transition-transform duration-[1200ms] ease-out",
          reduced && "transition-none",
        )}
      >
        <div className="absolute left-[8%] top-[12%] h-[38vh] w-[36vw] rounded-full bg-[color-mix(in_srgb,var(--accent-indigo)_26%,transparent)] blur-[110px] animate-drift" />
        <div
          className="absolute right-[6%] top-[32%] h-[34vh] w-[30vw] rounded-full bg-[color-mix(in_srgb,var(--accent-blue)_22%,transparent)] blur-[110px] animate-drift"
          style={{ animationDelay: "-9s" }}
        />
        <div
          className="absolute bottom-[8%] left-[28%] h-[32vh] w-[34vw] rounded-full bg-[color-mix(in_srgb,var(--accent-violet)_20%,transparent)] blur-[120px] animate-drift"
          style={{ animationDelay: "-17s" }}
        />
      </div>

      {/* Pointer-follow glow */}
      <div
        ref={glowRef}
        aria-hidden
        className={cn(
          "absolute h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px]",
          reduced && "hidden",
        )}
        style={{
          background:
            "radial-gradient(circle, color-mix(in srgb, var(--accent-indigo) 22%, transparent) 0%, transparent 60%)",
          left: "-9999px",
          top: "-9999px",
        }}
      />

      {/* Faint coordinate grid */}
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 75%)",
        }}
      />

      {/* Star field */}
      <div className="absolute inset-0">
        {stars.map((s) => (
          <span
            key={s.id}
            className="absolute rounded-full animate-twinkle"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              backgroundColor: "var(--star)",
              opacity: s.opacity,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Bottom vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(100%_50%_at_50%_110%,color-mix(in_srgb,var(--void)_60%,transparent)_0%,transparent_60%)]" />
    </div>
  );
}