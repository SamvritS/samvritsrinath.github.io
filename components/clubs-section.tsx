import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { ClubList } from "@/components/club-list";

export function ClubsSection() {
  return (
    <SectionHeading
      id="clubs"
      rail="07 / COMMUNITY"
      kicker="Community"
      title="Clubs"
    >
      <Reveal>
        <ClubList />
      </Reveal>
    </SectionHeading>
  );
}
