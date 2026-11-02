import { Atmosphere } from "@/components/atmosphere/atmosphere";
import { LogoTile } from "@/components/logo-tile";
import { experience } from "@/data/experience";
import { clean } from "@/lib/copy";
import { Reveal } from "@/components/reveal";

export function ExperienceSection() {
  return (
    <section
      id="experience"
      className="relative overflow-hidden border-t border-line"
    >
      <Atmosphere variant="article" />
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="max-w-3xl">
          <p className="eyebrow">
            <span className="text-accent">01</span> / EXPERIENCE
          </p>
          <h2 className="type-h2 mt-4 text-ink">Experience</h2>
        </div>

        <div className="mt-14 flex flex-col gap-14 md:mt-16 md:gap-16">
          {experience.map((company, companyIndex) => (
            <Reveal key={company.company}>
              <article data-testid="experience-company">
                <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-4">
                  <h3 className="flex items-center gap-4 text-xl font-semibold tracking-tight text-ink md:text-2xl">
                    {company.logo && (
                      <LogoTile
                        src={company.logo}
                        alt={`${company.company} logo`}
                        className="h-16 w-16"
                        bare
                      />
                    )}
                    {clean(company.company)}
                  </h3>
                  {company.location && (
                    <span className="font-mono text-xs tracking-[0.2em] text-ink-faint">
                      {clean(company.location)}
                    </span>
                  )}
                </div>

                <div className="mt-6 flex flex-col gap-8">
                  {company.roles.map((role, roleIndex) => (
                    <div
                      key={role.role}
                      data-testid="experience-role"
                      data-current={
                        companyIndex === 0 && roleIndex === 0
                          ? "true"
                          : undefined
                      }
                      className="grid gap-3 md:grid-cols-[180px_minmax(0,1fr)] md:gap-10"
                    >
                      <div
                        data-testid="experience-date"
                        className="experience-date font-mono text-xs tracking-[0.1em] text-ink-faint tabular-nums whitespace-nowrap md:pt-1"
                      >
                        {clean(role.duration)}
                      </div>

                      <div data-testid="experience-content">
                        <h4 className="text-base font-medium text-ink">
                          {clean(role.role)}
                        </h4>
                        {role.description.length > 0 && (
                          <ul className="mt-3 flex flex-col gap-2">
                            {role.description.map((line) => (
                              <li key={line} className="read flex gap-3">
                                <span aria-hidden className="text-ink-faint">
                                  +
                                </span>
                                {clean(line)}
                              </li>
                            ))}
                          </ul>
                        )}
                        {role.technologies.length > 0 && (
                          <p className="mt-4 font-mono text-xs tracking-widest text-ink-faint">
                            {role.technologies.slice(0, 6).join(" + ")}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
