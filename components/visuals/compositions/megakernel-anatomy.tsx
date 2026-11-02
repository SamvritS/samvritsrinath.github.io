"use client";

import { useState } from "react";
import {
  VisualAnnotation,
  VisualArrows,
  VisualBus,
  VisualEdge,
  VisualHatch,
  VisualHotspot,
  VisualMeasurementRail,
  VisualSignal,
} from "@/components/visuals/primitives";

const W = 1180;
const H = 680;

const DIE = { x: 40, y: 80, w: 1100, h: 480 };
const SM_W = 140;
const SM_Y = 200;
const SM_H = 240;
const SM_X0 = 190;
const SM_GAP = 20;
const SLAB_H = 40;
const BUS_Y = [120, 132, 144];
const STAGES = ["DISPATCH", "COMPUTE", "MEMORY", "EMIT"];
const OCCUPANCY = [0.82, 0.64, 0.91, 0.55, 0.77, 0.68];

const RAIL = [
  { value: "Llama-8B", label: "batch decode context" },
  { value: "28.8%", label: "recoverable stall share" },
  { value: "7.46us", label: "worst hbm round trip" },
  { value: "228 KB", label: "shared memory per sm" },
];

const smX = (i: number) => SM_X0 + i * (SM_W + SM_GAP);
const smCX = (i: number) => smX(i) + SM_W / 2;

