"use client";

import { useState } from "react";
import {
  VisualAnnotation,
  VisualArrows,
  VisualBoundary,
  VisualHatch,
  VisualHotspot,
  VisualMeasurementRail,
  VisualSignal,
} from "@/components/visuals/primitives";

const W = 1180;
const H = 620;

const SOURCES = [
  { name: "KENYA", code: "KE", pct: 37.97 },
  { name: "PHILIPPINES", code: "PH", pct: 43.08 },
  { name: "CANADA", code: "CA", pct: 22.63 },
  { name: "BRAZIL", code: "BR", pct: 8.13 },
  { name: "ISRAEL", code: "IL", pct: 14.69 },
  { name: "SINGAPORE", code: "SG", pct: 15.24 },
  { name: "TAIWAN", code: "TW", pct: 15.57 },
  { name: "UAE", code: "AE", pct: 33.18 },
  { name: "CHINA", code: "CN", pct: 0.58 },
  { name: "USA", code: "US", pct: 0.14 },
  { name: "BELARUS", code: "BY", pct: 0.0 },
];

const SRC_X = 150;
const DST_X = 1030;
const TOP = 96;
const STEP = 40;
const SLAB = { x: 520, y: 120, w: 140, h: 380 };

const RAIL = [
  { value: "9,000+", label: "ip paths analyzed" },
  { value: "11", label: "countries measured" },
  { value: "RIPE", label: "atlas probes" },
  { value: "ERSP", label: "ucsd program" },
];

const srcY = (i: number) => TOP + i * STEP;
const slabY = (i: number) => SLAB.y + 30 + i * ((SLAB.h - 60) / (SOURCES.length - 1));
const ribbonW = (pct: number) => Math.max(1, (pct / 43.08) * 15);

