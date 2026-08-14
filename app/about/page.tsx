import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { clubs, education, teaching, teachingStats } from "@/data/education";
import { MetricRow } from "@/components/metric";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "About",
  description:
    "Samvrit Srinath — systems engineer, researcher, and educator at UC San Diego.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-28 pt-36 md:pt-44">
      <header className="mb-20 max-w-3xl">
        <p className="eyebrow mb-5 flex items-center gap-3">
          <span className="text-ink-faint">About</span>
          <span className="h-px w-8 bg-current opacity-40" />
          <span>Engineer · Researcher · Teacher</span>
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-ink md:text-6xl">
          {education.university}
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft md:text-lg">
          {education.degree} · {education.duration}. {education.details}
        </p>
      </header>

      <div className="mb-20">
        <MetricRow metrics={[...teachingStats]} />
      </div>

      <div>
        <SectionHeading
          index="01"
          kicker="Education"
          title="Relevant coursework."
        />
        <div className="flex flex-wrap gap-3">
          {education.courses.map((c) => (
            <span
              key={c}
              className="rounded-full border border-line px-4 py-2 font-mono text-sm text-ink-soft"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-24">
        <SectionHeading
          index="02"
          kicker="Teaching"
          title="Teaching is part of the work."
          description="Head tutor, advanced DSA tutor, systems programming tutor, and lead peer mentor — 200+ students across four roles."
        />
        <div className="flex flex-col gap-16">
          {teaching.map((company) => (
            <div key={company.company}>
              <h3 className="text-xl font-semibold tracking-tight text-ink md:text-2xl">
                {company.company}
              </h3>
              <div className="mt-6 flex flex-col gap-8">
                {company.roles.map((role) => (
                  <div
                    key={role.role}
                    className="grid gap-2 md:grid-cols-[1fr_auto] md:gap-8"
                  >
                    <div className="border-l-2 border-line pl-5 md:pl-6">
                      <h4 className="text-[15px] font-medium text-ink">
                        {role.role}
                      </h4>
                      <ul className="mt-3 flex flex-col gap-2">
                        {role.description.map((d, i) => (
                          <li
                            key={i}
                            className="text-sm leading-relaxed text-ink-soft"
                          >
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <span className="font-mono text-xs tracking-widest text-ink-faint md:pt-1 md:text-right">
                      {role.duration}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-24">
        <SectionHeading
          index="03"
          kicker="Community"
          title="Clubs & leadership."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {clubs.map((club) => (
            <a
              key={club.name}
              href={club.website}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col justify-between rounded-2xl border border-line bg-surface/60 p-6 transition-all duration-300 hover:border-line-strong"
            >
              <div>
                <h3 className="text-base font-semibold tracking-tight text-ink group-hover:text-indigo">
                  {club.name}
                </h3>
                <p className="mt-2 text-sm text-ink-soft">{club.role}</p>
              </div>
              <ArrowUpRight className="mt-6 h-4 w-4 text-ink-faint transition-colors group-hover:text-indigo" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}