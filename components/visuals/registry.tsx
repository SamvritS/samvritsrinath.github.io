import type { ComponentType } from "react";
import type { VisualId, VisualMode } from "@/lib/types";
import { VisualFigureProvider } from "@/components/visuals/primitives";
import { OwnershipPipeline } from "@/components/visuals/compositions/ownership-pipeline";
import { SpecSplitTopology } from "@/components/visuals/compositions/specsplit-topology";
import { HoneyLlmFlow } from "@/components/visuals/compositions/honeyllm-flow";
import { CitmTopology } from "@/components/visuals/compositions/citm-topology";
import { OptFantasyComparison } from "@/components/visuals/compositions/optfantasy-comparison";
import { LomaVerseOrbit } from "@/components/visuals/compositions/lomaverse-orbit";
import { MegakernelAnatomy } from "@/components/visuals/compositions/megakernel-anatomy";

function SpecSplitVisual() {
  return <SpecSplitTopology />;
}

const visuals: Record<VisualId, ComponentType<{ mode?: VisualMode }>> = {
  "ownership-pipeline": OwnershipPipeline,
  "specsplit-topology": SpecSplitVisual,
  "megakernel-anatomy": MegakernelAnatomy,
  "honeyllm-flow": HoneyLlmFlow,
  "citm-topology": CitmTopology,
  "optfantasy-comparison": OptFantasyComparison,
  "lomaverse-orbit": LomaVerseOrbit,
};

export function Visual({
  id,
  mode = "diagram",
}: {
  id: VisualId;
  mode?: VisualMode;
}) {
  if (id === "ownership-pipeline") {
    return (
      <VisualFigureProvider value={mode === "figure"}>
        <OwnershipPipeline mode={mode} />
      </VisualFigureProvider>
    );
  }
  const Component = visuals[id];
  return (
    <VisualFigureProvider value={mode === "figure"}>
      <Component mode={mode} />
    </VisualFigureProvider>
  );
}
