import { TechIcon } from "@/components/tech-icon";
import { skills } from "@/data/education";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

export function SkillsSection() {
  return (
    <SectionHeading
      id="skills"
      rail="02 / SKILLS"
      kicker="Instruments"
      title="Skills"
    >
      <Reveal>
        <dl className="flex flex-col">
          {skills.map((group) => (
            <div
              key={group.group}
              data-testid="skill-group"
              className="grid gap-2 border-t border-line py-5 md:grid-cols-[220px_1fr] md:gap-8"
            >
              <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink">
                {group.group}
              </dt>
              <dd className="text-sm leading-relaxed text-ink-soft">
                <ul className="flex flex-wrap gap-x-5 gap-y-3">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      data-testid="skill-item"
                      className="flex items-center gap-2"
                    >
                      <TechIcon
                        name={item}
                        className="h-4 w-4 shrink-0 text-ink-faint"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </SectionHeading>
  );
}
