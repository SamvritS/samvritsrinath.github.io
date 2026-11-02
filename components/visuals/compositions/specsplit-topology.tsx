"use client";

import { useState } from "react";
import {
  VisualAnnotation,
  VisualArrows,
  VisualBus,
  VisualDie,
  VisualEdge,
  VisualHotspot,
  VisualNode,
  VisualSignal,
} from "@/components/visuals/primitives";

const W = 1180;
const H = 620;

const CLIENT = { x: 24, y: 196, w: 170, h: 64 };
const DRAFT = { x: 24, y: 280, w: 340, h: 230 };
const TARGET = { x: 816, y: 64, w: 340, h: 230 };
const OUTPUT = { x: 880, y: 360, w: 250, h: 84 };

const DRAFT_LANES = ["PROMPT IN", "DRAFT", "KV CACHE", "EMIT"];
const TARGET_LANES = ["VERIFY", "ROLLBACK", "KV CACHE", "EMIT"];

const SPINE_Y = 560;
const ROOT_X = 420;

function Lanes({
  x,
  y,
  w,
  lanes,
}: {
  x: number;
  y: number;
  w: number;
  lanes: string[];
}) {
  const rowH = 42;
  return (
    <g>
      {lanes.map((lane, i) => (
        <g key={lane}>
          {i > 0 && (
            <line
              x1={x}
              y1={y + i * rowH}
              x2={x + w}
              y2={y + i * rowH}
              stroke="var(--line)"
              strokeWidth={1}
            />
          )}
          <text
            x={x + 14}
            y={y + i * rowH + 26}
            fontSize={9}
            fontFamily="var(--font-jetbrains-mono)"
            letterSpacing="0.1em"
            fill="var(--ink-faint)"
          >
            {lane}
          </text>
        </g>
      ))}
    </g>
  );
}

