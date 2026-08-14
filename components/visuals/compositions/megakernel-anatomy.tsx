"use client";

import {
  VisualAnnotation,
  VisualArrows,
  VisualEdge,
  VisualNode,
  VisualSignal,
} from "@/components/visuals/primitives";

const W = 700;
const H = 400;

const GPU = { x: 30, y: 24, w: 640, h: 352 };
const SM_W = 170;
const SM_H = 150;
const SM_Y = 100;
const SMs = [55, 265, 475].map((x, i) => ({ x, label: `SM ${i}`, id: i }));
const SHM_H = 44;
const BUS_Y = 228;

export function MegakernelAnatomy() {
  const arrowId = "arrow-megakernel";
  const busX1 = SMs[0].x + 16;
  const busX2 = SMs[2].x + SM_W - 16;
  const busD = `M ${busX1} ${BUS_Y} L ${busX2} ${BUS_Y}`;
  const pathD = `M ${SMs[0].x + SM_W / 2} ${SM_Y + SM_H - SHM_H / 2} L ${busX1} ${BUS_Y}`;

  return (
    <svg
      role="img"
      aria-label="GPU megakernel shared-memory anatomy"
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="mx-auto"
    >
      <defs>
        <VisualArrows id={arrowId} />
      </defs>
      <rect
        x={GPU.x}
        y={GPU.y}
        width={GPU.w}
        height={GPU.h}
        rx={22}
        fill="color-mix(in srgb, var(--surface) 60%, transparent)"
        stroke="var(--line-strong)"
      />
      <VisualAnnotation x={GPU.x + 24} y={GPU.y + 28} size={10} anchor="start">
        GPU
      </VisualAnnotation>
      <VisualNode
        x={465}
        y={GPU.y + 18}
        w={168}
        h={52}
        label="RUNTIME"
        sublabel="shared-memory manager"
        kind="storage"
        radius={12}
      />
      <VisualEdge d={busD} markerId={arrowId} opacity={0.5} width={1.4} color="var(--accent-violet)" />
      {SMs.map((sm) => (
        <g key={sm.id}>
          <VisualNode
            x={sm.x}
            y={SM_Y}
            w={SM_W}
            h={SM_H}
            label={sm.label}
            sublabel="dispatch + compute"
            kind="process"
          />
          <VisualNode
            x={sm.x + 16}
            y={SM_Y + SM_H - SHM_H}
            w={SM_W - 32}
            h={SHM_H}
            label="SHM"
            sublabel="local"
            kind="storage"
            radius={10}
          />
        </g>
      ))}
      <VisualSignal d={busD} dur={2.6} color="var(--accent-violet)" r={4} />
      <VisualSignal d={pathD} dur={2.6} delay={1.2} color="var(--accent-gold)" r={3.5} />
      <VisualAnnotation x={W / 2} y={BUS_Y + 30} size={10}>
        runtime-managed memory sharing
      </VisualAnnotation>
    </svg>
  );
}