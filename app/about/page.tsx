import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Portrait } from "@/components/portrait";
import { LogoTile } from "@/components/logo-tile";
import { MetricRow } from "@/components/metric";
import { SectionHeading } from "@/components/section-heading";
import { TeachingList } from "@/components/teaching-list";
import { ClubList } from "@/components/club-list";
import { Reveal } from "@/components/reveal";
import { education, teachingStats } from "@/data/education";
import { clean } from "@/lib/copy";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Samvrit Srinath, systems engineer, researcher, and educator at UC San Diego.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-28 pt-36 md:pt-44">
      <PageHeader
        index="03"
        kicker="About"
        title={site.name}
        description={clean(site.bio)}
      />

      <div className="mt-16 grid gap-12 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-8">
          <div className="border-t border-line pt-8">
            <p className="eyebrow">Education record</p>
            <div className="mt-4 flex items-center gap-4">
              <LogoTile
                src={education.logo}
                alt={`${education.university} logo`}
                className="h-16 w-16"
                bare
              />
              <h2 className="text-xl font-semibold tracking-tight text-ink md:text-2xl">
                {clean(education.university)}
              </h2>
            </div>
            <p className="mt-2 text-sm text-ink-soft">
              {clean(education.degree)} · {clean(education.duration)}
            </p>
            <p className="mt-4 text-sm text-ink">{clean(education.details)}</p>
            <p className="mt-2 text-sm text-ink-soft">
              {clean(education.focus)}
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {education.courses.map((course) => (
                <span
                  key={course}
                  className="border border-line px-3 py-1.5 font-mono text-xs text-ink-soft"
                >
                  {clean(course)}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <Portrait />
        </div>
      </div>

      <div className="mt-20">
        <SectionHeading
          kicker="Teaching"
          title="Teaching is part of the work."
          description="Four instructional roles across the CSE department and PACE, from introductory Python to advanced data structures and systems programming."
        />
        <MetricRow metrics={[...teachingStats]} className="mb-12" />
        <Reveal>
          <TeachingList />
        </Reveal>
      </div>

      <div className="mt-24">
        <SectionHeading
          kicker="Community"
          title="Clubs"
        />
        <Reveal>
          <ClubList />
        </Reveal>
      </div>
    </div>
  );
}
