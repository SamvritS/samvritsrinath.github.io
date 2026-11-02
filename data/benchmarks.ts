// Measured SpecSplit points transcribed from the paper charts in
// public/assets/projects/specsplit/ (acceptance_heatmap, tpot_vs_gamma,
// network_overhead). Acceptance is the per-gamma column mean; n is the
// number of prompts with a reported value. No invented numbers.

export type BenchmarkPoint = {
  gamma: number;
  acceptance: number;
  acceptanceN: number;
  tpotMs: number;
  tokensPerRound: number;
  networkIdlePct: number;
};

export const specsplitBenchmarks: BenchmarkPoint[] = [
  { gamma: 1, acceptance: 0.75, acceptanceN: 12, tpotMs: 580, tokensPerRound: 1.75, networkIdlePct: 99.8 },
  { gamma: 3, acceptance: 0.64, acceptanceN: 12, tpotMs: 1020, tokensPerRound: 2.1, networkIdlePct: 99.9 },
  { gamma: 5, acceptance: 0.55, acceptanceN: 15, tpotMs: 1270, tokensPerRound: 2.9, networkIdlePct: 99.9 },
  { gamma: 8, acceptance: 0.46, acceptanceN: 12, tpotMs: 1160, tokensPerRound: 3.9, networkIdlePct: 99.9 },
  { gamma: 12, acceptance: 0.38, acceptanceN: 11, tpotMs: 1100, tokensPerRound: 4.8, networkIdlePct: 99.9 },
];

export function interpolate(gamma: number): { point: BenchmarkPoint; measured: boolean } {
  const pts = specsplitBenchmarks;
  const exact = pts.find((p) => p.gamma === gamma);
  if (exact) return { point: exact, measured: true };
  const lo = [...pts].reverse().find((p) => p.gamma < gamma) ?? pts[0];
  const hi = pts.find((p) => p.gamma > gamma) ?? pts[pts.length - 1];
  const t = (gamma - lo.gamma) / Math.max(1, hi.gamma - lo.gamma);
  const mix = (a: number, b: number) => a + (b - a) * t;
  return {
    point: {
      gamma,
      acceptance: mix(lo.acceptance, hi.acceptance),
      acceptanceN: Math.min(lo.acceptanceN, hi.acceptanceN),
      tpotMs: mix(lo.tpotMs, hi.tpotMs),
      tokensPerRound: mix(lo.tokensPerRound, hi.tokensPerRound),
      networkIdlePct: mix(lo.networkIdlePct, hi.networkIdlePct),
    },
    measured: false,
  };
}
