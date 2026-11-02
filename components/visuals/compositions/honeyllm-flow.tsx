"use client";

import { useState } from "react";
import {
  VisualAnnotation,
  VisualArrows,
  VisualBoundary,
  VisualEdge,
  VisualHotspot,
  VisualMatrix,
  VisualMeasurementRail,
  VisualNode,
  VisualSignal,
  type MatrixCellState,
} from "@/components/visuals/primitives";

const W = 1180;
const H = 640;

const LANES = [
  { x: 24, w: 344, label: "SMUGGLE", sub: "invisible ASCII traps" },
  { x: 412, w: 344, label: "VISIT", sub: "unique URL pings" },
  { x: 800, w: 344, label: "WATERMARK", sub: "solution fingerprints" },
] as const;
const LANE_Y = 140;
const LANE_H = 240;

const MATRIX_COLS = ["SMUGGLE", "VISIT", "WATERMARK"];
const MATRIX_ROWS: { label: string; cells: { state: MatrixCellState; note: string }[] }[] = [
  {
    label: "Claude",
    cells: [
      { state: "IMMUNE", note: "sanitizes hidden characters, 0% on hidden techniques" },
      { state: "HIT", note: "87.5% URL-ping success" },
      { state: "IMMUNE", note: "0% watermark success" },
    ],
  },
  {
    label: "Gemini",
    cells: [
      { state: "PART", note: "recognizes hidden text, sometimes ignores it" },
      { state: "HIT", note: "78.1% URL-ping success" },
      { state: "HIT", note: "75.0% watermark success" },
    ],
  },
  {
    label: "Qwen",
    cells: [
      { state: "PART", note: "recognizes characters, follows inconsistently" },
      { state: "HIT", note: "68.8% URL-ping success" },
      { state: "PART", note: "31.2% watermark success" },
    ],
  },
  {
    label: "Cluely",
    cells: [
      { state: "NA", note: "screenshot tool; defeated by OCR distraction instead" },
      { state: "NA", note: "screenshot tool; defeated by OCR distraction instead" },
      { state: "NA", note: "screenshot tool; defeated by OCR distraction instead" },
    ],
  },
];

const RAIL = [
  { value: "160", label: "simulated trials" },
  { value: "77.6%", label: "best attack success" },
  { value: "60.9%", label: "visible url ping" },
  { value: "33.3%", label: "watermarking" },
  { value: "6", label: "models tested" },
];

