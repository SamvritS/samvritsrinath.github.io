import type { ComponentType } from "react";
import type { VisualId } from "@/lib/types";
import { OwnershipPipeline } from "@/components/visuals/compositions/ownership-pipeline";
import { SpecSplitTopology } from "@/components/visuals/compositions/specsplit-topology";
import { HoneyLlmFlow } from "@/components/visuals/compositions/honeyllm-flow";
import { CitmTopology } from "@/components/visuals/compositions/citm-topology";
import { OptFantasyComparison } from "@/components/visuals/compositions/optfantasy-comparison";
import { LomaVerseOrbit } from "@/components/visuals/compositions/lomaverse-orbit";
import { MegakernelAnatomy } from "@/components/visuals/compositions/megakernel-anatomy";

const visuals: Record<VisualId, ComponentType> = {
  "ownership-pipeline": OwnershipPipeline,
  "specsplit-topology": SpecSplitTopology,
  "honeyllm-flow": HoneyLlmFlow,
  "citm-topology": CitmTopology,
  "optfantasy-comparison": OptFantasyComparison,
  "lomaverse-orbit": LomaVerseOrbit,
  "megakernel-anatomy": MegakernelAnatomy,
};

export function Visual({ id }: { id: VisualId }) {
  const Component = visuals[id];
  return <Component />;
}