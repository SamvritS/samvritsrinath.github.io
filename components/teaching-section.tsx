import { teachingStats } from "@/data/education";
import { MetricRow } from "@/components/metric";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { TeachingList } from "@/components/teaching-list";

export function TeachingSection() {
  return (
    <SectionHeading
      id="teaching"
      rail="06 / TEACHING"
      kicker="Teaching"
      title="Instructional Assistant"
      description="Variety of Educational Roles spanning various course domains, including Intro to Programming, to Advanced Data Structures and Algorithms."
    >
      <MetricRow metrics={[...teachingStats]} className="mb-12" />
      <Reveal>
        <TeachingList />
      </Reveal>
    </SectionHeading>
  );
}
