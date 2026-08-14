"use client";

import {
  VisualAnnotation,
  VisualAxis,
  VisualLegend,
} from "@/components/visuals/primitives";

const W = 700;
const H = 420;
const ORIGIN_X = 90;
const ORIGIN_Y = 330;
const MAX_X = 640;
const MAX_Y = 60;

type Point = {
  x: number;
  y: number;
  label: string;
  color: string;
  big?: boolean;
  delay: number;
};

const POINTS: Point[] = [
  { x: 150, y: 292, label: "RANDOM", color: "var(--ink-faint)", delay: 0 },
  { x: 250, y: 210, label: "LP ROUNDING", color: "var(--accent-violet)", delay: 0.12 },
  { x: 340, y: 168, label: "MCCORMICK", color: "var(--accent-blue)", delay: 0.24 },
  { x: 415, y: 150, label: "QCP", color: "var(--accent-blue)", delay: 0.36 },
  { x: 490, y: 140, label: "MILP", color: "var(--accent-indigo)", delay: 0.48 },
  { x: 200, y: 108, label: "ADP", color: "var(--accent-gold)", big: true, delay: 0.6 },
];

const GRID_X = [90, 170, 250, 330, 410, 490, 570];

function plot(p: { x: number; y: number }) {
  return { px: ORIGIN_X + p.x, py: ORIGIN_Y - p.y };
}

export function OptFantasyComparison() {
  const frontier =
    "M " +
    plot(POINTS[5]).px + " " + plot(POINTS[5]).py +
    " L " + plot(POINTS[3]).px + " " + plot(POINTS[3]).py +
    " L " + plot(POINTS[4]).px + " " + plot(POINTS[4]).py;

  return (
    <svg
      role="img"
      aria-label="OptFantasy method comparison on runtime and score"
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="mx-auto"
    >
      {GRID_X.map((gx) => (
        <line
          key={gx}
          x1={gx}
          y1={ORIGIN_Y}
          x2={gx}
          y2={MAX_Y}
          stroke="var(--line)"
          strokeWidth={1}
        />
      ))}
      <line x1={ORIGIN_X} y1={ORIGIN_Y} x2={MAX_X} y2={ORIGIN_Y} stroke="var(--line)" strokeWidth={1} />
      <path
        d={frontier}
        fill="none"
        stroke="var(--accent-gold)"
        strokeOpacity={0.5}
        strokeDasharray="5 5"
        strokeWidth={1.2}
      />
      <VisualAxis
        x1={ORIGIN_X}
        y1={ORIGIN_Y}
        x2={MAX_X}
        y2={ORIGIN_Y}
        label="solve time →"
      />
      <VisualAxis
        x1={ORIGIN_X}
        y1={MAX_Y}
        x2={ORIGIN_X}
        y2={ORIGIN_Y}
        horizontal={false}
        label="out-of-sample score →"
      />
      {POINTS.map((p) => {
        const { px, py } = plot(p);
        return (
          <g key={p.label} className="animate-pop" style={{ animationDelay: `${p.delay}s` }}>
            <circle
              cx={px}
              cy={py}
              r={p.big ? 9 : 6}
              fill={p.color}
              opacity={p.big ? 1 : 0.75}
            />
            <text
              x={px + (p.big ? 14 : 10)}
              y={py + 3}
              fontSize={p.big ? 11 : 9}
              fontFamily="var(--font-geist-mono)"
              letterSpacing="0.08em"
              fill={p.big ? "var(--accent-gold)" : "var(--ink-soft)"}
              fontWeight={p.big ? 700 : 500}
            >
              {p.label}
            </text>
          </g>
        );
      })}
      <VisualAnnotation x={plot(POINTS[5]).px} y={plot(POINTS[5]).py - 20} color="var(--accent-gold)" size={10}>
        ADP · 2,089 PTS · {"<"}0.1S
      </VisualAnnotation>
      <VisualLegend
        x={ORIGIN_X + 6}
        y={H - 78}
        items={[
          { label: "heuristic", color: "var(--accent-gold)", weight: 2 },
          { label: "exact solvers", color: "var(--accent-indigo)" },
          { label: "linear relaxations", color: "var(--accent-violet)" },
          { label: "frontier", color: "var(--accent-gold)" },
        ]}
      />
    </svg>
  );
}