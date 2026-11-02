"use client";

import { useState } from "react";
import {
  VisualAnnotation,
  VisualArrows,
  VisualBus,
  VisualBoundary,
  VisualEdge,
  VisualHotspot,
  VisualMeasurementRail,
  VisualRejectRail,
  VisualSignal,
  mulberry32,
  type VisualNodeKind,
} from "@/components/visuals/primitives";
import type { VisualMode } from "@/lib/types";

export type OwnershipStage = {
  id: string;
  label: string;
  sublabel: string;
  kind: VisualNodeKind;
};

export const OWNERSHIP_STAGES: OwnershipStage[] = [
  { id: "censys", label: "CENSYS", sublabel: "domain + TLS + WHOIS", kind: "source" },
  { id: "prune", label: "PRUNE", sublabel: "WHOIS · ASN · TLS · DNS · HTTP", kind: "process" },
  { id: "interpret", label: "INTERPRET", sublabel: "LLM + guardrails", kind: "process" },
  { id: "guard", label: "GUARDRAILS", sublabel: "structured fallbacks", kind: "process" },
  { id: "cache", label: "CACHE", sublabel: "BigQuery operator store", kind: "storage" },
  { id: "owner", label: "OPERATOR", sublabel: "1.2.3.4 → owner", kind: "output" },
];

const stageIndex = new Map(OWNERSHIP_STAGES.map((n, i) => [n.id, i]));

const W = 1180;
const H = 640;

const FIELD = { x: 24, y: 56, w: 340, h: 384 };
const CLUSTERS = [
  { x: 44, y: 110, w: 150, h: 110, label: "CLUSTER A" },
  { x: 210, y: 250, w: 130, h: 130, label: "CLUSTER B" },
  { x: 60, y: 330, w: 170, h: 80, label: "CLUSTER C" },
];

const PLANE = "400,56 740,56 780,96 780,480 440,480 400,440";
const REGION_X = 424;
const REGION_W = 276;
const LATTICE = { x: 830, y: 56, w: 326, h: 300 };
const OUTPUT = { x: 830, y: 372, w: 326, h: 84 };
const CACHE = { x: 424, y: 500, w: 276, h: 44 };

const PATHS: Record<string, string[]> = {
  censys: ["field", "evidence"],
  prune: ["field", "prune", "reject"],
  interpret: ["evidence", "inference", "lattice"],
  guard: ["inference", "guard", "output"],
  cache: ["cache", "output"],
  owner: ["lattice", "output", "cache"],
};

const RAIL = [
  { value: "238M", label: "addresses swept" },
  { value: "13.7K", label: "operators" },
  { value: "87.0%", label: "accuracy" },
  { value: "1.73s", label: "per ip" },
  { value: "66%", label: "coverage gain" },
];

function FieldDots() {
  const rand = mulberry32(7);
  const cols = 96;
  const rows = 48;
  const x0 = 34;
  const y0 = 86;
  const dx = 322 / (cols - 1);
  const dy = 338 / (rows - 1);
  const dots: { x: number; y: number; hit: boolean; o: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const v = rand();
      dots.push({
        x: x0 + c * dx,
        y: y0 + r * dy,
        hit: v < 0.02,
        o: 0.2 + (v % 0.5),
      });
    }
  }
  return (
    <g data-testid="system-field" aria-label="238M-address input density field">
      {dots.map((d, i) => (
        <circle
          key={i}
          cx={d.x}
          cy={d.y}
          r={d.hit ? 1.8 : 1.1}
          fill={d.hit ? "var(--wavelength)" : "var(--hue, var(--ink-faint))"}
          opacity={d.hit ? 0.95 : d.o}
        />
      ))}
    </g>
  );
}

function OperatorLattice() {
  const rand = mulberry32(21);
  const cols = 14;
  const rows = 9;
  const cells: { x: number; y: number; ramp: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({
        x: LATTICE.x + 8 + c * ((LATTICE.w - 16) / cols),
        y: LATTICE.y + 8 + r * ((LATTICE.h - 16) / rows),
        ramp: Math.round(30 + rand() * 70),
      });
    }
  }
  const cw = (LATTICE.w - 16) / cols;
  const ch = (LATTICE.h - 16) / rows;
  return (
    <g aria-label="13.7K operator cells">
      {cells.map((cell, i) => (
        <rect
          key={i}
          x={cell.x}
          y={cell.y}
          width={cw - 5}
          height={ch - 6}
          fill={`color-mix(in srgb, var(--hue, var(--ink)) ${cell.ramp}%, var(--surface))`}
          stroke="var(--line)"
          strokeWidth={0.5}
        />
      ))}
    </g>
  );
}

