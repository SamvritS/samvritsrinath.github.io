import { bySlug } from "@/data/projects";
import {
  constellationEdges,
  constellationNodes,
  type ConstellationEdge,
  type ConstellationNode,
} from "@/data/constellation";

const VIEW = { width: 640, height: 560 };

// Curve control points are chosen so an edge leaves and enters a node without
// crossing that node's readout. The control is a geometry decision, not data.
const CONTROLS: Record<string, [number, number]> = {
  "ip-sage:specsplit": [420, 440],
  "specsplit:lomaverse": [540, 210],
  "specsplit:gpu-megakernels": [600, 280],
};

type Side = "left" | "above" | "below";

const LABEL_SIDE: Record<string, Side> = {
  "ip-sage": "below",
  specsplit: "above",
  lomaverse: "below",
  "gpu-megakernels": "below",
};

function readout(node: ConstellationNode, side: Side) {
  switch (side) {
    case "left":
      return {
        anchor: "end" as const,
        x: node.x - 14,
        titleY: node.y - 6,
        valueY: node.y + 8,
        metricY: node.y + 19,
      };
    case "above":
      return {
        anchor: "middle" as const,
        x: node.x,
        titleY: node.y - 34,
        valueY: node.y - 20,
        metricY: node.y - 9,
      };
    case "below":
      return {
        anchor: "middle" as const,
        x: node.x,
        titleY: node.y + 26,
        valueY: node.y + 40,
        metricY: node.y + 51,
      };
  }
}

function edgeGeometry(edge: ConstellationEdge, from: ConstellationNode, to: ConstellationNode) {
  const [cx, cy] = CONTROLS[`${edge.from}:${edge.to}`] ?? [
    (from.x + to.x) / 2,
    (from.y + to.y) / 2,
  ];
  return {
    d: `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`,
    midX: (from.x + 2 * cx + to.x) / 4,
    midY: (from.y + 2 * cy + to.y) / 4,
  };
}

export function NetworkConstellation() {
  const nodes = constellationNodes.map((node) => {
    const project = bySlug(node.slug);
    if (!project) throw new Error(`constellation node has no project: ${node.slug}`);
    return { node, project, metric: project.metrics[0] };
  });
  const byId = new Map(nodes.map((entry) => [entry.node.slug, entry]));

  const edges = constellationEdges.map((edge) => {
    const from = byId.get(edge.from)?.node;
    const to = byId.get(edge.to)?.node;
    if (!from || !to) throw new Error(`constellation edge has no nodes: ${edge.from} -> ${edge.to}`);
    return { edge, ...edgeGeometry(edge, from, to) };
  });

  const [first] = edges;

  return (
    <figure data-testid="network-constellation" className="m-0 w-full">
      <svg
        viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
        role="img"
        aria-labelledby="constellation-title constellation-desc"
        className="h-auto w-full"
      >
        <title id="constellation-title">
          A technology graph of IP-Sage, SpecSplit, LomaVerse, and GPU Megakernels
        </title>
        <desc id="constellation-desc">
          Four project nodes. Each edge names a technology that appears in both
          projects and is labelled at the curve midpoint: Python between IP-Sage
          and SpecSplit, Python between SpecSplit and LomaVerse, and CUDA between
          SpecSplit and GPU Megakernels. Each node shows one published metric.
        </desc>

        <g aria-hidden="true">
          {Array.from({ length: 13 }, (_, i) => {
            const x = 24 + i * 49.3;
            return <line key={`tx${i}`} x1={x} y1={24} x2={x} y2={31} style={{ stroke: "var(--line-strong)" }} />;
          })}
          {Array.from({ length: 11 }, (_, i) => {
            const y = 24 + i * 51.2;
            return <line key={`ty${i}`} x1={24} y1={y} x2={31} y2={y} style={{ stroke: "var(--line-strong)" }} />;
          })}
          <line x1={24} y1={24} x2={616} y2={24} style={{ stroke: "var(--line)" }} />
          <line x1={24} y1={24} x2={24} y2={536} style={{ stroke: "var(--line)" }} />

          <line x1={64} y1={240} x2={128} y2={240} style={{ stroke: "var(--line-strong)" }} />
          <line x1={96} y1={208} x2={96} y2={272} style={{ stroke: "var(--line-strong)" }} />
          <circle cx={96} cy={240} r={3} fill="none" style={{ stroke: "var(--line-strong)" }} />
        </g>

        {edges.map(({ edge, d }, i) => (
          <path
            key={`${edge.from}-${edge.to}`}
            d={d}
            pathLength={1}
            fill="none"
            strokeWidth={1.25}
            className="constellation-edge"
            style={{
              stroke: "var(--line-strong)",
              animationDelay: `${i * 120}ms`,
            }}
          />
        ))}

        {edges.map(({ edge, midX, midY }) => {
          const width = edge.shared.length * 6.4 + 12;
          return (
            <g key={`label-${edge.from}-${edge.to}`} aria-hidden="true">
              <rect
                x={midX - width / 2}
                y={midY - 8}
                width={width}
                height={16}
                style={{ fill: "var(--surface)" }}
              />
              <text
                x={midX}
                y={midY}
                textAnchor="middle"
                dominantBaseline="central"
                className="font-mono constellation-edge-label"
                style={{ fill: "var(--ink-soft)" }}
              >
                {edge.shared}
              </text>
            </g>
          );
        })}

        {first ? (
          <path
            d={first.d}
            pathLength={1}
            fill="none"
            strokeWidth={1.75}
            className="constellation-signal"
            style={{ stroke: "var(--wavelength)" }}
          />
        ) : null}

        {nodes.map(({ node, project, metric }) => {
          const layout = readout(node, LABEL_SIDE[node.slug] ?? "below");
          return (
            <g key={node.slug}>
              <circle
                cx={node.x}
                cy={node.y}
                r={6}
                fill="none"
                strokeWidth={1.25}
                className={
                  node.slug === "ip-sage" || node.slug === "specsplit"
                    ? "constellation-twinkle"
                    : undefined
                }
                style={{ stroke: project.hue }}
              />
              <circle cx={node.x} cy={node.y} r={1.7} style={{ fill: project.hue }} />
              <text
                x={layout.x}
                y={layout.titleY}
                textAnchor={layout.anchor}
                className="font-mono constellation-title"
                strokeWidth={3}
                paintOrder="stroke"
                style={{ fill: "var(--ink)", stroke: "var(--surface)" }}
              >
                {project.title}
              </text>
              <text
                x={layout.x}
                y={layout.valueY}
                textAnchor={layout.anchor}
                className="constellation-value"
                strokeWidth={3}
                paintOrder="stroke"
                style={{ fill: "var(--ink)", stroke: "var(--surface)" }}
              >
                {metric.value}
              </text>
              <text
                x={layout.x}
                y={layout.metricY}
                textAnchor={layout.anchor}
                className="constellation-metric"
                strokeWidth={3}
                paintOrder="stroke"
                style={{ fill: "var(--ink-faint)", stroke: "var(--surface)" }}
              >
                {metric.label}
              </text>
            </g>
          );
        })}

      </svg>
    </figure>
  );
}
