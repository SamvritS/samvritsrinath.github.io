import Image from "next/image";
import { teaching, teachingStats } from "@/data/education";
import { SectionHeading } from "@/components/section-heading";
import { MetricRow } from "@/components/metric";
import { TechIcon } from "@/components/tech-icon";

export function TeachingSection() {
  return (
    <section id="teaching" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-36">
        <SectionHeading
          index="06"
          kicker="Teaching"
          title="Head tutor, DSA tutor, systems tutor, peer mentor."
          description="Four instructional roles and 200+ students mentored — teaching and research feed each other."
        />

        <div className="mb-14">
          <MetricRow metrics={[...teachingStats]} />
        </div>

        <div className="flex flex-col gap-16">
          {teaching.map((company) => (
            <div key={company.company}>
              <div className="flex flex-wrap items-center gap-4">
                {company.logo && (
                  <div className="glass-card flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl p-2">
                    <Image
                      src={company.logo}
                      alt={`${company.company} logo`}
                      width={96}
                      height={96}
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}
                <h3 className="text-xl font-semibold tracking-tight text-ink md:text-2xl">
                  {company.company}
                </h3>
              </div>
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
                        {role.description.slice(0, 3).map((d, i) => (
                          <li
                            key={i}
                            className="text-sm leading-relaxed text-ink-soft"
                          >
                            {d}
                          </li>
                        ))}
                      </ul>
                      {role.technologies.length > 0 && (
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          {role.technologies.slice(0, 6).map((t) => (
                            <TechIcon
                              key={t}
                              name={t}
                              className="h-4 w-4 text-ink-faint"
                            />
                          ))}
                        </div>
                      )}
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
    </section>
  );
}