"use client";

import {
  VisualArrows,
  VisualEdge,
  VisualNode,
  VisualSignal,
} from "@/components/visuals/primitives";

const W = 680;
const H = 460;

const CONTENT = { x: 260, y: 24, w: 160, h: 72 };
const CHANNELS = [
  { x: 40, y: 190, w: 170, h: 88, label: "SMUGGLE", sublabel: "invisible ASCII traps" },
  { x: 255, y: 190, w: 170, h: 88, label: "VISIT", sublabel: "unique URL pings" },
  { x: 470, y: 190, w: 170, h: 88, label: "WATERMARK", sublabel: "solution fingerprints" },
] as const;
const SIGNAL = { x: 265, y: 350, w: 150, h: 76 };

function cx(c: { x: number; w: number }) {
  return c.x + c.w / 2;
}

export function HoneyLlmFlow() {
  const arrowId = "arrow-honeyllm";
  const midX = cx(CONTENT);
  const fanD = CHANNELS.map((c) => {
    return `M ${midX} ${CONTENT.y + CONTENT.h} L ${cx(c)} ${c.y - 24} Q ${cx(c)} ${c.y}, ${cx(c)} ${c.y}`;
  });
  const convergeD = CHANNELS.map((c) => {
    return `M ${cx(c)} ${c.y + c.h} L ${cx(c)} ${c.y + c.h + 24} Q ${cx(c)} ${c.y + c.h + 40}, ${midX} ${c.y + c.h + 40} L ${midX} ${SIGNAL.y - 20}`;
  });
  const travelFan = CHANNELS.map((c) => {
    return `M ${midX} ${CONTENT.y + CONTENT.h} L ${cx(c)} ${c.y - 24} Q ${cx(c)} ${c.y}, ${cx(c)} ${c.y + 8}`;
  });
  const travelConverge = CHANNELS.map((c) => {
    return `M ${cx(c)} ${c.y + c.h} L ${cx(c)} ${c.y + c.h + 24} Q ${cx(c)} ${c.y + c.h + 40}, ${midX} ${c.y + c.h + 40} L ${midX} ${SIGNAL.y - 20}`;
  });

  return (
    <svg
      role="img"
      aria-label="HoneyLLM canary detection flow"
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="mx-auto"
    >
      <defs>
        <VisualArrows id={arrowId} />
      </defs>
      {fanD.map((d, i) => (
        <VisualEdge key={`fan-${i}`} d={d} markerId={arrowId} />
      ))}
      {convergeD.map((d, i) => (
        <VisualEdge key={`conv-${i}`} d={d} markerId={arrowId} />
      ))}
      <VisualNode
        x={CONTENT.x}
        y={CONTENT.y}
        w={CONTENT.w}
        h={CONTENT.h}
        label="CONTENT"
        sublabel="canary-injected"
        kind="source"
      />
      {CHANNELS.map((c) => (
        <VisualNode
          key={c.label}
          x={c.x}
          y={c.y}
          w={c.w}
          h={c.h}
          label={c.label}
          sublabel={c.sublabel}
          kind="process"
        />
      ))}
      <VisualNode
        x={SIGNAL.x}
        y={SIGNAL.y}
        w={SIGNAL.w}
        h={SIGNAL.h}
        label="SIGNAL"
        sublabel="deterrence verdict"
        kind="output"
      />
      {travelFan.map((d, i) => (
        <VisualSignal key={`tf-${i}`} d={d} dur={1.8} delay={i * 0.35} color="var(--accent-blue)" />
      ))}
      {travelConverge.map((d, i) => (
        <VisualSignal
          key={`tc-${i}`}
          d={d}
          dur={1.8}
          delay={0.6 + i * 0.35}
          color="var(--accent-gold)"
        />
      ))}
    </svg>
  );
}