function RegionRect({
  y,
  h,
  label,
  sub,
  lit,
}: {
  y: number;
  h: number;
  label: string;
  sub: string;
  lit: boolean;
}) {
  return (
    <g>
      <rect
        x={REGION_X}
        y={y}
        width={REGION_W}
        height={h}
        fill="var(--surface)"
        stroke={lit ? "var(--wavelength)" : "var(--line-strong)"}
        strokeWidth={lit ? 1.5 : 1}
      />
      <text
        x={REGION_X + 14}
        y={y + 30}
        fontSize={12}
        fontFamily="var(--font-jetbrains-mono)"
        letterSpacing="0.08em"
        fontWeight={600}
        fill="var(--ink)"
      >
        {label}
      </text>
      <text
        x={REGION_X + 14}
        y={y + 50}
        fontSize={10}
        fontFamily="var(--font-sans)"
        fill="var(--ink-faint)"
      >
        {sub}
      </text>
    </g>
  );
}

export function OwnershipPipeline({
  activeId,
  mode = "diagram",
}: {
  activeId?: string;
  mode?: VisualMode;
}) {
  void mode;
  const [hot, setHot] = useState<string | null>(null);
  const [hotCluster, setHotCluster] = useState<number | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const focus = activeId ?? hot ?? selected;
  const activeStage =
    OWNERSHIP_STAGES.find((n) => n.id === hot) ??
    OWNERSHIP_STAGES.find((n) => n.id === selected) ??
    null;
  const inPath = (group: string) =>
    !focus || (PATHS[focus] ?? []).includes(group);
  const dim = (group: string) => !inPath(group);

  const handleHot = (label: string | null, cluster: number | null = null) => {
    const id = OWNERSHIP_STAGES.find((s) => s.label === label)?.id ?? null;
    setHot(id);
    setHotCluster(id === "censys" ? cluster : null);
  };
  const handleSelect = (label: string) => {
    const id = OWNERSHIP_STAGES.find((s) => s.label === label)?.id ?? null;
    setSelected((prev) => (prev === id ? null : id));
  };

  return (
    <svg
      role="img"
      aria-label="IP-Sage investigation system from address space through evidence and classification to operator attribution"
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
    >
      <defs>
        <VisualArrows id="arrow-ownership" />
      </defs>

      {activeStage && (
        <text
          data-testid="ip-sage-selection"
          x={24}
          y={36}
          fontSize={11}
          fontFamily="var(--font-jetbrains-mono)"
          letterSpacing="0.08em"
          fill="var(--wavelength)"
        >
          inspecting {activeStage.label} · STAGE {stageIndex.get(activeStage.id)! + 1}/6
        </text>
      )}

      <g opacity={dim("field") ? 0.18 : 1}>
        <VisualBoundary
          x={FIELD.x}
          y={FIELD.y}
          w={FIELD.w}
          h={FIELD.h}
          label="ADDRESS SPACE · INPUT DENSITY"
          active={focus === "censys"}
        />
        <FieldDots />
        {CLUSTERS.map((c, i) => (
          <VisualBoundary
            key={c.label}
            x={c.x}
            y={c.y}
            w={c.w}
            h={c.h}
            label={c.label}
            active={focus === "censys" && (hotCluster === null || hotCluster === i)}
          />
        ))}
      </g>

      <g opacity={dim("evidence") ? 0.18 : 1}>
        <polygon points={PLANE} fill="var(--surface)" fillOpacity={0.16} stroke="var(--line-strong)" strokeWidth={1} />
        <VisualAnnotation x={410} y={48} anchor="start" size={9}>
          ATTRIBUTION PLANE
        </VisualAnnotation>
        <RegionRect y={84} h={76} label="EVIDENCE" sub="DNS · TLS · WHOIS" lit={focus === "censys"} />
      </g>

      <g data-testid="system-bus">
        <VisualBus
          paths={[
            "M 364 176 C 394 176 394 126 424 126",
            "M 364 182 C 394 182 394 132 424 132",
            "M 364 188 C 394 188 394 138 424 138",
          ]}
          opacity={dim("field") || dim("evidence") ? 0.18 : 0.8}
        />
        <VisualAnnotation x={372} y={152} anchor="start" size={9}>
          COLD PATH · 1.73S/IP
        </VisualAnnotation>
      </g>
      <VisualSignal d="M 364 182 C 394 182 394 132 424 132" dur={3.2} r={2.5} />

      <g opacity={dim("prune") ? 0.18 : 1}>
        <RegionRect y={176} h={76} label="PRUNE" sub="WHOIS · ASN · TLS · DNS · HTTP" lit={focus === "prune"} />
      </g>
      <g data-testid="topology-edge">
        <VisualEdge d="M 562 160 L 562 176" markerId="arrow-ownership" dashed={false} width={1.5} />
      </g>

      <g opacity={dim("reject") ? 0.18 : 1}>
        <VisualRejectRail
          x={712}
          y={214}
          length={92}
          items={["whois", "asn", "tls", "dns", "http"]}
        />
        <VisualAnnotation x={758} y={196} size={9}>
          FILTERED OUT
        </VisualAnnotation>
        <circle cx={704} cy={214} r={2} fill="var(--hue, var(--ink-faint))" />
        <circle cx={708} cy={214} r={2} fill="var(--hue, var(--ink-faint))" opacity={0.6} />
      </g>
      <g data-testid="topology-edge">
        <VisualEdge d="M 700 214 L 712 214" markerId="arrow-ownership" dashed={false} width={1.5} />
      </g>

      <g opacity={dim("inference") ? 0.18 : 1}>
        <RegionRect y={268} h={110} label="INFERENCE" sub="LLM classification" lit={focus === "interpret"} />
        <line x1={REGION_X} y1={323} x2={REGION_X + REGION_W} y2={323} stroke="var(--line)" strokeWidth={1} />
        <rect
          x={REGION_X + 1}
          y={330}
          width={REGION_W - 2}
          height={40}
          fill="none"
          stroke="var(--line-strong)"
          strokeWidth={1}
          strokeDasharray="4 4"
        />
        <VisualAnnotation x={REGION_X + 14} y={354} anchor="start" size={8}>
          WARM PATH · SKIPS LLM
        </VisualAnnotation>
      </g>
      <g data-testid="topology-edge">
        <VisualEdge d="M 562 252 L 562 268" markerId="arrow-ownership" dashed={false} width={1.5} />
      </g>

      <g opacity={dim("guard") ? 0.18 : 1}>
        <RegionRect y={394} h={62} label="GUARDRAILS" sub="structured fallbacks" lit={focus === "guard"} />
      </g>
      <g data-testid="topology-edge">
        <VisualEdge d="M 562 378 L 562 394" markerId="arrow-ownership" dashed={false} width={1.5} />
      </g>

      <g opacity={dim("lattice") ? 0.18 : 1}>
        <VisualBoundary
          x={LATTICE.x}
          y={LATTICE.y}
          w={LATTICE.w}
          h={LATTICE.h}
          label="OPERATOR SPACE · 13.7K"
          active={focus === "interpret" || focus === "owner"}
        />
        <OperatorLattice />
      </g>
      <g data-testid="system-bus">
        <VisualBus
          paths={[
            "M 700 420 C 760 420 770 240 830 240",
            "M 700 427 C 760 427 770 247 830 247",
            "M 700 434 C 760 434 770 254 830 254",
          ]}
          opacity={dim("guard") || dim("lattice") ? 0.18 : 0.8}
        />
      </g>
      <VisualSignal d="M 700 427 C 760 427 770 247 830 247" dur={3.6} delay={0.4} r={2.5} />

      <g opacity={dim("output") ? 0.18 : 1}>
        <path
          d={`M ${OUTPUT.x} ${OUTPUT.y} H ${OUTPUT.x + OUTPUT.w} V ${OUTPUT.y + 30} M ${OUTPUT.x + OUTPUT.w} ${OUTPUT.y + 54} V ${OUTPUT.y + OUTPUT.h} H ${OUTPUT.x} V ${OUTPUT.y}`}
          fill="var(--surface)"
          stroke={focus === "owner" ? "var(--wavelength)" : "var(--line-strong)"}
          strokeWidth={focus === "owner" ? 1.5 : 1}
        />
        <text
          x={OUTPUT.x + 20}
          y={OUTPUT.y + 36}
          fontSize={12}
          fontFamily="var(--font-jetbrains-mono)"
          letterSpacing="0.08em"
          fontWeight={600}
          fill="var(--ink)"
        >
          OPERATOR
        </text>
        <text
          x={OUTPUT.x + 20}
          y={OUTPUT.y + 62}
          fontSize={16}
          fontFamily="var(--font-jetbrains-mono)"
          fontWeight={600}
          fill="var(--hue, var(--ink))"
          className="tabular-nums"
        >
          13.7K
        </text>
        <circle cx={OUTPUT.x + OUTPUT.w - 14} cy={OUTPUT.y + OUTPUT.h / 2} r={3} fill="var(--wavelength)" />
      </g>
      <g data-testid="topology-edge">
        <VisualEdge d="M 993 356 L 993 372" markerId="arrow-ownership" dashed={false} width={1.5} />
      </g>

      <g opacity={dim("cache") ? 0.18 : 1}>
        <rect x={CACHE.x + 6} y={CACHE.y - 6} width={CACHE.w} height={CACHE.h} fill="var(--void)" stroke="var(--line)" strokeWidth={1} />
        <rect x={CACHE.x} y={CACHE.y} width={CACHE.w} height={CACHE.h} fill="var(--surface)" stroke={focus === "cache" ? "var(--wavelength)" : "var(--line-strong)"} strokeWidth={focus === "cache" ? 1.5 : 1} />
        <text
          x={CACHE.x + 14}
          y={CACHE.y + 28}
          fontSize={11}
          fontFamily="var(--font-jetbrains-mono)"
          letterSpacing="0.08em"
          fill="var(--ink)"
        >
          CACHE · BIGQUERY OPERATOR STORE
        </text>
      </g>
      <g data-testid="topology-edge">
        <path
          d="M 993 456 C 993 520 800 500 700 522"
          fill="none"
          stroke="var(--line-strong)"
          strokeWidth={1}
          strokeOpacity={0.6}
          strokeDasharray="2 5"
          markerEnd="url(#arrow-ownership)"
          vectorEffect="non-scaling-stroke"
        />
        <VisualAnnotation x={850} y={512} size={9}>
          write-back
        </VisualAnnotation>
      </g>

      <VisualHotspot x={FIELD.x} y={FIELD.y} w={FIELD.w} h={FIELD.h} label="CENSYS" active={hot === "censys"} selected={selected === "censys"} onHot={(label) => handleHot(label)} onSelect={handleSelect} />
      {CLUSTERS.map((c, i) => (
        <VisualHotspot key={c.label} x={c.x} y={c.y} w={c.w} h={c.h} label="CENSYS" active={hotCluster === i} selected={selected === "censys"} onHot={(label) => handleHot(label, i)} onSelect={handleSelect} />
      ))}
      <VisualHotspot x={REGION_X} y={176} w={REGION_W} h={76} label="PRUNE" active={hot === "prune"} selected={selected === "prune"} onHot={(label) => handleHot(label)} onSelect={handleSelect} />
      <VisualHotspot x={REGION_X} y={268} w={REGION_W} h={110} label="INTERPRET" active={hot === "interpret"} selected={selected === "interpret"} onHot={(label) => handleHot(label)} onSelect={handleSelect} />
      <VisualHotspot x={REGION_X} y={394} w={REGION_W} h={62} label="GUARDRAILS" active={hot === "guard"} selected={selected === "guard"} onHot={(label) => handleHot(label)} onSelect={handleSelect} />
      <VisualHotspot x={CACHE.x} y={CACHE.y - 6} w={CACHE.w + 6} h={CACHE.h + 6} label="CACHE" active={hot === "cache"} selected={selected === "cache"} onHot={(label) => handleHot(label)} onSelect={handleSelect} />
      <VisualHotspot x={OUTPUT.x} y={OUTPUT.y} w={OUTPUT.w} h={OUTPUT.h} label="OPERATOR" active={hot === "owner"} selected={selected === "owner"} onHot={(label) => handleHot(label)} onSelect={handleSelect} />

      <VisualMeasurementRail x={24} y={592} width={1132} items={RAIL} />
    </svg>
  );
}
