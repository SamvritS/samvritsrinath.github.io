"use client";

import { useRef, useState } from "react";
import {
  VisualAnnotation,
  VisualAxis,
  VisualHatch,
  VisualMeasurementRail,
} from "@/components/visuals/primitives";

const W = 1180;
const H = 640;
const OX = 120;
const OY = 480;
const PW = 780;
const PH = 420;

type Series = "heuristic" | "exact" | "relax" | "frontier";

const TIMED: { label: string; secs: number; score: number; series: Series }[] = [
  { label: "ADP", secs: 0.03, score: 1738.4, series: "heuristic" },
  { label: "MIQCP", secs: 0.25, score: 1849.36, series: "exact" },
  { label: "QCP ROUND", secs: 0.57, score: 1733.38, series: "relax" },
  { label: "MILP NOVAR", secs: 1.03, score: 1806.54, series: "relax" },
  { label: "MILP", secs: 11.73, score: 1849.36, series: "exact" },
  { label: "BRUTE FORCE", secs: 29.17, score: 2142.4, series: "exact" },
];

const SCORE_REFS = [
  { label: "EXPERT 1,905.90", score: 1905.9 },
  { label: "GREEDY 1,349.42", score: 1349.42 },
];

const RAIL = [
  { value: "6", label: "timed methods" },
  { value: "1,849.36", label: "best actual points" },
  { value: "88.25", label: "integrality gap pts" },
  { value: "0.03s", label: "heuristic solve" },
];

const LOG_MIN = Math.log10(0.01);
const LOG_MAX = Math.log10(40);
const SCORE_MIN = 1200;
const SCORE_MAX = 2200;

