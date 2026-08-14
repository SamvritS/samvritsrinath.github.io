import { Hero } from "@/components/hero";
import { SelectedWork } from "@/components/selected-work";
import { ResearchSection } from "@/components/research-section";
import { ExperienceSection } from "@/components/experience-section";
import { AboutSection } from "@/components/about-section";
import { ContactSection } from "@/components/contact-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <ResearchSection />
      <ExperienceSection />
      <AboutSection />
      <ContactSection />
    </>
  );
}