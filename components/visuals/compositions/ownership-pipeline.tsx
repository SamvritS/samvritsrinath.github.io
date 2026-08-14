"use client";

import {
  VisualAnnotation,
  VisualArrows,
  VisualEdge,
  VisualNode,
  VisualSignal,
  type VisualNodeKind,
} from "@/components/visuals/primitives";

const NODES: { id: string; label: string; sublabel: string; kind: VisualNodeKind }[] = [
  { id: "censys", label: "CENSYS", sublabel: "domain + TLS + WHOIS", kind: "source" },
  { id: "prune", label: "PRUNE", sublabel: "cloud / CDN / 404", kind: "process" },
  { id: "interpret", label: "INTERPRET", sublabel: "LLM classification", kind: "process" },
  { id: "guard", label: "GUARDRAILS", sublabel: "structured fallbacks", kind: "process" },
  { id: "cache", label: "CACHE", sublabel: "BigQuery operator store", kind: "storage" },
  { id: "owner", label: "OPERATOR", sublabel: "1.2.3.4 → owner", kind: "output" },
];

const W = 420;
const H = 700;
const NODE_W = 220;
const NODE_H = 72;
const GAP = 44;
const NODE_X = (W - NODE_W) / 2;
const CX = NODE_X + NODE_W / 2;
const TOP = 24;
const STEP = NODE_H + GAP;

const yOf = (i: number) => TOP + i * STEP;

const edges = [
  ["censys", "prune"],
  ["prune", "interpret"],
  ["interpret", "guard"],
  ["guard", "cache"],
  ["cache", "owner"],
] as const;

const index = new Map(NODES.map((n, i) => [n.id, i]));

export function OwnershipPipeline() {
  const arrowId = "arrow-ownership";
  const segments = edges.map(([from, to]) => {
    const a = yOf(index.get(from)!) + NODE_H;
    const b = yOf(index.get(to)!);
    return { d: `M ${CX} ${a} L ${CX} ${b}` };
  });
  const feedbackY = yOf(index.get("owner")!) + NODE_H / 2;
  const cacheY = yOf(index.get("cache")!) + NODE_H / 2;
  const feedbackD = `M ${NODE_X + NODE_W} ${feedbackY} C ${W - 18} ${feedbackY}, ${W - 18} ${cacheY}, ${NODE_X + NODE_W} ${cacheY}`;

  return (
    <svg
      role="img"
      aria-label="IP-Sage attribution pipeline"
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="mx-auto"
    >
      <defs>
        <VisualArrows id={arrowId} />
      </defs>
      {segments.map(({ d }, i) => (
        <VisualEdge key={i} d={d} markerId={arrowId} />
      ))}
      <VisualEdge
        d={feedbackD}
        color="var(--accent-violet)"
        opacity={0.5}
        markerId={arrowId}
      />
      {segments.map(({ d }, i) => (
        <VisualSignal key={i} d={d} delay={i * 0.5} />
      ))}
      <VisualSignal
        d={feedbackD}
        dur={2.2}
        delay={0.6}
        color="var(--accent-violet)"
        r={3}
      />
      <VisualAnnotation x={W - 20} y={(feedbackY + cacheY) / 2} anchor="end">
        write-back
      </VisualAnnotation>
      {NODES.map((n, i) => (
        <VisualNode
          key={n.id}
          x={NODE_X}
          y={yOf(i)}
          w={NODE_W}
          h={NODE_H}
          label={n.label}
          sublabel={n.sublabel}
          kind={n.kind}
        />
      ))}
    </svg>
  );
}