export function MegakernelAnatomy() {
  const [hot, setHot] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [stage, setStage] = useState<string>("DISPATCH");
  const active = hot ?? selected;
  const bottleneck = stage === "MEMORY";
  const arrowId = "arrow-megakernel";
  const busD = `M 150 ${BUS_Y[1]} L 1090 ${BUS_Y[1]}`;
  const fid = 12;

  const handleSMHot = (label: string | null) => setHot(label);
  const handleSMSelect = (label: string) =>
    setSelected(selected === label ? null : label);

  return (
    <svg
      role="group"
      aria-label="GPU megakernel silicon floorplan"
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
    >
      <defs>
        <VisualArrows id={arrowId} />
        <VisualHatch id="hatch-bottleneck" />
      </defs>

      <g>
        {STAGES.map((s, i) => {
          const x = 40 + i * 132;
          const on = stage === s;
          return (
            <g key={s}>
              <rect
                x={x}
                y={6}
                width={120}
                height={28}
                fill={on ? "var(--ink)" : "var(--surface)"}
                stroke={on ? "var(--ink)" : "var(--line-strong)"}
              />
              <text
                x={x + 60}
                y={24}
                textAnchor="middle"
                fontSize={10}
                fontFamily="var(--font-jetbrains-mono)"
                letterSpacing="0.1em"
                fill={on ? "var(--void)" : "var(--ink-soft)"}
              >
                {s}
              </text>
              <VisualHotspot
                x={x}
                y={6}
                w={120}
                h={28}
                label={s}
                active={false}
                selected={on}
                onHot={() => {}}
                onSelect={() => setStage(s)}
              />
            </g>
          );
        })}
      </g>

      <g>
        <polygon
          points={`${DIE.x},${DIE.y} ${DIE.x + 40},${DIE.y - 32} ${DIE.x + DIE.w + 40},${DIE.y - 32} ${DIE.x + DIE.w},${DIE.y}`}
          fill="var(--surface)"
          stroke="var(--line-strong)"
        />
        <polygon
          points={`${DIE.x + DIE.w},${DIE.y} ${DIE.x + DIE.w + 40},${DIE.y - 32} ${DIE.x + DIE.w + 40},${DIE.y + DIE.h - 32} ${DIE.x + DIE.w},${DIE.y + DIE.h}`}
          fill="var(--surface)"
          stroke="var(--line-strong)"
        />
        <g data-testid="system-die">
          <rect
            x={DIE.x}
            y={DIE.y}
            width={DIE.w}
            height={DIE.h}
            fill="var(--surface)"
            fillOpacity={0.4}
            stroke="var(--line-strong)"
            strokeWidth={1.5}
          />
          {[
            `M ${DIE.x} ${DIE.y + fid} V ${DIE.y} H ${DIE.x + fid}`,
            `M ${DIE.x + DIE.w - fid} ${DIE.y} H ${DIE.x + DIE.w} V ${DIE.y + fid}`,
            `M ${DIE.x + DIE.w} ${DIE.y + DIE.h - fid} V ${DIE.y + DIE.h} H ${DIE.x + DIE.w - fid}`,
            `M ${DIE.x + fid} ${DIE.y + DIE.h} H ${DIE.x} V ${DIE.y + DIE.h - fid}`,
          ].map((d) => (
            <path key={d} d={d} fill="none" stroke="var(--ink-faint)" strokeWidth={1.5} />
          ))}
          {Array.from({ length: 19 }, (_, i) => 95 + i * 55).map((x) => (
            <line key={x} x1={x} y1={DIE.y} x2={x} y2={DIE.y + DIE.h} stroke="var(--line)" strokeWidth={0.5} opacity={0.5} />
          ))}
          {Array.from({ length: 9 }, (_, i) => 128 + i * 48).map((y) => (
            <line key={y} x1={DIE.x} y1={y} x2={DIE.x + DIE.w} y2={y} stroke="var(--line)" strokeWidth={0.5} opacity={0.5} />
          ))}
        </g>
        <VisualAnnotation x={DIE.x + 14} y={DIE.y - 10} anchor="start" size={9}>
          H100 CLASS DIE · 132 SM SITES
        </VisualAnnotation>
      </g>

      <g>
        <VisualAnnotation x={56} y={188} anchor="start" size={9}>
          DISPATCH QUEUE
        </VisualAnnotation>
        {[0, 1, 2, 3].map((i) => (
          <rect
            key={i}
            x={56}
            y={200 + i * 48}
            width={64}
            height={36}
            fill={stage === "DISPATCH" && i === 0 ? "var(--hue)" : "var(--surface)"}
            fillOpacity={stage === "DISPATCH" && i === 0 ? 0.35 : 1}
            stroke="var(--line-strong)"
          />
        ))}
        <VisualEdge d="M 120 218 C 135 218, 135 132, 150 132" markerId={arrowId} dashed={false} width={1.5} />
      </g>

      <g data-testid="system-bus">
        <VisualBus
          paths={BUS_Y.map((y) => `M 150 ${y} L 1090 ${y}`)}
          color={bottleneck ? "var(--wavelength)" : undefined}
          opacity={bottleneck ? 1 : 0.8}
        />
        <VisualAnnotation x={150} y={108} anchor="start" size={9}>
          RUNTIME ALLOCATOR · SHARED-MEMORY BUS
        </VisualAnnotation>
      </g>
      <VisualSignal d={busD} dur={2.6} r={3} />

      {bottleneck && (
        <g data-testid="megakernel-bottleneck">
          <path
            d={`M ${smX(3) - 8} 100 V 164 H ${smX(3) + 4} M ${smX(4) + SM_W + 8} 100 V 164 H ${smX(4) + SM_W - 4}`}
            fill="none"
            stroke="var(--wavelength)"
            strokeWidth={1.5}
          />
          <text
            x={(smX(3) + smX(4) + SM_W) / 2}
            y={92}
            textAnchor="middle"
            fontSize={10}
            fontFamily="var(--font-jetbrains-mono)"
            fill="var(--wavelength)"
          >
            INTER-OP BOTTLENECK · 7.46us HBM ROUND TRIP
          </text>
        </g>
      )}

      {[0, 1, 2, 3, 4, 5].map((i) => {
        const label = `SM ${i + 1}`;
        const dimmed = active && active !== label && active !== `${label} SHM`;
        const isBottleneckSM = bottleneck && (i === 3 || i === 4);
        return (
          <g key={label} opacity={dimmed ? 0.35 : 1}>
            <rect
              x={smX(i)}
              y={SM_Y}
              width={SM_W}
              height={SM_H}
              fill="var(--surface)"
              stroke={active === label ? "var(--wavelength)" : "var(--line-strong)"}
              strokeWidth={active === label ? 1.5 : 1}
            />
            <text
              x={smX(i) + 12}
              y={SM_Y + 24}
              fontSize={11}
              fontFamily="var(--font-jetbrains-mono)"
              fontWeight={600}
              letterSpacing="0.08em"
              fill="var(--ink)"
            >
              {label}
            </text>
            {[0, 1, 2].map((lane) => (
              <line
                key={lane}
                x1={smX(i) + 12}
                y1={SM_Y + 60 + lane * 36}
                x2={smX(i) + SM_W - 12}
                y2={SM_Y + 60 + lane * 36}
                stroke="var(--line)"
                strokeWidth={1}
              />
            ))}
            {isBottleneckSM && (
              <rect
                x={smX(i) + 12}
                y={SM_Y + 48}
                width={SM_W - 24}
                height={96}
                fill="url(#hatch-bottleneck)"
                stroke="var(--wavelength)"
                strokeWidth={1}
                strokeDasharray="4 3"
              />
            )}
            {(i === 1 || i === 4) && (
              <g aria-label={`Tensor operation block in ${label}`}>
                {Array.from({ length: 16 }, (_, c) => (
                  <rect
                    key={c}
                    x={smX(i) + 12 + (c % 4) * 16}
                    y={SM_Y + 160 + Math.floor(c / 4) * 16}
                    width={13}
                    height={13}
                    fill="color-mix(in srgb, var(--hue) 45%, var(--surface))"
                    stroke="var(--line)"
                    strokeWidth={0.5}
                  />
                ))}
              </g>
            )}
            <rect
              x={smX(i) + 10}
              y={SM_Y + SM_H + 8}
              width={SM_W - 20}
              height={SLAB_H}
              fill="var(--void)"
              stroke="var(--line)"
            />
            <rect
              x={smX(i) + 10}
              y={SM_Y + SM_H + 8}
              width={(SM_W - 20) * OCCUPANCY[i]}
              height={SLAB_H}
              fill="color-mix(in srgb, var(--hue) 55%, var(--surface))"
              stroke={active === `${label} SHM` ? "var(--wavelength)" : "var(--line-strong)"}
            />
            <text
              x={smX(i) + 16}
              y={SM_Y + SM_H + 32}
              fontSize={8}
              fontFamily="var(--font-jetbrains-mono)"
              fill="var(--ink-faint)"
            >
              SHM {Math.round(OCCUPANCY[i] * 100)}%
            </text>
            <line
              x1={smCX(i)}
              y1={BUS_Y[2]}
              x2={smCX(i)}
              y2={SM_Y + SM_H + 8}
              stroke="var(--line-strong)"
              strokeWidth={1}
              opacity={0.6}
            />
            <VisualHotspot x={smX(i)} y={SM_Y} w={SM_W} h={SM_H} label={label} active={active === label} selected={selected === label} onHot={handleSMHot} onSelect={handleSMSelect} />
            <VisualHotspot x={smX(i) + 10} y={SM_Y + SM_H + 8} w={SM_W - 20} h={SLAB_H} label={`${label} SHM`} active={active === `${label} SHM`} selected={selected === `${label} SHM`} onHot={handleSMHot} onSelect={handleSMSelect} />
          </g>
        );
      })}

      <g>
        <rect x={DIE.x} y={584} width={DIE.w} height={30} fill="var(--surface)" stroke="var(--line-strong)" />
        {Array.from({ length: 19 }, (_, i) => 95 + i * 55).map((x) => (
          <g key={x}>
            <line x1={x} y1={584} x2={x} y2={592} stroke="var(--ink-faint)" strokeWidth={1.5} />
            <line x1={x} y1={584} x2={x} y2={576} stroke="var(--line-strong)" strokeWidth={1} strokeDasharray="2 3" opacity={0.6} />
          </g>
        ))}
        <VisualAnnotation x={DIE.x + DIE.w - 12} y={604} anchor="end" size={9}>
          HBM3 · DIE-EDGE GLOBAL MEMORY
        </VisualAnnotation>
      </g>

      <g data-testid="topology-edge">
        <VisualEdge d={`M ${smCX(2)} 496 L ${smCX(2)} 576`} markerId={arrowId} opacity={0.4} width={1} />
      </g>
      <VisualAnnotation x={smCX(2) + 10} y={540} anchor="start" size={9}>
        memory movement
      </VisualAnnotation>
      <line x1={120} y1={218} x2={150} y2={132} stroke="var(--line-strong)" strokeWidth={1} />
      <VisualAnnotation x={88} y={168} anchor="start" size={9}>
        dispatch
      </VisualAnnotation>

      {active && (
        <text
          data-testid="megakernel-selection"
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

      <VisualMeasurementRail x={24} y={636} width={1132} items={RAIL} />
    </svg>
  );
}
