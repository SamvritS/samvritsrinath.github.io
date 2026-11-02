"use client";

import { useState } from "react";
import { interpolate } from "@/data/benchmarks";
import { SpecSplitTopology } from "@/components/visuals/compositions/specsplit-topology";

export function SpecSplitSimulator() {
  const [gamma, setGamma] = useState(1);
  const { point, measured } = interpolate(gamma);
  // Throughput derived from measured TPOT: 1000 ms / ms-per-token.
  const tput = 1000 / point.tpotMs;
  const overhead = 100 - point.networkIdlePct;

  return (
    <div data-testid="specsplit-simulator" className="hue-line hue-field border p-6 md:p-8">
      <div className="mb-7 border-b border-line pb-6">
        <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
          Draft tree and verification path
        </p>
        <SpecSplitTopology
          gamma={gamma}
          acceptance={point.acceptance}
          tokensPerRound={point.tokensPerRound}
        />
      </div>
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
          Speculation depth
        </p>
        <p className="font-mono text-sm text-ink tabular-nums">
          γ = {gamma}
          <span className="ml-2 text-xs text-ink-faint">
            {measured ? "measured" : "interp"}
          </span>
        </p>
      </div>
      <input
        data-testid="specsplit-gamma"
        type="range"
        min={1}
        max={12}
        step={1}
        value={gamma}
        onChange={(e) => setGamma(Number(e.target.value))}
        aria-label="Draft tree depth gamma"
        className="mt-5 w-full"
        style={{ accentColor: "var(--hue)" }}
      />
      <div className="mt-3 flex justify-between font-mono text-[0.6875rem] text-ink-faint tabular-nums">
        <span>γ=1</span>
        <span>γ=12</span>
      </div>
      <dl
        data-testid="specsplit-readout"
        className="hue-text mt-6 grid grid-cols-2 gap-x-6 gap-y-5 font-mono tabular-nums md:grid-cols-4"
        style={{ fontVariantNumeric: "tabular-nums" }}
        data-gamma={gamma}
      >
        {[
          { k: "Acceptance", v: `${(point.acceptance * 100).toFixed(1)}%` },
          { k: "TPOT", v: `${Math.round(point.tpotMs)} ms` },
          { k: "Throughput", v: `${tput.toFixed(2)} tok/s` },
          { k: "Net overhead", v: `${overhead.toFixed(1)}%` },
        ].map((r) => (
          <div key={r.k}>
            <dt className="text-[0.6875rem] uppercase tracking-[0.18em] text-ink-faint">
              {r.k}
            </dt>
            <dd className="mt-1 text-xl">{r.v}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-6 font-mono text-xs leading-relaxed text-ink-faint">
        n = {point.acceptanceN} prompts per point. Acceptance is the column
        mean from the benchmark heatmap; throughput derives from measured
        TPOT. Values between measured depths are linear interpolation.
      </p>
    </div>
  );
}
