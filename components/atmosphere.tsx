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

type Constellation = {
  points: [number, number][];
  delay: number;
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

  const constellations: Constellation[] = (() => {
    const rand = mulberry32(7);
    return Array.from({ length: 3 }, (_, i) => {
      const cx = rand() * 100;
      const cy = rand() * 100;
      const count = 4 + Math.floor(rand() * 3);
      const points: [number, number][] = Array.from({ length: count }, () => [
        cx + (rand() - 0.5) * 24,
        cy + (rand() - 0.5) * 16,
      ]);
      return { points, delay: i * 1.2 };
    });
  })();

  const shooting = [
    { top: "12%", left: "78%", delay: 0, distance: "26rem", fall: "9rem", angle: "-16deg" },
    { top: "30%", left: "88%", delay: 4.5, distance: "30rem", fall: "11rem", angle: "-20deg" },
    { top: "64%", left: "82%", delay: 7, distance: "24rem", fall: "8rem", angle: "-14deg" },
  ];

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

      {/* Constellations */}
      <svg
        aria-hidden
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
      >
        {constellations.map((c, i) => (
          <g key={i} className="animate-twinkle" style={{ animationDelay: `${c.delay}s`, animationDuration: "8s" }}>
            {c.points.slice(0, -1).map((p, j) => {
              const q = c.points[j + 1];
              return (
                <line
                  key={j}
                  x1={p[0]}
                  y1={p[1]}
                  x2={q[0]}
                  y2={q[1]}
                  stroke="color-mix(in srgb, var(--accent-indigo) 22%, transparent)"
                  strokeWidth={0.12}
                />
              );
            })}
            {c.points.map((p, j) => (
              <circle
                key={j}
                cx={p[0]}
                cy={p[1]}
                r={0.45}
                fill="color-mix(in srgb, var(--accent-indigo) 55%, transparent)"
              />
            ))}
          </g>
        ))}
      </svg>

      {/* Orbit rings */}
      <div
        aria-hidden
        className={cn("absolute -left-32 top-10 h-[26rem] w-[26rem]", reduced && "animate-none")}
      >
        <div className="animate-spin-slow absolute inset-0">
          <div className="absolute inset-0 rounded-full border border-dashed border-[color-mix(in_srgb,var(--accent-violet)_18%,transparent)]" />
          <span className="absolute left-1/2 top-0 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/50" />
        </div>
        <div className="absolute left-[38%] top-[38%] h-[24%] w-[24%] rounded-full bg-[color-mix(in_srgb,var(--accent-violet)_10%,transparent)]" />
      </div>
      <div
        aria-hidden
        className={cn("absolute -right-40 bottom-16 h-[34rem] w-[34rem]", reduced && "animate-none")}
      >
        <div className="animate-spin-slow absolute inset-0" style={{ animationDuration: "150s" }}>
          <div className="absolute inset-0 rounded-full border border-dashed border-[color-mix(in_srgb,var(--accent-blue)_16%,transparent)]" />
          <span className="absolute left-1/2 top-0 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-azure/50" />
        </div>
        <div className="absolute left-[30%] top-[30%] h-[40%] w-[40%] rounded-full border border-[color-mix(in_srgb,var(--accent-blue)_14%,transparent)]" />
      </div>

      {/* Shooting stars */}
      {!reduced &&
        shooting.map((s, i) => (
          <span
            key={i}
            aria-hidden
            className="animate-shoot absolute h-px w-36 bg-[linear-gradient(to_right,transparent,var(--star)_75%)]"
            style={
              {
                top: s.top,
                left: s.left,
                animationDelay: `${s.delay}s`,
                "--shoot-distance": s.distance,
                "--shoot-fall": s.fall,
                "--shoot-angle": s.angle,
              } as React.CSSProperties
            }
          />
        ))}

      {/* Bottom vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(100%_50%_at_50%_110%,color-mix(in_srgb,var(--void)_60%,transparent)_0%,transparent_60%)]" />
    </div>
  );
}