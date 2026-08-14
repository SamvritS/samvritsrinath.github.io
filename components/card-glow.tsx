"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/lib/use-reduced-motion";

export function CardGlow({ className }: { className?: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: -50, y: -50, active: false });

  if (reduced) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      onPointerMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        setPos({ x: e.clientX - r.left, y: e.clientY - r.top, active: true });
      }}
      onPointerLeave={() => setPos((p) => ({ ...p, active: false }))}
      className={cn("pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]", className)}
    >
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{ opacity: pos.active ? 1 : 0 }}
      >
        <div
          className="absolute h-56 w-56 rounded-full blur-2xl"
          style={{
            left: pos.x,
            top: pos.y,
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, color-mix(in srgb, var(--accent-indigo) 26%, transparent) 0%, transparent 65%)",
          }}
        />
      </div>
    </div>
  );
}