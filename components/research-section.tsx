import { ResearchArchive } from "@/components/research-archive";
import { SectionHeading } from "@/components/section-heading";

export function ResearchSection() {
  return (
    <SectionHeading
      id="research"
      rail="04 / RESEARCH"
      kicker="Research"
      title="Observation archive"
      atmosphere="research"
      divider
      description="Internet measurement and computing education. Two threads: mapping who operates the network, and studying how students learn with generative AI."
    >
      <ResearchArchive />
    </SectionHeading>
  );
}
