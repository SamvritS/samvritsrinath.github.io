import { Hero } from "@/components/hero";
import { ExperienceSection } from "@/components/experience-section";
import { SkillsSection } from "@/components/skills-section";
import { SelectedWork } from "@/components/selected-work";
import { ResearchSection } from "@/components/research-section";
import { EducationSection } from "@/components/education-section";
import { TeachingSection } from "@/components/teaching-section";
import { ClubsSection } from "@/components/clubs-section";
import { ContactSection } from "@/components/contact-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ExperienceSection />
      <SkillsSection />
      <SelectedWork />
      <ResearchSection />
      <EducationSection />
      <TeachingSection />
      <ClubsSection />
      <ContactSection />
    </>
  );
}
