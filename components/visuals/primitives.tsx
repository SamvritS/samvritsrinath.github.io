"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

export type VisualNodeKind = "source" | "process" | "storage" | "output";

export type VisualNodeState =
  | "idle"
  | "active"
  | "inspecting"
  | "selected"
  | "bottleneck"
  | "degraded"
  | "verified"
  | "completed";

export { VisualFrame } from "@/components/visuals/visual-frame";

const VisualFigureContext = createContext(false);

export const VisualFigureProvider = VisualFigureContext.Provider;

export function useIsFigure() {
  return useContext(VisualFigureContext);
}

// ponytail: per-section hue tints a 90/65/45% ink ramp; full hue marks output, wavelength stays reserved for highlight
export const visualNodeColor: Record<VisualNodeKind, string> = {
  source: "color-mix(in srgb, var(--hue, var(--ink)) 90%, var(--ink))",
  process: "color-mix(in srgb, var(--hue, var(--ink)) 65%, var(--ink))",
  storage: "color-mix(in srgb, var(--hue, var(--ink)) 45%, var(--ink))",
  output: "var(--hue, var(--ink))",
};

export function VisualNode({
  x,
  y,
  w,
  h,
  label,
  sublabel,
  kind = "process",
  highlight = false,
  state = highlight ? "selected" : "idle",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sublabel?: string;
  kind?: VisualNodeKind;
  highlight?: boolean;
  state?: VisualNodeState;
}) {
  const color = highlight ? "var(--wavelength)" : visualNodeColor[kind];
  const accentuated =
    highlight ||
    state === "selected" ||
    state === "inspecting" ||
    state === "bottleneck" ||
    state === "degraded";
  return (
    <g transform={`translate(${x} ${y})`} data-state={state}>
      {kind === "storage" && (
        <>
          <rect x={4} y={-5} width={w} height={h} fill="var(--void)" stroke="var(--line)" />
          <rect x={2} y={-2} width={w} height={h} fill="var(--void)" stroke="var(--line-strong)" />
        </>
      )}
      <rect
        width={w}
        height={h}
        rx={0}
        fill="var(--surface)"
        stroke={accentuated ? "var(--wavelength)" : "var(--line-strong)"}
        strokeWidth={accentuated ? 1.5 : 1}
      />
      {kind === "source" && (
        <path d={`M0 ${h / 2} H11`} stroke={color} strokeWidth={1.5} />
      )}
      {kind === "process" && (
        <path d={`M${w - 12} 10 V${h - 10}`} stroke="var(--line)" strokeWidth={1} />
      )}
      {kind === "storage" && (
        <path d={`M${w - 18} 12 H${w - 6} M${w - 18} 17 H${w - 6}`} stroke="var(--line-strong)" strokeWidth={1} />
      )}
      {kind === "output" && (
        <path d={`M${w} ${h / 2} H${w + 10}`} stroke={color} strokeWidth={1.5} />
      )}
      <circle cx={16} cy={h / 2} r={3} fill={color} />
      {kind === "output" && !highlight && (
        <circle cx={16} cy={h / 2} r={3 * 0.45} fill="var(--wavelength)" />
      )}
      <text
        x={30}
        y={h / 2 - 6}
        fontSize={12}
        fontFamily="var(--font-jetbrains-mono)"
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
          fontFamily="var(--font-sans)"
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
  channel = "link",
  dashed = channel === "link",
  color = "color-mix(in srgb, var(--hue, var(--ink)) 50%, var(--line-strong))",
  opacity = 0.35,
  width = channel === "bus" ? 1.6 : 1,
}: {
  d: string;
  markerId?: string;
  channel?: "bus" | "link" | "path";
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
      markerEnd={markerId ? `url(#${markerId})` : undefined}
      vectorEffect="non-scaling-stroke"
    />
  );
}