export function SpecSplitTopology({
  gamma = 1,
  acceptance = 1,
  tokensPerRound,
}: {
  gamma?: number;
  acceptance?: number;
  tokensPerRound?: number;
}) {
  const [hot, setHot] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [pinnedBranch, setPinnedBranch] = useState<number | null>(null);
  const acceptedCount = Math.min(
    gamma,
    Math.max(0, Math.round(acceptance * gamma)),
  );
  const active = hot ?? selected;
  const branch =
    pinnedBranch != null && pinnedBranch < gamma ? pinnedBranch : null;
  const arrowId = "arrow-specsplit";
  const stepX = Math.min(56, 600 / Math.max(1, gamma - 1));
  const spineX = (i: number) => ROOT_X + i * stepX;
  const spineEnd = spineX(Math.max(0, gamma - 1));

  const links: Record<string, string[]> = {
    CLIENT: ["CLIENT-DRAFT"],
    DRAFT: ["CLIENT-DRAFT", "DRAFT-TUNNEL", "DRAFT-TREE"],
    TARGET: ["DRAFT-TUNNEL", "TARGET-OUTPUT"],
    OUTPUT: ["TARGET-OUTPUT", "TREE-OUTPUT"],
  };
  const hotEdges = new Set(active ? (links[active] ?? []) : []);
  const edge = (
    id: string,
    d: string,
    opts?: { width?: number; dashed?: boolean },
  ) => {
    const lit = hotEdges.has(id);
    return (
      <g
        key={id}
        data-testid="topology-edge"
        stroke={lit ? "var(--accent)" : undefined}
      >
        <VisualEdge
          d={d}
          markerId={arrowId}
          dashed={opts?.dashed ?? false}
          color={lit ? "var(--accent)" : "var(--line-strong)"}
          opacity={lit ? 1 : 0.45}
          width={opts?.width ?? 1.5}
        />
      </g>
    );
  };

  const tunnelPaths = [-7, 0, 7].map(
    (dy) =>
      `M ${DRAFT.x + DRAFT.w} ${310 + dy} C 590 ${310 + dy}, 590 ${264 + dy}, ${TARGET.x} ${264 + dy}`,
  );
  const selection =
    branch != null
      ? `BRANCH ${branch + 1}/${gamma} · ${branch < acceptedCount ? "ACCEPTED" : "REJECTED · FOLDS BACK"}${tokensPerRound != null && branch < acceptedCount ? ` · ${tokensPerRound.toFixed(1)} TOKENS/ROUND` : ""}`
      : active
        ? `${active} · ${active === "DRAFT" ? "Qwen2.5-0.5B · Llama-3.1-7B" : active === "TARGET" ? "Qwen2.5-30B · Llama-3.1-70B" : active === "OUTPUT" && tokensPerRound != null ? `${tokensPerRound.toFixed(1)} tokens/round` : active === "CLIENT" ? "prompt + request" : ""}`
        : null;

  return (
    <svg
      role="group"
      aria-label="SpecSplit disaggregated speculation topology"
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
    >
      <defs>
        <VisualArrows id={arrowId} />
      </defs>

      <VisualNode
        x={CLIENT.x}
        y={CLIENT.y}
        w={CLIENT.w}
        h={CLIENT.h}
        label="CLIENT"
        sublabel="prompt + request"
        kind="source"
        highlight={active === "CLIENT"}
        state={selected === "CLIENT" ? "selected" : active === "CLIENT" ? "inspecting" : "idle"}
      />
      <VisualDie
        x={DRAFT.x}
        y={DRAFT.y}
        w={DRAFT.w}
        h={DRAFT.h}
        label="DRAFT WORKER"
        sub="Qwen2.5-0.5B · Llama-3.1-7B"
        active={active === "DRAFT"}
      >
        <Lanes x={DRAFT.x} y={DRAFT.y + 56} w={DRAFT.w} lanes={DRAFT_LANES} />
      </VisualDie>
      <VisualDie
        x={TARGET.x}
        y={TARGET.y}
        w={TARGET.w}
        h={TARGET.h}
        label="TARGET WORKER"
        sub="Qwen2.5-30B · Llama-3.1-70B"
        active={active === "TARGET"}
      >
        <Lanes x={TARGET.x} y={TARGET.y + 56} w={TARGET.w} lanes={TARGET_LANES} />
      </VisualDie>
      <VisualNode
        x={OUTPUT.x}
        y={OUTPUT.y}
        w={OUTPUT.w}
        h={OUTPUT.h}
        label="OUTPUT"
        sublabel={
          tokensPerRound != null
            ? `accepted · ${tokensPerRound.toFixed(1)} tokens/round`
            : "accepted tokens"
        }
        kind="output"
        highlight={active === "OUTPUT"}
        state={selected === "OUTPUT" ? "selected" : active === "OUTPUT" ? "inspecting" : "idle"}
      />

      {edge("CLIENT-DRAFT", `M 109 ${CLIENT.y + CLIENT.h} L 109 ${DRAFT.y}`)}
      <g data-testid="system-bus">
        <VisualBus paths={tunnelPaths} opacity={hotEdges.size > 0 && !hotEdges.has("DRAFT-TUNNEL") ? 0.2 : 0.8} />
      </g>
      <VisualAnnotation x={590} y={288} size={9}>
        ngrok tunnel · &lt;10 KB payloads
      </VisualAnnotation>
      <VisualSignal d={tunnelPaths[1]} dur={2.6} r={2.5} />
      {edge("DRAFT-TREE", `M ${DRAFT.x + DRAFT.w} 470 C 392 470, 392 560, ${ROOT_X} ${SPINE_Y}`)}
      {acceptedCount > 0 &&
        edge("TREE-OUTPUT", `M ${spineEnd} ${SPINE_Y} C ${spineEnd + 60} ${SPINE_Y}, 880 480, 880 444`)}
      {edge("TARGET-OUTPUT", `M 986 ${TARGET.y + TARGET.h} L 986 ${OUTPUT.y}`)}

      <g
        data-testid="specsplit-tree"
        data-gamma={gamma}
        role="group"
        aria-label={`${gamma} speculation depth levels`}
      >
        <circle cx={ROOT_X - 14} cy={SPINE_Y} r={4} fill="var(--hue)" />
        {Array.from({ length: gamma }, (_, i) => {
          const accepted = i < acceptedCount;
          const x = spineX(i);
          return (
            <g key={i}>
              {i > 0 && (
                <line
                  x1={spineX(i - 1)}
                  y1={SPINE_Y}
                  x2={x}
                  y2={SPINE_Y}
                  stroke={accepted ? "var(--hue)" : "var(--line-strong)"}
                  strokeWidth={1.5}
                  opacity={accepted ? 0.9 : 0.4}
                />
              )}
              {!accepted && (
                <path
                  d={`M ${x} ${SPINE_Y} C ${x - 10} ${SPINE_Y + 34}, ${DRAFT.x + DRAFT.w - 40} ${SPINE_Y + 30}, ${DRAFT.x + DRAFT.w - 60} ${DRAFT.y + DRAFT.h}`}
                  fill="none"
                  stroke="var(--line-strong)"
                  strokeWidth={1}
                  strokeDasharray="3 4"
                  opacity={0.6}
                />
              )}
              <circle
                data-testid={accepted ? "specsplit-branch" : "specsplit-branch-rejected"}
                cx={x}
                cy={SPINE_Y}
                r={branch === i ? 7 : 5}
                fill={
                  !accepted
                    ? "var(--line-strong)"
                    : i === acceptedCount - 1
                      ? "var(--accent)"
                      : "var(--hue)"
                }
                opacity={!accepted ? 0.55 : 1}
                stroke={branch === i ? "var(--accent)" : "none"}
                strokeWidth={2}
                tabIndex={0}
                role="button"
                aria-label={`Branch ${i + 1} of ${gamma}, ${accepted ? "accepted" : "rejected"}`}
                onFocus={() => setPinnedBranch(null)}
                onClick={() => setPinnedBranch(branch === i ? null : i)}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" && event.key !== " ") return;
                  event.preventDefault();
                  setPinnedBranch(branch === i ? null : i);
                }}
                style={{ cursor: "pointer" }}
              />
            </g>
          );
        })}
        <text
          x={ROOT_X}
          y={SPINE_Y + 30}
          fontSize={9}
          fontFamily="var(--font-jetbrains-mono)"
          fill="var(--ink-faint)"
        >
          γ depth · {gamma} levels · {acceptedCount} accepted
        </text>
        {acceptedCount < gamma && (
          <VisualAnnotation x={spineEnd} y={SPINE_Y - 42} size={9}>
            rejected folds back
          </VisualAnnotation>
        )}
      </g>
      <VisualSignal
        d={`M ${ROOT_X} ${SPINE_Y} L ${spineEnd} ${SPINE_Y}`}
        dur={3.2}
        r={3}
      />

      <VisualHotspot x={CLIENT.x} y={CLIENT.y} w={CLIENT.w} h={CLIENT.h} label="CLIENT" active={active === "CLIENT"} selected={selected === "CLIENT"} onHot={setHot} onSelect={(label) => { setSelected(selected === label ? null : label); setPinnedBranch(null); }} />
      <VisualHotspot x={DRAFT.x} y={DRAFT.y} w={DRAFT.w} h={DRAFT.h} label="DRAFT" active={active === "DRAFT"} selected={selected === "DRAFT"} onHot={setHot} onSelect={(label) => { setSelected(selected === label ? null : label); setPinnedBranch(null); }} />
      <VisualHotspot x={TARGET.x} y={TARGET.y} w={TARGET.w} h={TARGET.h} label="TARGET" active={active === "TARGET"} selected={selected === "TARGET"} onHot={setHot} onSelect={(label) => { setSelected(selected === label ? null : label); setPinnedBranch(null); }} />
      <VisualHotspot x={OUTPUT.x} y={OUTPUT.y} w={OUTPUT.w} h={OUTPUT.h} label="OUTPUT" active={active === "OUTPUT"} selected={selected === "OUTPUT"} onHot={setHot} onSelect={(label) => { setSelected(selected === label ? null : label); setPinnedBranch(null); }} />

      {selection && (
        <text
          data-testid="topology-selection"
          x={24}
          y={H - 12}
          fontSize={11}
          fontFamily="var(--font-jetbrains-mono)"
          letterSpacing="0.08em"
          fill="var(--accent)"
        >
          {selection}
        </text>
      )}
    </svg>
  );
}
