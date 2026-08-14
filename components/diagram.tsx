import type { DiagramData, DiagramNode, DiagramNodeKind } from "@/lib/types";

const kindColor: Record<DiagramNodeKind, string> = {
  source: "var(--accent-blue)",
  process: "var(--accent-indigo)",
  storage: "var(--accent-violet)",
  output: "var(--accent-gold)",
};

const NODE_W = 180;
const NODE_H = 92;
const GAP = 52;
const PAD = 28;

type Placed = {
  node: DiagramNode;
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
};

type Edge = {
  d: string;
  from: string;
  to: string;
};

function layout(nodes: DiagramNode[], edges: [string, string][]): {
  width: number;
  height: number;
  placed: Placed[];
  paths: Edge[];
} {
  const placed: Placed[] = nodes.map((node, i) => {
    const x = PAD + i * (NODE_W + GAP);
    const y = PAD;
    return {
      node,
      x,
      y,
      w: NODE_W,
      h: NODE_H,
      cx: x + NODE_W / 2,
      cy: y + NODE_H / 2,
    };
  });

  const index = new Map(nodes.map((n, i) => [n.id, i]));

  const paths: Edge[] = edges.map(([from, to], i) => {
    const a = placed[index.get(from)!];
    const b = placed[index.get(to)!];
    const c = 34;
    return {
      d: `M ${a.x + a.w} ${a.cy} C ${a.x + a.w + c} ${a.cy}, ${b.x - c} ${b.cy}, ${b.x} ${b.cy}`,
      from,
      to: `edge-${i}`,
    };
  });

  return {
    width: PAD * 2 + nodes.length * NODE_W + (nodes.length - 1) * GAP,
    height: PAD * 2 + NODE_H,
    placed,
    paths,
  };
}

function NodeBox({ node, x, y, w, h, cx, cy }: Placed) {
  const color = kindColor[node.kind ?? "process"];
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect
        width={w}
        height={h}
        rx={16}
        fill="var(--surface)"
        stroke="var(--line-strong)"
      />
      <circle
        cx={16}
        cy={h / 2}
        r={3}
        fill={color}
        className="animate-pulse-soft"
      />
      <text
        x={30}
        y={h / 2 - 6}
        fontSize={12}
        fontFamily="var(--font-geist-mono)"
        letterSpacing="0.08em"
        fill="var(--ink)"
        fontWeight={600}
      >
        {node.label}
      </text>
      {node.sublabel && (
        <text
          x={30}
          y={h / 2 + 14}
          fontSize={10}
          fontFamily="var(--font-geist-sans)"
          fill="var(--ink-faint)"
        >
          {node.sublabel}
        </text>
      )}
      <circle cx={cx} cy={cy} r={0} fill="none" />
    </g>
  );
}

export function Diagram({
  data,
  className,
}: {
  data: DiagramData;
  className?: string;
}) {
  const horizontal = layout(data.nodes, data.edges);

  return (
    <div className={className}>
      {data.title && (
        <p className="mb-5 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-ink-faint">
          {data.title}
        </p>
      )}

      {/* Desktop: horizontal flow */}
      <div className="hidden md:block">
        <div className="overflow-x-auto pb-2">
          <svg
            role="img"
            aria-label={data.title ?? "System diagram"}
            width={horizontal.width}
            height={horizontal.height}
            viewBox={`0 0 ${horizontal.width} ${horizontal.height}`}
            className="mx-auto"
          >
            <defs>
              <marker
                id="arrow-h"
                viewBox="0 0 8 8"
                refX="7"
                refY="4"
                markerWidth="7"
                markerHeight="7"
                orient="auto-start-reverse"
              >
                <path d="M0,0 L8,4 L0,8 z" fill="var(--accent-indigo)" opacity="0.6" />
              </marker>
            </defs>
            {horizontal.paths.map((e) => (
              <path
                key={e.to}
                d={e.d}
                fill="none"
                stroke="var(--accent-indigo)"
                strokeWidth={1}
                strokeOpacity={0.35}
                strokeDasharray="4 6"
                className="animate-dash"
                markerEnd="url(#arrow-h)"
                vectorEffect="non-scaling-stroke"
              />
            ))}
            {horizontal.placed.map((p) => (
              <NodeBox key={p.node.id} {...p} />
            ))}
          </svg>
        </div>
      </div>

      {/* Mobile: vertical flow */}
      <div className="md:hidden">
        <VerticalFlow nodes={data.nodes} edges={data.edges} />
      </div>
    </div>
  );
}

function VerticalFlow({
  nodes,
  edges,
}: {
  nodes: DiagramNode[];
  edges: [string, string][];
}) {
  const width = 268;
  const height = PAD * 2 + nodes.length * NODE_H + (nodes.length - 1) * GAP;
  const index = new Map(nodes.map((n, i) => [n.id, i]));

  return (
    <svg
      role="img"
      aria-label="System diagram"
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="mx-auto"
    >
      <defs>
        <marker
          id="arrow-v"
          viewBox="0 0 8 8"
          refX="4"
          refY="7"
          markerWidth="7"
          markerHeight="7"
          orient="auto"
        >
          <path d="M0,0 L8,0 L4,8 z" fill="var(--accent-indigo)" opacity="0.6" />
        </marker>
      </defs>
      {edges.map(([from, to], i) => {
        const a = index.get(from)!;
        const b = index.get(to)!;
        const y1 = PAD + a * (NODE_H + GAP) + NODE_H;
        const y2 = PAD + b * (NODE_H + GAP);
        const cx = width / 2;
        return (
          <path
            key={`v-${i}`}
            d={`M ${cx} ${y1} L ${cx} ${y2}`}
            fill="none"
            stroke="var(--accent-indigo)"
            strokeWidth={1}
            strokeOpacity={0.35}
            strokeDasharray="4 6"
            className="animate-dash"
            markerEnd="url(#arrow-v)"
            vectorEffect="non-scaling-stroke"
          />
        );
      })}
      {nodes.map((node, i) => {
        const y = PAD + i * (NODE_H + GAP);
        const color = kindColor[node.kind ?? "process"];
        return (
          <g key={node.id} transform={`translate(${(width - NODE_W) / 2} ${y})`}>
            <rect
              width={NODE_W}
              height={NODE_H}
              rx={16}
              fill="var(--surface)"
              stroke="var(--line-strong)"
            />
            <circle cx={16} cy={NODE_H / 2} r={3} fill={color} className="animate-pulse-soft" />
            <text
              x={30}
              y={NODE_H / 2 - 6}
              fontSize={12}
              fontFamily="var(--font-geist-mono)"
              letterSpacing="0.08em"
              fill="var(--ink)"
              fontWeight={600}
            >
              {node.label}
            </text>
            {node.sublabel && (
              <text
                x={30}
                y={NODE_H / 2 + 14}
                fontSize={10}
                fontFamily="var(--font-geist-sans)"
                fill="var(--ink-faint)"
              >
                {node.sublabel}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}