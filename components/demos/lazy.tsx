"use client";

import dynamic from "next/dynamic";

const skeleton = "border border-line bg-surface";

export const SpecSplitLazy = dynamic(
  () =>
    import("@/components/demos/specsplit-simulator").then(
      (m) => m.SpecSplitSimulator,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        data-testid="demo-skeleton"
        aria-hidden
        className={`mt-6 h-72 ${skeleton}`}
      />
    ),
  },
);

export const LomaVerseLazy = dynamic<{ className?: string }>(
  () => import("./lomaverse-sim").then((m) => m.LomaVerseSim),
  {
    ssr: false,
    loading: () => (
      <div
        data-testid="demo-skeleton"
        aria-hidden
        className={`h-[420px] w-full ${skeleton}`}
      />
    ),
  },
);

export const AddressSpaceLazy = dynamic(
  () => import("./address-space-layer").then((m) => m.AddressSpaceLayer),
  {
    ssr: false,
    loading: () => (
      <div aria-hidden className={`absolute inset-0 ${skeleton}`} />
    ),
  },
);