export function HoneyLlmFlow() {
  const [hot, setHot] = useState<string | null>(null);
  const [hotRow, setHotRow] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const active = hot ?? selected;
  const arrowId = "arrow-honeyllm";

  const handleCellHot = (col: string | null, row: string | null) => {
    setHot(col);
    setHotRow(row);
  };

  const laneCX = (i: number) => LANES[i].x + LANES[i].w / 2;

  return (
    <svg
      role="group"
      aria-label="HoneyLLM canary detection instrument"
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
    >
      <defs>
        <VisualArrows id={arrowId} />
      </defs>

      {active && (
        <text
          data-testid="honeyllm-selection"
          x={W - 24}
          y={24}
          textAnchor="end"
          fontSize={11}
          fontFamily="var(--font-jetbrains-mono)"
          letterSpacing="0.08em"
          fill="var(--wavelength)"
        >
          inspecting {active}
        </text>
      )}

      <g>
        <rect x={24} y={40} width={1132} height={64} fill="var(--surface)" stroke="var(--line-strong)" />
        <text x={40} y={66} fontSize={11} fontFamily="var(--font-jetbrains-mono)" letterSpacing="0.08em" fill="var(--ink)" fontWeight={600}>
          ASSESSMENT CONTENT
        </text>
        <text x={40} y={86} fontSize={9} fontFamily="var(--font-sans)" fill="var(--ink-faint)">
          canary-injected problem statement
        </text>
        {[0, 1, 2].map((i) => (
          <rect key={i} x={330} y={52 + i * 12} width={560 - i * 90} height={5} fill="var(--line)" opacity={0.7} />
        ))}
        {[360, 590, 810].map((x) => (
          <path key={x} d={`M ${x} 56 l 6 6 l -6 6 l -6 -6 Z`} fill="var(--wavelength)" />
        ))}
        <VisualAnnotation x={940} y={78} anchor="start" size={9}>
          3 injection points · per-session token
        </VisualAnnotation>
      </g>

      {LANES.map((lane) => (
        <g key={lane.label} opacity={active && active !== lane.label ? 0.18 : 1}>
          <VisualBoundary
            x={lane.x}
            y={LANE_Y}
            w={lane.w}
            h={LANE_H}
            label={`${lane.label} · ${lane.sub}`}
            active={active === lane.label}
          />
        </g>
      ))}

      <g opacity={active && active !== "SMUGGLE" ? 0.18 : 1} aria-label="Byte rail with invisible-character traps">
        {Array.from({ length: 20 }, (_, i) => {
          const trap = i === 4 || i === 11 || i === 17;
          const lit = trap && (!active || active === "SMUGGLE");
          return (
            <g key={i}>
              <rect
                x={44 + i * 15}
                y={230}
                width={12}
                height={26}
                fill={lit ? "var(--wavelength)" : "var(--surface)"}
                fillOpacity={lit ? 0.85 : 1}
                stroke="var(--line-strong)"
                strokeWidth={0.75}
              />
              {trap && (
                <path d={`M ${44 + i * 15 + 6} 214 l 5 5 l -5 5 l -5 -5 Z`} fill="var(--wavelength)" opacity={lit ? 1 : 0.45} />
              )}
            </g>
          );
        })}
        <VisualAnnotation x={44} y={276} anchor="start" size={8}>
          traps light when copied verbatim
        </VisualAnnotation>
      </g>

      <g opacity={active && active !== "VISIT" ? 0.18 : 1} aria-label="Outbound request path with ping marker">
        <path
          d={`M ${laneCX(1)} 180 C ${laneCX(1)} 230, ${laneCX(1)} 250, ${laneCX(1)} 268`}
          fill="none"
          stroke={active === "VISIT" ? "var(--wavelength)" : "var(--line-strong)"}
          strokeWidth={1.5}
        />
        {[18, 12, 6].map((r) => (
          <circle
            key={r}
            cx={laneCX(1)}
            cy={296}
            r={r}
            fill="none"
            stroke={active === "VISIT" ? "var(--wavelength)" : "var(--line-strong)"}
            strokeWidth={1}
            opacity={r === 6 ? 1 : 0.5}
          />
        ))}
        <circle cx={laneCX(1)} cy={296} r={3} fill="var(--wavelength)" />
        <text x={laneCX(1)} y={332} textAnchor="middle" fontSize={10} fontFamily="var(--font-jetbrains-mono)" fill="var(--ink)">
          tok/9f2c41 · per-session
        </text>
        <VisualAnnotation x={laneCX(1)} y={350} size={8}>
          server log → verdict
        </VisualAnnotation>
      </g>

      <g opacity={active && active !== "WATERMARK" ? 0.18 : 1} aria-label="Fingerprint lattice over a solution block">
        <rect x={824} y={200} width={296} height={104} fill="var(--surface)" stroke="var(--line-strong)" />
        {Array.from({ length: 24 }, (_, i) => (
          <rect
            key={i}
            x={832 + (i % 6) * 47}
            y={208 + Math.floor(i / 6) * 22}
            width={40}
            height={15}
            fill={i % 5 === 0 ? "var(--hue)" : "var(--void)"}
            fillOpacity={i % 5 === 0 ? 0.55 : 1}
            stroke="var(--line)"
            strokeWidth={0.5}
          />
        ))}
        <VisualAnnotation x={824} y={324} anchor="start" size={8}>
          e-ending names · forced pass block
        </VisualAnnotation>
      </g>

      <g pointerEvents="none">
        <rect x={24} y={292} width={1120} height={56} fill="none" stroke="var(--ink-faint)" strokeWidth={1} strokeDasharray="6 4" />
        <VisualAnnotation x={W / 2} y={284} size={9}>
          OCR-RESISTANCE LAYER · VISIBLE INJECTIONS CROSS ALL LANES
        </VisualAnnotation>
      </g>

      {LANES.map((lane, i) => (
        <g key={`edge-${lane.label}`} data-testid="topology-edge" stroke={active === lane.label ? "var(--wavelength)" : undefined}>
          <VisualEdge
            d={`M ${laneCX(i)} ${LANE_Y + LANE_H} L ${laneCX(i)} 402 Q ${laneCX(i)} 420, ${i === 1 ? laneCX(i) : 584} 420`}
            markerId={arrowId}
            color={active === lane.label ? "var(--wavelength)" : "var(--line-strong)"}
            opacity={active === lane.label ? 1 : 0.45}
            width={1.5}
          />
        </g>
      ))}
      <VisualSignal d={`M ${laneCX(1)} ${LANE_Y + LANE_H} L ${laneCX(1)} 420`} dur={2.2} r={2.5} />

      <VisualNode
        x={440}
        y={420}
        w={288}
        h={64}
        label="VERDICT"
        sublabel="ensemble over lanes"
        kind="output"
        highlight={!!active}
      />

      {LANES.map((lane) => (
        <VisualHotspot
          key={lane.label}
          x={lane.x}
          y={LANE_Y}
          w={lane.w}
          h={LANE_H}
          label={lane.label}
          active={active === lane.label}
          selected={selected === lane.label}
          onHot={setHot}
          onSelect={(label) => setSelected(selected === label ? null : label)}
        />
      ))}

      <g opacity={hotRow ? 0.9 : 1}>
        <VisualMatrix
          x={800}
          y={420}
          cols={[...MATRIX_COLS]}
          rows={MATRIX_ROWS}
          onCellHot={handleCellHot}
          dimCol={active}
        />
        <VisualAnnotation x={800} y={412} anchor="start" size={9}>
          PROVIDER EVIDENCE · HIT / PART / IMMUNE
        </VisualAnnotation>
      </g>

      <VisualMeasurementRail x={24} y={600} width={1132} items={RAIL} />
    </svg>
  );
}