const px = (secs: number) =>
  OX + ((Math.log10(secs) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * PW;
const py = (score: number) =>
  OY - ((score - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * PH;

const LEGEND: { key: Series; label: string; color: string }[] = [
  { key: "heuristic", label: "heuristic", color: "var(--accent)" },
  { key: "exact", label: "exact solvers", color: "var(--ink-soft)" },
  { key: "relax", label: "linear relaxations", color: "var(--ink-faint)" },
  { key: "frontier", label: "frontier", color: "var(--line-strong)" },
];

export function OptFantasyComparison() {
  const svgRef = useRef<SVGSVGElement>(null);
  const [isolated, setIsolated] = useState<Series | null>(null);
  const [cross, setCross] = useState<{ x: number; y: number } | null>(null);

  const onMove = (e: React.MouseEvent) => {
    const svg = svgRef.current;
    if (!svg) return;
    const r = svg.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * W;
    const y = ((e.clientY - r.top) / r.height) * H;
    if (x < OX || x > OX + PW || y < OY - PH || y > OY) {
      setCross(null);
      return;
    }
    setCross({ x, y });
  };
  const dim = (s: Series | null) =>
    isolated !== null && s !== isolated ? 0.12 : 1;

  const frontier =
    `M ${px(0.03)} ${py(1738.4)} L ${px(0.25)} ${py(1849.36)} ` +
    `L ${px(1.03)} ${py(1806.54)} L ${px(29.17)} ${py(2142.4)}`;
  const gapX = px(11.73);

  return (
    <svg
      ref={svgRef}
      role="group"
      aria-label="OptFantasy measured runtime versus score"
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      onMouseMove={onMove}
      onMouseLeave={() => setCross(null)}
    >
      <defs>
        <VisualHatch id="hatch-feasible" gap={9} />
        <VisualHatch id="hatch-infeasible" gap={4} />
      </defs>

      <g data-testid="system-plane" aria-label="Feasible region under the salary-cap boundary">
        <rect x={OX} y={OY - PH} width={PW} height={PH} fill="url(#hatch-feasible)" opacity={0.5} />
        <path
          d={`${frontier} L ${OX + PW} ${OY - PH} L ${OX + PW} ${py(2142.4)} Z`}
          fill="url(#hatch-infeasible)"
          opacity={0.6}
        />
        <line x1={OX} y1={py(2142.4)} x2={OX + PW} y2={py(2142.4)} stroke="var(--line-strong)" strokeDasharray="6 4" />
        <VisualAnnotation x={OX + PW - 8} y={py(2142.4) - 8} anchor="end" size={9}>
          SALARY-CAP BOUNDARY · BRUTE FORCE CEILING
        </VisualAnnotation>
      </g>

      {[0.01, 0.1, 1, 10].map((t) => (
        <g key={t} fontFamily="var(--font-jetbrains-mono)">
          <line x1={px(t)} y1={OY} x2={px(t)} y2={OY - PH} stroke="var(--line)" strokeWidth={1} />
          <text x={px(t)} y={OY + 18} textAnchor="middle" fontSize={9} fill="var(--ink-faint)" className="tabular-nums">
            {t < 1 ? `${t}s` : `${t}s`}
          </text>
        </g>
      ))}
      {[1400, 1800, 2200].map((s) => (
        <g key={s} fontFamily="var(--font-jetbrains-mono)">
          <line x1={OX} y1={py(s)} x2={OX + PW} y2={py(s)} stroke="var(--line)" strokeWidth={1} opacity={0.6} />
          <text x={OX - 10} y={py(s) + 3} textAnchor="end" fontSize={9} fill="var(--ink-faint)" className="tabular-nums">
            {s.toLocaleString()}
          </text>
        </g>
      ))}
      <VisualAxis x1={OX} y1={OY} x2={OX + PW} y2={OY} label="solve time, log seconds →" />
      <VisualAxis x1={OX} y1={OY - PH} x2={OX} y2={OY} horizontal={false} label="2024 actual points →" />

      {(!isolated || isolated === "frontier") && (
        <path d={frontier} fill="none" stroke="var(--line-strong)" strokeWidth={1.5} />
      )}
      <VisualAnnotation x={px(0.25)} y={py(1849.36) - 16} color="var(--accent)" size={10}>
        MIQCP · 1,849.36 PTS · 0.25S
      </VisualAnnotation>

      <g aria-label="Integrality gap bracket">
        <line x1={gapX} y1={py(1956.56)} x2={gapX} y2={py(1868.31)} stroke="var(--accent)" strokeWidth={1.5} />
        <path d={`M ${gapX - 6} ${py(1956.56)} H ${gapX + 6} M ${gapX - 6} ${py(1868.31)} H ${gapX + 6}`} stroke="var(--accent)" strokeWidth={1.5} />
        <text x={gapX + 10} y={(py(1956.56) + py(1868.31)) / 2 + 3} fontSize={9} fontFamily="var(--font-jetbrains-mono)" fill="var(--accent)" className="tabular-nums">
          88.25 PTS GAP
        </text>
      </g>

      <g opacity={dim("heuristic")} aria-label="Schematic search paths">
        <path d={`M ${px(0.01)} ${py(1500)} Q ${px(0.02)} ${py(1700)}, ${px(0.03)} ${py(1738.4)}`} fill="none" stroke="var(--accent)" strokeWidth={1} strokeDasharray="4 3" opacity={0.7} />
        <path d={`M ${px(0.01)} ${py(1400)} Q ${px(1)} ${py(1600)}, ${px(11.73)} ${py(1849.36)}`} fill="none" stroke="var(--ink-soft)" strokeWidth={1} strokeDasharray="4 3" opacity={0.7} />
        <VisualAnnotation x={px(0.01)} y={py(1400) - 8} anchor="start" size={8}>
          SEARCH PATHS · SCHEMATIC
        </VisualAnnotation>
      </g>

      {SCORE_REFS.map((ref) => (
        <g key={ref.label} opacity={0.75}>
          <line x1={OX} y1={py(ref.score)} x2={OX + PW} y2={py(ref.score)} stroke="var(--ink-faint)" strokeWidth={1} strokeDasharray="2 4" />
          <text x={OX + PW - 6} y={py(ref.score) - 6} textAnchor="end" fontSize={9} fontFamily="var(--font-jetbrains-mono)" fill="var(--ink-faint)">
            {ref.label}
          </text>
        </g>
      ))}

      {TIMED.map((p) => (
        <g key={p.label} opacity={dim(p.series)}>
          <circle
            cx={px(p.secs)}
            cy={py(p.score)}
            r={p.label === "MIQCP" ? 8 : 6}
            fill={p.series === "heuristic" ? "var(--accent)" : p.series === "exact" ? "var(--ink-soft)" : "var(--ink-faint)"}
            opacity={p.label === "MIQCP" ? 1 : 0.8}
          />
          <text
            x={p.label === "MILP" ? px(p.secs) - 10 : px(p.secs) + 10}
            y={py(p.score) + 3}
            textAnchor={p.label === "MILP" ? "end" : "start"}
            fontSize={10}
            fontFamily="var(--font-jetbrains-mono)"
            letterSpacing="0.06em"
            fill="var(--ink-soft)"
          >
            {p.label}
          </text>
          <text
            x={p.label === "MILP" ? px(p.secs) - 10 : px(p.secs) + 10}
            y={py(p.score) + 16}
            textAnchor={p.label === "MILP" ? "end" : "start"}
            fontSize={8}
            fontFamily="var(--font-jetbrains-mono)"
            fill="var(--ink-faint)"
            className="tabular-nums"
          >
            {p.secs}s · {p.score.toLocaleString()}
          </text>
        </g>
      ))}

      <g fontFamily="var(--font-jetbrains-mono)" fontSize={10} fill="var(--ink-faint)">
        {LEGEND.map((item, i) => {
          const on = isolated === item.key;
          return (
            <g
              key={item.key}
              transform={`translate(${OX + PW + 24} ${OY - PH + i * 26})`}
              role="button"
              tabIndex={0}
              aria-pressed={on}
              aria-label={`Isolate ${item.label}`}
              className="cursor-pointer focus:outline-none"
              opacity={isolated !== null && !on ? 0.35 : 1}
              onClick={() => setIsolated(on ? null : item.key)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setIsolated(on ? null : item.key);
                }
              }}
            >
              <line x1={0} y1={0} x2={18} y2={0} stroke={on ? "var(--accent)" : item.color} strokeWidth={on ? 2 : 1} opacity={0.8} />
              <text x={26} y={3} fill={on ? "var(--accent)" : "var(--ink-faint)"}>
                {item.label}
              </text>
            </g>
          );
        })}
      </g>

      {cross && (
        <g pointerEvents="none">
          <line x1={cross.x} y1={OY - PH} x2={cross.x} y2={OY} stroke="var(--accent)" strokeWidth={1} opacity={0.5} />
          <line x1={OX} y1={cross.y} x2={OX + PW} y2={cross.y} stroke="var(--accent)" strokeWidth={1} opacity={0.5} />
        </g>
      )}

      <VisualMeasurementRail x={24} y={596} width={1132} items={RAIL} />
    </svg>
  );
}
