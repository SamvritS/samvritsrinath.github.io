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
      title="Head tutor, DSA tutor, systems tutor, peer mentor."
      description="Four instructional roles, 200 plus students mentored, and a curriculum built around problem decomposition."
    >
      <MetricRow metrics={[...teachingStats]} className="mb-12" />
      <Reveal>
        <TeachingList />
      </Reveal>
    </SectionHeading>
  );
}