export function CitmTopology() {
  const [hot, setHot] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const active = hot ?? selected;
  const arrowId = "arrow-citm";
  const exposed = SOURCES.filter((s) => s.pct > 0).length;

  const bundle = (i: number) => {
    const s = SOURCES[i];
    const y0 = srcY(i);
    const y1 = slabY(i);
    return {
      in: `M ${SRC_X} ${y0} C 300 ${y0}, 340 ${y1}, ${SLAB.x} ${y1}`,
      through: `M ${SLAB.x} ${y1} L ${SLAB.x + SLAB.w} ${y1}`,
      out: `M ${SLAB.x + SLAB.w} ${y1} C 840 ${y1}, 880 ${y0}, ${DST_X} ${y0}`,
      unlabeled: `M ${SLAB.x + SLAB.w + 130} ${y1} L ${SLAB.x + SLAB.w + 210} ${y0}`,
      s,
    };
  };

  const selection = active
    ? active === "COUNTRY X"
      ? `COUNTRY X · ${exposed} SOURCES EXPOSED · PEAK 43% PH`
      : (() => {
          const s = SOURCES.find((c) => c.name === active);
          return s ? `${s.name} · ${s.pct.toFixed(2)}% PATHS EXPOSED` : active;
        })()
    : null;

  return (
    <svg
      role="group"
      aria-label="Path sovereignty map with a country in the middle"
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
    >
      <defs>
        <VisualArrows id={arrowId} />
        <VisualHatch id="hatch-transit" gap={7} />
      </defs>

      <g aria-hidden opacity={0.5}>
        <path d="M 60 90 C 260 60, 420 130, 640 100 C 860 70, 1020 120, 1120 100" fill="none" stroke="var(--line)" strokeWidth={1} />
        <path d="M 60 300 C 300 260, 520 340, 760 300 C 940 270, 1040 320, 1120 300" fill="none" stroke="var(--line)" strokeWidth={1} />
        <path d="M 60 500 C 320 460, 560 540, 800 500 C 960 480, 1060 520, 1120 505" fill="none" stroke="var(--line)" strokeWidth={1} />
        <VisualAnnotation x={90} y={76} anchor="start" size={8}>
          REFERENCE FIELD · NO EXTERNAL TILES
        </VisualAnnotation>
      </g>

      <g opacity={active && active !== "COUNTRY X" ? 0.3 : 1}>
        <VisualBoundary
          x={SLAB.x}
          y={SLAB.y}
          w={SLAB.w}
          h={SLAB.h}
          label="COUNTRY X · THE COUNTRY IN THE MIDDLE"
          active={active === "COUNTRY X"}
        />
        <rect
          x={SLAB.x}
          y={SLAB.y}
          width={SLAB.w}
          height={SLAB.h}
          fill="url(#hatch-transit)"
          opacity={0.5}
        />
      </g>

      <g data-testid="system-bus" aria-label="Bundled path ribbons weighted by exposure">
        {SOURCES.map((s, i) => {
          const b = bundle(i);
          const lit = !active || active === s.name || active === "COUNTRY X";
          const w = ribbonW(s.pct);
          return (
            <g
              key={s.name}
              data-testid="citm-edge"
              opacity={lit ? 1 : 0.15}
              fill="none"
              stroke={active === s.name ? "var(--accent)" : "var(--hue)"}
              strokeOpacity={lit ? 0.85 : 0.4}
            >
              <path d={b.in} strokeWidth={w} vectorEffect="non-scaling-stroke" />
              <path d={b.through} strokeWidth={w} vectorEffect="non-scaling-stroke" />
              <path d={b.out} strokeWidth={w} vectorEffect="non-scaling-stroke" />
              <path
                d={b.unlabeled}
                strokeWidth={Math.max(2, w * 0.5)}
                stroke="var(--line-strong)"
                strokeDasharray="4 4"
                opacity={0.8}
              />
            </g>
          );
        })}
      </g>
      <VisualSignal
        d={bundle(1).in}
        dur={4}
        r={3}
        once
        testId="traceroute-packet"
      />
      <VisualSignal d={bundle(0).out} dur={4} delay={1} r={3} once />

      <g>
        {SOURCES.map((s, i) => (
          <g key={s.name} opacity={active && active !== s.name && active !== "COUNTRY X" ? 0.4 : 1}>
            <line x1={SRC_X - 22} y1={srcY(i)} x2={SRC_X} y2={srcY(i)} stroke={active === s.name ? "var(--accent)" : "var(--line-strong)"} strokeWidth={2} />
            <circle cx={SRC_X - 26} cy={srcY(i)} r={3} fill={active === s.name ? "var(--accent)" : "var(--surface)"} stroke={active === s.name ? "var(--accent)" : "var(--ink-faint)"} />
            <text x={SRC_X - 36} y={srcY(i) + 3} textAnchor="end" fontSize={9} fontFamily="var(--font-jetbrains-mono)" letterSpacing="0.06em" fill="var(--ink)">
              {s.name}
            </text>
            <text x={DST_X + 12} y={srcY(i) + 3} fontSize={9} fontFamily="var(--font-jetbrains-mono)" fill="var(--ink-faint)">
              {s.code} GOV
            </text>
            <line x1={DST_X} y1={srcY(i)} x2={DST_X + 8} y2={srcY(i)} stroke="var(--line-strong)" strokeWidth={2} />
            <VisualHotspot x={SRC_X - 150} y={srcY(i) - 18} w={150} h={36} label={s.name} active={active === s.name} selected={selected === s.name} onHot={setHot} onSelect={(label) => setSelected(selected === label ? null : label)} />
          </g>
        ))}
      </g>

      <VisualHotspot x={SLAB.x} y={SLAB.y} w={SLAB.w} h={SLAB.h} label="COUNTRY X" active={active === "COUNTRY X"} selected={selected === "COUNTRY X"} onHot={setHot} onSelect={(label) => setSelected(selected === label ? null : label)} />

      <g>
        <path
          d={`M 700 532 V 556 H 1140 M 1140 532 V 556`}
          fill="none"
          stroke="var(--line-strong)"
          strokeWidth={1}
        />
        <VisualAnnotation x={920} y={550} size={9}>
          dashed = unlabeled hops · counts are a lower bound · CDF Fig. 5
        </VisualAnnotation>
      </g>

      {selection && (
        <text
          data-testid="citm-selection"
          x={24}
          y={30}
          fontSize={11}
          fontFamily="var(--font-jetbrains-mono)"
          letterSpacing="0.08em"
          fill="var(--accent)"
        >
          inspecting {selection}
        </text>
      )}

      <VisualMeasurementRail x={24} y={576} width={1132} items={RAIL} />
    </svg>
  );
}
