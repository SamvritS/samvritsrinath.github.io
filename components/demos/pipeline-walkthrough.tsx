"use client";

import { useRef, useState } from "react";
import {
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import { OwnershipPipeline } from "@/components/visuals/compositions/ownership-pipeline";

const STEPS = [
  {
    id: "censys",
    title: "Censys",
    body: "Pull domain, TLS, and WHOIS evidence for each address from Censys.",
    stat: "238M",
    statLabel: "addresses scanned",
  },
  {
    id: "prune",
    title: "Prune",
    body: "Filter WHOIS, ASN, TLS, DNS, and HTTP evidence before the expensive step.",
    stat: "5",
    statLabel: "filter stages",
  },
  {
    id: "interpret",
    title: "Interpret",
    body: "Classify the surviving evidence into an operator with an LLM.",
    stat: "87.0%",
    statLabel: "accuracy vs human labelers",
  },
  {
    id: "guard",
    title: "Guardrails",
    body: "Route uncertain answers to structured fallbacks instead of guessing.",
    stat: "1.73s",
    statLabel: "per IP, full pipeline",
  },
  {
    id: "cache",
    title: "Cache",
    body: "Write every answer back to BigQuery. Repeat evidence never pays for the LLM twice.",
    stat: "13.7K",
    statLabel: "operators identified",
  },
  {
    id: "owner",
    title: "Operator",
    body: "Read the owner for any address in the snapshot.",
    stat: "66%",
    statLabel: "coverage gain from caching",
  },
] as const;

export function PipelineWalkthrough() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string>(STEPS[0].id);
  const current = STEPS.find((s) => s.id === active) ?? STEPS[0];
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start 70%", "end 45%"],
  });

  useMotionValueEvent(scrollYProgress, "change", (progress) => {
    if (reduced) return;
    const i = Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length));
    setActive(STEPS[i].id);
  });

  return (
    <div
      data-testid="walkthrough"
      className="hue-field hue-line rounded-none border grid gap-10 md:grid-cols-2"
    >
      <div ref={trackRef} className="flex flex-col">
        {STEPS.map((s, i) => {
          const on = s.id === active;
          return (
            <div
              key={s.id}
              data-testid={on ? "walkthrough-step-active" : "walkthrough-step"}
              className="border-l py-8 pl-6 pr-2"
              style={{ borderColor: on ? "var(--accent)" : "var(--line)" }}
            >
              <p className="font-mono text-xs text-ink-faint tabular-nums hue-text">
                {String(i + 1).padStart(2, "0")} / 06
              </p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-ink">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.body}</p>
            </div>
          );
        })}
      </div>
      <div className="md:sticky md:top-24 md:self-start">
        <OwnershipPipeline activeId={active} />
        <div className="mx-auto mt-4 max-w-xs border border-line bg-surface px-5 py-4 font-mono tabular-nums">
          <p className="text-[0.6875rem] uppercase tracking-[0.2em] text-ink-faint">
            {current.title} readout
          </p>
          <p className="hue-text mt-2 text-2xl">
            {current.stat}
            <span className="ml-2 text-xs text-ink-faint">{current.statLabel}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
