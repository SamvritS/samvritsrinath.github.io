"use client";

import Image from "next/image";
import { VisualAnnotation } from "@/components/visuals/primitives";

const W = 640;
const H = 420;
const CX = W / 2;
const CY = H / 2;

const RINGS = [100, 150, 200];

export function LomaVerseOrbit() {
  return (
    <div className="relative mx-auto" style={{ width: W, height: H }}>
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div
          className="overflow-hidden rounded-full"
          style={{
            width: 132,
            height: 132,
            border: "1px solid var(--line-strong)",
            boxShadow: "0 0 48px -12px var(--glow)",
          }}
        >
          <Image
            src="/assets/projects/lomaverse/SolarSystem3D.jpg"
            alt="Stable solar system rendered in LomaVerse"
            width={132}
            height={132}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      <svg
        role="img"
        aria-label="Orbital anatomy of a LomaVerse solar system"
        width="100%"
        height="100%"
        viewBox={`0 0 ${W} ${H}`}
        className="absolute inset-0"
      >
        {RINGS.map((r) => (
          <ellipse
            key={r}
            cx={CX}
            cy={CY}
            rx={r}
            ry={r * 0.42}
            fill="none"
            stroke="var(--line-strong)"
            strokeWidth={1}
            strokeDasharray="3 7"
            opacity={0.6}
          />
        ))}
        <VisualAnnotation x={CX + RINGS[0] + 18} y={CY - RINGS[0] * 0.42 - 8} size={9}>
          inner orbit
        </VisualAnnotation>
        <VisualAnnotation x={CX + RINGS[2] + 18} y={CY - RINGS[2] * 0.42 - 8} size={9}>
          stable · thousands of steps
        </VisualAnnotation>

        <g transform={`translate(${CX} ${CY})`}>
          <g transform="scale(1 0.42)">
            <g className="animate-spin-slow">
              <circle cx={120} cy={0} r={4.5} fill="var(--accent-blue)" opacity={0.9} />
            </g>
            <g
              className="animate-spin-slow"
              style={{ animationDuration: "62s" }}
            >
              <circle cx={-150} cy={0} r={3.5} fill="var(--accent-indigo)" opacity={0.8} />
            </g>
            <g
              className="animate-spin-slow"
              style={{ animationDuration: "140s" }}
            >
              <circle cx={200} cy={0} r={5} fill="var(--accent-gold)" opacity={0.85} />
            </g>
            <g
              className="animate-spin-slow"
              style={{ animationDuration: "200s" }}
            >
              <circle cx={-80} cy={0} r={3} fill="var(--accent-violet)" opacity={0.7} />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}