"use client";

import {
  VisualAnnotation,
  VisualArrows,
  VisualEdge,
  VisualNode,
  VisualSignal,
} from "@/components/visuals/primitives";

const W = 700;
const H = 340;

const CLIENT = { x: 40, y: 40, w: 130, h: 64 };
const DRAFT = { x: 40, y: 150, w: 200, h: 104 };
const TREE = { x: 330, y: 40, w: 150, h: 64 };
const TARGET = { x: 460, y: 150, w: 200, h: 104 };
const OUTPUT = { x: 540, y: 40, w: 120, h: 64 };

function right(c: { x: number; w: number; y: number; h: number }) {
  return { x: c.x + c.w, y: c.y + c.h / 2 };
}

export function SpecSplitTopology() {
  const arrowId = "arrow-specsplit";
  const clientToDraft = `M ${CLIENT.x + CLIENT.w / 2} ${CLIENT.y + CLIENT.h} L ${CLIENT.x + CLIENT.w / 2} ${DRAFT.y}`;
  const draftToTree = `M ${right(DRAFT).x} ${right(DRAFT).y - 30} Q ${W * 0.38} ${right(DRAFT).y - 30}, ${TREE.x + TREE.w / 2} ${TREE.y + TREE.h}`;
  const treeToTarget = `M ${TREE.x + TREE.w / 2} ${TREE.y + TREE.h} L ${TARGET.x} ${right(TARGET).y - 30}`;
  const grpc = `M ${right(DRAFT).x} ${right(DRAFT).y} C ${(DRAFT.x + DRAFT.w + TARGET.x) / 2 + 40} ${right(DRAFT).y + 52}, ${(DRAFT.x + DRAFT.w + TARGET.x) / 2 + 40} ${right(TARGET).y + 52}, ${TARGET.x} ${right(TARGET).y}`;
  const targetToOutput = `M ${right(TARGET).x} ${right(TARGET).y - 24} Q ${TARGET.x + TARGET.w + 10} ${right(TARGET).y - 24}, ${OUTPUT.x + OUTPUT.w / 2} ${OUTPUT.y + OUTPUT.h}`;
  const travelPath =
    `M ${CLIENT.x + CLIENT.w / 2} ${CLIENT.y + CLIENT.h} ` +
    `L ${CLIENT.x + CLIENT.w / 2} ${DRAFT.y} ` +
    `M ${right(DRAFT).x} ${right(DRAFT).y - 30} ` +
    `C ${(DRAFT.x + DRAFT.w + TARGET.x) / 2 + 40} ${right(DRAFT).y + 52}, ${(DRAFT.x + DRAFT.w + TARGET.x) / 2 + 40} ${right(TARGET).y + 52}, ${TARGET.x} ${right(TARGET).y}`;

  return (
    <svg
      role="img"
      aria-label="SpecSplit disaggregated speculation topology"
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="mx-auto"
    >
      <defs>
        <VisualArrows id={arrowId} />
      </defs>
      <VisualEdge d={clientToDraft} markerId={arrowId} />
      <VisualEdge d={draftToTree} markerId={arrowId} color="var(--accent-blue)" opacity={0.45} />
      <VisualEdge d={treeToTarget} markerId={arrowId} color="var(--accent-blue)" opacity={0.45} />
      <VisualEdge d={grpc} markerId={arrowId} opacity={0.5} width={1.4} color="var(--accent-indigo)" />
      <VisualEdge d={targetToOutput} markerId={arrowId} />

      <VisualNode
        x={CLIENT.x}
        y={CLIENT.y}
        w={CLIENT.w}
        h={CLIENT.h}
        label="CLIENT"
        sublabel="prompt + request"
        kind="source"
      />
      <VisualNode
        x={DRAFT.x}
        y={DRAFT.y}
        w={DRAFT.w}
        h={DRAFT.h}
        label="DRAFT"
        sublabel="Llama 3.1 8B · DGX Spark"
        kind="process"
      />
      <VisualNode
        x={TREE.x}
        y={TREE.y}
        w={TREE.w}
        h={TREE.h}
        label="TREE"
        sublabel="speculation candidates"
        kind="process"
        radius={12}
      />
      <VisualNode
        x={TARGET.x}
        y={TARGET.y}
        w={TARGET.w}
        h={TARGET.h}
        label="TARGET"
        sublabel="Llama 3.1 70B"
        kind="process"
      />
      <VisualNode
        x={OUTPUT.x}
        y={OUTPUT.y}
        w={OUTPUT.w}
        h={OUTPUT.h}
        label="OUTPUT"
        sublabel="accepted tokens"
        kind="output"
        radius={12}
      />
      <VisualSignal d={travelPath} dur={3.2} color="var(--accent-indigo)" r={4} />
      <VisualAnnotation x={(DRAFT.x + DRAFT.w + TARGET.x) / 2 + 40} y={right(DRAFT).y + 74}>
        gRPC · {"<"}0.1% network overhead
      </VisualAnnotation>
    </svg>
  );
}