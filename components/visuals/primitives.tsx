"use client";

import { useReducedMotion } from "@/lib/use-reduced-motion";

export type VisualNodeKind = "source" | "process" | "storage" | "output";

export const visualNodeColor: Record<VisualNodeKind, string> = {
  source: "var(--accent-blue)",
  process: "var(--accent-indigo)",
  storage: "var(--accent-violet)",
  output: "var(--accent-gold)",
};

export function VisualNode({
  x,
  y,
  w,
  h,
  label,
  sublabel,
  kind = "process",
  radius = 14,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sublabel?: string;
  kind?: VisualNodeKind;
  radius?: number;
}) {
  const color = visualNodeColor[kind];
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect
        width={w}
        height={h}
        rx={radius}
        fill="var(--surface)"
        stroke="var(--line-strong)"
      />
      <circle cx={16} cy={h / 2} r={3} fill={color} className="animate-pulse-soft" />
      <text
        x={30}
        y={h / 2 - 6}
        fontSize={12}
        fontFamily="var(--font-geist-mono)"
        letterSpacing="0.08em"
        fill="var(--ink)"
        fontWeight={600}
      >
        {label}
      </text>
      {sublabel && (
        <text
          x={30}
          y={h / 2 + 14}
          fontSize={10}
          fontFamily="var(--font-geist-sans)"
          fill="var(--ink-faint)"
        >
          {sublabel}
        </text>
      )}
    </g>
  );
}

export function VisualEdge({
  d,
  markerId,
  dashed = true,
  color = "var(--accent-indigo)",
  opacity = 0.35,
  width = 1,
}: {
  d: string;
  markerId?: string;
  dashed?: boolean;
  color?: string;
  opacity?: number;
  width?: number;
}) {
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeOpacity={opacity}
      strokeDasharray={dashed ? "4 6" : undefined}
      className={dashed ? "animate-dash" : undefined}
      markerEnd={markerId ? `url(#${markerId})` : undefined}
      vectorEffect="non-scaling-stroke"
    />
  );
}

export function VisualSignal({
  d,
  dur = 2.8,
  delay = 0,
  color = "var(--accent-indigo)",
  r = 3.5,
  opacity = 0.9,
}: {
  d: string;
  dur?: number;
  delay?: number;
  color?: string;
  r?: number;
  opacity?: number;
}) {
  const reduced = useReducedMotion();
  if (reduced) return null;
  return (
    <g opacity={opacity}>
      <circle r={r * 2.6} fill={color} opacity={0.16}>
        <animateMotion dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" path={d} />
      </circle>
      <circle r={r} fill={color}>
        <animateMotion dur={`${dur}s`} begin={`${delay}s`} repeatCount="indefinite" path={d} />
      </circle>
    </g>
  );
}

export function VisualArrows({
  id,
  color = "var(--accent-indigo)",
  opacity = 0.6,
  orient = "auto",
}: {
  id: string;
  color?: string;
  opacity?: number;
  orient?: "auto" | "auto-start-reverse";
}) {
  return (
    <marker
      id={id}
      viewBox="0 0 8 8"
      refX="7"
      refY="4"
      markerWidth="7"
      markerHeight="7"
      orient={orient}
    >
      <path d="M0,0 L8,4 L0,8 z" fill={color} opacity={opacity} />
    </marker>
  );
}

export function VisualAxis({
  x1,
  y1,
  x2,
  y2,
  label,
  horizontal = true,
  color = "var(--ink-faint)",
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  label?: string;
  horizontal?: boolean;
  color?: string;
}) {
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="var(--line-strong)"
        strokeWidth={1}
      />
      {label && (
        <text
          x={horizontal ? (x1 + x2) / 2 : y1 - 18}
          y={horizontal ? y2 + 18 : (y1 + y2) / 2}
          fontSize={10}
          fontFamily="var(--font-geist-mono)"
          letterSpacing="0.1em"
          fill={color}
          textAnchor={horizontal ? "middle" : "start"}
        >
          {label}
        </text>
      )}
    </g>
  );
}

export function VisualLegend({
  items,
  x,
  y,
}: {
  items: { label: string; color: string; weight?: number }[];
  x: number;
  y: number;
}) {
  return (
    <g fontFamily="var(--font-geist-mono)" fontSize={9} fill="var(--ink-faint)">
      {items.map((item, i) => (
        <g key={item.label} transform={`translate(${x} ${y + i * 18})`}>
          <line
            x1={0}
            y1={0}
            x2={16}
            y2={0}
            stroke={item.color}
            strokeWidth={item.weight ?? 1}
            opacity={0.7}
          />
          <text x={24} y={3}>
            {item.label}
          </text>
        </g>
      ))}
    </g>
  );
}

export function VisualAnnotation({
  x,
  y,
  children,
  color = "var(--ink-soft)",
  size = 10,
  anchor = "middle",
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  color?: string;
  size?: number;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text
      x={x}
      y={y}
      fontSize={size}
      fontFamily="var(--font-geist-mono)"
      letterSpacing="0.08em"
      fill={color}
      textAnchor={anchor}
    >
      {children}
    </text>
  );
}