export function VisualSignal({
  d,
  dur = 2.8,
  delay = 0,
  color = "var(--hue, var(--wavelength))",
  r = 3.5,
  opacity = 0.9,
  once = false,
  testId,
}: {
  d: string;
  dur?: number;
  delay?: number;
  color?: string;
  r?: number;
  opacity?: number;
  once?: boolean;
  testId?: string;
}) {
  const reduced = useReducedMotion();
  const figure = useIsFigure();
  const ref = useRef<SVGGElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const svg = ref.current?.ownerSVGElement;
    if (!svg || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        if (once) {
          if (started.current) return;
          started.current = true;
          ref.current?.querySelectorAll("circle").forEach((node) => {
            node.setAttribute("visibility", "visible");
          });
          ref.current?.querySelectorAll("animateMotion").forEach((node) => {
            const animation = node as SVGAnimationElement;
            if (delay > 0) animation.beginElementAt(delay);
            else animation.beginElement();
          });
          return;
        }
        svg.unpauseAnimations();
      } else if (!once) {
        svg.pauseAnimations();
      }
    });
    observer.observe(svg);
    return () => observer.disconnect();
  }, [delay, once]);

  if (reduced || figure) return null;
  return (
    <g ref={ref} data-testid={testId} opacity={opacity}>
      <circle
        r={r * 2.6}
        fill={color}
        opacity={0.16}
        visibility={once ? "hidden" : undefined}
      >
        <animateMotion
          dur={`${dur}s`}
          begin={once ? "indefinite" : `${delay}s`}
          repeatCount={once ? "1" : "indefinite"}
          fill={once ? "freeze" : undefined}
          path={d}
        />
      </circle>
      <circle r={r} fill={color} visibility={once ? "hidden" : undefined}>
        <animateMotion
          dur={`${dur}s`}
          begin={once ? "indefinite" : `${delay}s`}
          repeatCount={once ? "1" : "indefinite"}
          fill={once ? "freeze" : undefined}
          path={d}
        />
      </circle>
    </g>
  );
}

