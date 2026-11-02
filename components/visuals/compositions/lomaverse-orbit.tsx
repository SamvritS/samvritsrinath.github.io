"use client";

import {
  VisualAnnotation,
  VisualArrows,
  VisualEdge,
  VisualMeasurementRail,
} from "@/components/visuals/primitives";
import { LomaVerseLazy } from "@/components/demos/lazy";
import bodiesData from "@/public/assets/projects/lomaverse/bodies.json";
import type { VisualMode } from "@/lib/types";

const W = 1180;
const H = 420;

const CHAIN = ["HAMILTONIAN", "AUTODIFF", "VELOCITY-VERLET", "2D · 3D"];

const RAIL = [
  { value: "VELOCITY-VERLET", label: "integrator" },
  { value: String(bodiesData.bodies.length), label: "bodies in preset" },
  { value: `G=${bodiesData.G ?? 1}`, label: "gravitational constant" },
  { value: "LIVE", label: "simulation above" },
];

export function LomaVerseOrbit({ mode = "diagram" }: { mode?: VisualMode }) {
  if (mode === "case-study") {
    return (
      <div className="relative mx-auto min-h-[300px] w-full md:min-h-[420px]">
        <LomaVerseLazy className="h-full min-h-[300px] w-full md:min-h-[420px]" />
      </div>
    );
  }

  const stepX = 240;
  const x0 = 80;
  const midY = 150;

  return (
    <svg
      role="img"
      aria-label="LomaVerse integrator chain and preset bodies"
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
    >
      <defs>
        <VisualArrows id="arrow-lomaverse" />
      </defs>

      {CHAIN.map((stage, i) => {
        const x = x0 + i * stepX;
        return (
          <g key={stage}>
            <rect
              x={x}
              y={midY - 34}
              width={200}
              height={68}
              fill="var(--surface)"
              stroke={i === 2 ? "var(--accent)" : "var(--line-strong)"}
              strokeWidth={i === 2 ? 1.5 : 1}
            />
            <text
              x={x + 100}
              y={midY + 4}
              textAnchor="middle"
              fontSize={11}
              fontFamily="var(--font-jetbrains-mono)"
              letterSpacing="0.08em"
              fontWeight={600}
              fill="var(--ink)"
            >
              {stage}
            </text>
            {i < CHAIN.length - 1 && (
              <VisualEdge
                d={`M ${x + 200} ${midY} L ${x + stepX} ${midY}`}
                markerId="arrow-lomaverse"
                dashed={false}
                width={1.5}
              />
            )}
          </g>
        );
      })}
      <VisualAnnotation x={x0} y={midY - 52} anchor="start" size={9}>
        EQUATIONS FROM ENERGY · NO HAND-WRITTEN UPDATES
      </VisualAnnotation>

      <g fontFamily="var(--font-jetbrains-mono)">
        <text x={x0} y={268} fontSize={9} letterSpacing="0.12em" fill="var(--ink-faint)">
          PRESET BODIES · BODIES.JSON
        </text>
        <text x={x0} y={292} fontSize={9} fill="var(--ink-faint)">
          {"NAME".padEnd(12)} {"MASS".padEnd(8)} {"POSITION".padEnd(18)} VELOCITY
        </text>
        {bodiesData.bodies.map((b, i) => {
          const v = Math.hypot(...(b.velocity as [number, number, number])).toFixed(1);
          return (
            <text key={b.name} x={x0} y={314 + i * 20} fontSize={10} fill="var(--ink-soft)" className="tabular-nums">
              {(b.name as string).padEnd(12)} {String(b.mass).padEnd(8)} {(b.position as number[]).join(", ").padEnd(18)} {v}
            </text>
          );
        })}
      </g>

      <VisualMeasurementRail x={24} y={372} width={1132} items={RAIL} />
    </svg>
  );
}
