export type ConstellationNode = {
  slug: string;
  x: number;
  y: number;
};

export type ConstellationEdge = {
  from: string;
  to: string;
  shared: string;
};

// The instrument is a technology graph over four real projects, not a metaphor:
// every edge names a string that appears in both endpoints' technologies array.
// `tests/constellation.test.ts` fails if a project is renamed, a technology is
// dropped, or a node falls outside the viewBox.
export const constellationNodes: ConstellationNode[] = [
  { slug: "ip-sage", x: 150, y: 432 },
  { slug: "specsplit", x: 520, y: 120 },
  { slug: "lomaverse", x: 430, y: 300 },
  { slug: "gpu-megakernels", x: 540, y: 440 },
];

export const constellationEdges: ConstellationEdge[] = [
  { from: "ip-sage", to: "specsplit", shared: "Python" },
  { from: "specsplit", to: "lomaverse", shared: "Python" },
  { from: "specsplit", to: "gpu-megakernels", shared: "CUDA" },
];
