import { ResearchArchive } from "@/components/research-archive";
import { SectionHeading } from "@/components/section-heading";

export function ResearchSection() {
  return (
    <SectionHeading
      id="research"
      rail="04 / RESEARCH"
      kicker="Research"
      title="Research"
      atmosphere="article"
      divider
      description=""
    >
      <ResearchArchive />
    </SectionHeading>
  );
}