export function VisualArrows({
  id,
  color = "var(--wavelength)",
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
          fontFamily="var(--font-jetbrains-mono)"
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
    <g fontFamily="var(--font-jetbrains-mono)" fontSize={9} fill="var(--ink-faint)">
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

export function VisualHotspot({
  x,
  y,
  w,
  h,
  label,
  active,
  selected = false,
  onHot,
  onSelect,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  active: boolean;
  selected?: boolean;
  onHot: (label: string | null) => void;
  onSelect?: (label: string) => void;
}) {
  const [hot, setHot] = useState(false);
  const dataState = selected ? "selected" : hot ? "inspecting" : active ? "active" : "idle";
  const enter = () => {
    setHot(true);
    onHot(label);
  };
  const leave = () => {
    setHot(false);
    onHot(null);
  };
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      fill="transparent"
      data-testid="topology-node"
      data-state={dataState}
      tabIndex={0}
      role="button"
      aria-label={label}
      aria-pressed={selected}
      className="visual-hotspot cursor-pointer focus:outline-none"
      onMouseEnter={enter}
      onMouseLeave={leave}
      onFocus={enter}
      onBlur={leave}
      onClick={() => onSelect?.(label)}
      onKeyDown={(event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        onSelect?.(label);
      }}
    />
  );
}

export function VisualPort({
  x,
  y,
  direction = "right",
  active = false,
}: {
  x: number;
  y: number;
  direction?: "left" | "right" | "up" | "down";
  active?: boolean;
}) {
  const dx = direction === "left" ? -9 : direction === "right" ? 9 : 0;
  const dy = direction === "up" ? -9 : direction === "down" ? 9 : 0;
  return (
    <g aria-hidden="true">
      <line x1={x} y1={y} x2={x + dx} y2={y + dy} stroke={active ? "var(--wavelength)" : "var(--line-strong)"} />
      <circle cx={x + dx} cy={y + dy} r={2.5} fill={active ? "var(--wavelength)" : "var(--surface)"} stroke={active ? "var(--wavelength)" : "var(--ink-faint)"} />
    </g>
  );
}

export function VisualPlane({
  points,
  label,
  active = false,
}: {
  points: string;
  label?: string;
  active?: boolean;
}) {
  return (
    <g>
      <polygon
        points={points}
        fill="var(--surface)"
        fillOpacity={0.16}
        stroke={active ? "var(--wavelength)" : "var(--line-strong)"}
        strokeWidth={1}
      />
      {label && <title>{label}</title>}
    </g>
  );
}

export function VisualMetric({
  x,
  y,
  value,
  label,
}: {
  x: number;
  y: number;
  value: string;
  label: string;
}) {
  return (
    <g fontFamily="var(--font-jetbrains-mono)">
      <text x={x} y={y} fontSize={16} fill="var(--hue, var(--ink))" className="tabular-nums">{value}</text>
      <text x={x} y={y + 16} fontSize={8} letterSpacing="0.08em" fill="var(--ink-faint)">{label}</text>
    </g>
  );
}

export function VisualState({
  x,
  y,
  label,
  state,
}: {
  x: number;
  y: number;
  label: string;
  state: "active" | "verified" | "degraded" | "idle";
}) {
  const color = state === "verified" || state === "active" ? "var(--hue, var(--ink))" : state === "degraded" ? "var(--wavelength)" : "var(--ink-faint)";
  return (
    <g transform={`translate(${x} ${y})`} aria-label={`${label}: ${state}`}>
      <circle r={3} fill={color} />
      <text x={8} y={3} fontSize={9} fontFamily="var(--font-jetbrains-mono)" fill="var(--ink-soft)">{label}</text>
    </g>
  );
}

export function VisualCluster({
  x,
  y,
  count,
  label,
}: {
  x: number;
  y: number;
  count: number;
  label: string;
}) {
  return (
    <g aria-label={label}>
      {Array.from({ length: count }, (_, index) => (
        <circle
          key={index}
          cx={x + ((index * 17) % 31)}
          cy={y + ((index * 11) % 23)}
          r={index % 5 === 0 ? 2.2 : 1.2}
          fill={index % 7 === 0 ? "var(--wavelength)" : "var(--hue, var(--ink-faint))"}
          opacity={0.76}
        />
      ))}
    </g>
  );
}

export function VisualDepthLayer({
  x,
  y,
  width,
  depth,
  height,
  label,
}: {
  x: number;
  y: number;
  width: number;
  depth: number;
  height: number;
  label: string;
}) {
  const front = `${x},${y} ${x + width},${y} ${x + width},${y + height} ${x},${y + height}`;
  const side = `${x + width},${y} ${x + width + depth},${y - depth / 2} ${x + width + depth},${y + height - depth / 2} ${x + width},${y + height}`;
  const top = `${x},${y} ${x + depth},${y - depth / 2} ${x + width + depth},${y - depth / 2} ${x + width},${y}`;
  return (
    <g>
      <polygon points={side} fill="var(--surface)" stroke="var(--line-strong)" />
      <polygon points={top} fill="var(--surface)" stroke="var(--line-strong)" />
      <polygon points={front} fill="var(--surface)" stroke="var(--line-strong)" />
      <text x={x + 8} y={y + height / 2 + 3} fontSize={9} fontFamily="var(--font-jetbrains-mono)" fill="var(--ink-soft)">{label}</text>
    </g>
  );
}

export function VisualTelemetry({
  x,
  y,
  label,
  value,
  state = "idle",
}: {
  x: number;
  y: number;
  label: string;
  value: string;
  state?: "active" | "verified" | "degraded" | "idle";
}) {
  return (
    <g transform={`translate(${x} ${y})`} fontFamily="var(--font-jetbrains-mono)">
      <VisualState x={0} y={0} label={label} state={state} />
      <text x={0} y={18} fontSize={11} className="tabular-nums" fill="var(--ink)">{value}</text>
    </g>
  );
}

export function VisualAnnotation({  x,
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
      fontFamily="var(--font-jetbrains-mono)"
      letterSpacing="0.08em"
      fill={color}
      textAnchor={anchor}
    >
      {children}
    </text>
  );
}

export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function VisualHatch({
  id,
  color = "var(--line-strong)",
  gap = 6,
}: {
  id: string;
  color?: string;
  gap?: number;
}) {
  return (
    <pattern
      id={id}
      width={gap}
      height={gap}
      patternUnits="userSpaceOnUse"
      patternTransform="rotate(45)"
    >
      <line x1={0} y1={0} x2={0} y2={gap} stroke={color} strokeWidth={1} />
    </pattern>
  );
}

export function VisualBoundary({
  x,
  y,
  w,
  h,
  label,
  active = false,
  dimmed = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label?: string;
  active?: boolean;
  dimmed?: boolean;
}) {
  return (
    <g data-testid="system-boundary" opacity={dimmed ? 0.18 : 1}>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="none"
        stroke={active ? "var(--wavelength)" : "var(--line-strong)"}
        strokeWidth={active ? 1.5 : 1}
        strokeDasharray="6 5"
      />
      {label && (
        <text
          x={x + 8}
          y={y - 8}
          fontSize={9}
          fontFamily="var(--font-jetbrains-mono)"
          letterSpacing="0.12em"
          fill="var(--ink-faint)"
        >
          {label}
        </text>
      )}
    </g>
  );
}

export function VisualBus({
  paths,
  color = "color-mix(in srgb, var(--hue, var(--ink)) 50%, var(--line-strong))",
  opacity = 0.8,
  width = 1.2,
}: {
  paths: string[];
  color?: string;
  opacity?: number;
  width?: number;
}) {
  return (
    <g data-testid="system-bus" fill="none" stroke={color} strokeOpacity={opacity} strokeWidth={width}>
      {paths.map((d) => (
        <path key={d} d={d} vectorEffect="non-scaling-stroke" />
      ))}
    </g>
  );
}

export function VisualRejectRail({
  x,
  y,
  length,
  items,
  color = "var(--line-strong)",
}: {
  x: number;
  y: number;
  length: number;
  items: string[];
  color?: string;
}) {
  return (
    <g>
      <line x1={x} y1={y} x2={x + length} y2={y} stroke={color} strokeWidth={1.5} />
      {items.map((item, i) => {
        const tx = x + ((i + 1) * length) / (items.length + 1);
        return (
          <g key={item}>
            <line x1={tx} y1={y - 5} x2={tx} y2={y + 5} stroke={color} strokeWidth={1} />
            <text
              x={tx}
              y={y + 18}
              textAnchor="middle"
              fontSize={8}
              fontFamily="var(--font-jetbrains-mono)"
              letterSpacing="0.08em"
              fill="var(--ink-faint)"
            >
              {item}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export function VisualMeasurementRail({  x,
  y,
  width,
  items,
}: {
  x: number;
  y: number;
  width: number;
  items: { value: string; label: string }[];
}) {
  const step = width / items.length;
  return (
    <g data-testid="system-rail" fontFamily="var(--font-jetbrains-mono)">
      {items.map((item, i) => (
        <g key={item.label} transform={`translate(${x + i * step} ${y})`}>
          <text fontSize={15} fontWeight={600} fill="var(--hue, var(--ink))" className="tabular-nums">
            {item.value}
          </text>
          <text y={15} fontSize={8} letterSpacing="0.1em" fill="var(--ink-faint)">
            {item.label}
          </text>
        </g>
      ))}
    </g>
  );
}

export function VisualDie({  x,
  y,
  w,
  h,
  label,
  sub,
  active = false,
  children,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  sub?: string;
  active?: boolean;
  children?: React.ReactNode;
}) {
  const f = 10;
  const corners = [
    `M ${x} ${y + f} V ${y} H ${x + f}`,
    `M ${x + w - f} ${y} H ${x + w} V ${y + f}`,
    `M ${x + w} ${y + h - f} V ${y + h} H ${x + w - f}`,
    `M ${x + f} ${y + h} H ${x} V ${y + h - f}`,
  ];
  return (
    <g data-testid="system-die">
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill="var(--surface)"
        stroke={active ? "var(--wavelength)" : "var(--line-strong)"}
        strokeWidth={active ? 1.5 : 1}
      />
      {corners.map((d) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke={active ? "var(--wavelength)" : "var(--ink-faint)"}
          strokeWidth={1.5}
        />
      ))}
      <text
        x={x + 14}
        y={y + 26}
        fontSize={12}
        fontFamily="var(--font-jetbrains-mono)"
        letterSpacing="0.08em"
        fontWeight={600}
        fill="var(--ink)"
      >
        {label}
      </text>
      {sub && (
        <text
          x={x + 14}
          y={y + 44}
          fontSize={10}
          fontFamily="var(--font-sans)"
          fill="var(--ink-faint)"
        >
          {sub}
        </text>
      )}
      {children}
    </g>
  );
}

export type MatrixCellState = "HIT" | "PART" | "IMMUNE" | "NA";

export function VisualMatrix({
  x,
  y,
  cols,
  rows,
  onCellHot,
  dimCol,
}: {
  x: number;
  y: number;
  cols: string[];
  rows: { label: string; cells: { state: MatrixCellState; note: string }[] }[];
  onCellHot: (col: string | null, row: string | null) => void;
  dimCol: string | null;
}) {
  const cellW = 72;
  const cellH = 34;
  const rowLabelW = 96;
  const cellMark = (state: MatrixCellState, cx: number, cy: number) => {
    if (state === "HIT")
      return <rect x={cx - 8} y={cy - 8} width={16} height={16} fill="var(--wavelength)" />;
    if (state === "PART")
      return (
        <g>
          <rect x={cx - 8} y={cy - 8} width={16} height={16} fill="none" stroke="var(--hue)" strokeWidth={1.5} />
          <rect x={cx - 8} y={cy - 8} width={8} height={16} fill="var(--hue)" />
        </g>
      );
    if (state === "IMMUNE")
      return <rect x={cx - 8} y={cy - 8} width={16} height={16} fill="none" stroke="var(--line-strong)" strokeWidth={1.5} />;
    return <line x1={cx - 7} y1={cy} x2={cx + 7} y2={cy} stroke="var(--line)" strokeWidth={1.5} />;
  };
  return (
    <g data-testid="system-matrix" fontFamily="var(--font-jetbrains-mono)">
      {cols.map((col, j) => (
        <text
          key={col}
          x={x + rowLabelW + j * cellW + cellW / 2}
          y={y - 8}
          textAnchor="middle"
          fontSize={8}
          letterSpacing="0.08em"
          fill="var(--ink-faint)"
        >
          {col}
        </text>
      ))}
      {rows.map((row, i) => (
        <g key={row.label}>
          <text x={x} y={y + i * cellH + cellH / 2 + 3} fontSize={9} letterSpacing="0.06em" fill="var(--ink-soft)">
            {row.label}
          </text>
          {row.cells.map((cell, j) => (
            <g key={cols[j]} opacity={dimCol && dimCol !== cols[j] ? 0.25 : 1}>
              <rect
                x={x + rowLabelW + j * cellW}
                y={y + i * cellH}
                width={cellW}
                height={cellH}
                fill="var(--surface)"
                fillOpacity={0.4}
                stroke="var(--line)"
                strokeWidth={0.5}
              />
              {cellMark(cell.state, x + rowLabelW + j * cellW + cellW / 2, y + i * cellH + cellH / 2)}
              <rect
                data-testid="system-matrix-cell"
                x={x + rowLabelW + j * cellW}
                y={y + i * cellH}
                width={cellW}
                height={cellH}
                fill="transparent"
                tabIndex={0}
                role="button"
                aria-label={`${row.label} ${cols[j]}: ${cell.note}`}
                onMouseEnter={() => onCellHot(cols[j], row.label)}
                onMouseLeave={() => onCellHot(null, null)}
                onFocus={() => onCellHot(cols[j], row.label)}
                onBlur={() => onCellHot(null, null)}
                style={{ cursor: "pointer" }}
              >
                <title>{`${row.label} ${cols[j]}: ${cell.note}`}</title>
              </rect>
            </g>
          ))}
        </g>
      ))}
    </g>
  );
}
