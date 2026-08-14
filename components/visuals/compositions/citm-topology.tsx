"use client";

import {
  VisualAnnotation,
  VisualArrows,
  VisualEdge,
  VisualSignal,
} from "@/components/visuals/primitives";

const W = 700;
const H = 250;
const CY = 120;

const STOPS = [
  { x: 80, label: "USER" },
  { x: 220, label: "ISP · A" },
  { x: 360, label: "COUNTRY X" },
  { x: 500, label: "COUNTRY B" },
  { x: 640, label: "GOVERNMENT" },
] as const;

function arc(a: number, b: number) {
  const mx = (a + b) / 2;
  return `M ${a} ${CY} Q ${mx} ${CY - 30} ${b} ${CY}`;
}

export function CitmTopology() {
  const arrowId = "arrow-citm";
  const segments = STOPS.slice(0, -1).map((s, i) => ({
    d: arc(s.x, STOPS[i + 1].x),
  }));
  const travelPath = segments.map(({ d }) => d).join(" ");
  const mid = STOPS[2];

  return (
    <svg
      role="img"
      aria-label="Network path with a country in the middle"
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="mx-auto"
    >
      <defs>
        <VisualArrows id={arrowId} />
      </defs>
      {segments.map(({ d }, i) => (
        <VisualEdge key={i} d={d} markerId={arrowId} opacity={0.3} width={1.4} />
      ))}
      {STOPS.map((s, i) => {
        const inBetween = i === 2;
        return (
          <g key={s.label}>
            <circle
              cx={s.x}
              cy={CY}
              r={inBetween ? 27 : 19}
              fill={inBetween ? "color-mix(in srgb, var(--accent-gold) 14%, transparent)" : "var(--surface)"}
              stroke={inBetween ? "var(--accent-gold)" : "var(--line-strong)"}
              strokeWidth={inBetween ? 1.6 : 1}
              className={inBetween ? "animate-pulse-soft" : undefined}
            />
            <circle cx={s.x} cy={CY} r={inBetween ? 27 : 19} fill="none" stroke={inBetween ? "var(--accent-gold)" : undefined} strokeWidth={4} opacity={inBetween ? 0.12 : 0} />
            <text
              x={s.x}
              y={CY + 3}
              textAnchor="middle"
              fontSize={inBetween ? 10 : 9}
              fontFamily="var(--font-geist-mono)"
              letterSpacing="0.08em"
              fontWeight={inBetween ? 700 : 500}
              fill={inBetween ? "var(--accent-gold)" : "var(--ink)"}
            >
              {s.label}
            </text>
          </g>
        );
      })}
      <VisualSignal d={travelPath} dur={4.5} color="var(--accent-blue)" r={4} />
      <VisualAnnotation x={mid.x} y={CY - 52} color="var(--accent-gold)" size={10}>
        THE COUNTRY IN THE MIDDLE
      </VisualAnnotation>
      <VisualAnnotation x={mid.x} y={CY + 52} size={9}>
        path transits a third state
      </VisualAnnotation>
    </svg>
  );
}