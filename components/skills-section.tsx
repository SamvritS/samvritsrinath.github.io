import { skills } from "@/data/education";
import { SectionHeading } from "@/components/section-heading";
import { TechIcon } from "@/components/tech-icon";

export function SkillsSection() {
  return (
    <section id="skills" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-36">
        <SectionHeading
          index="02"
          kicker="Skills"
          title="Tools I reach for in production."
          description="Languages, infrastructure, ML frameworks, and the debugging tooling that keeps systems honest."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {skills.map((group) => (
            <div
              key={group.group}
              className="glass-card rounded-2xl p-6"
            >
              <h3 className="font-mono text-xs uppercase tracking-[0.2em] text-indigo">
                {group.group}
              </h3>
              <div className="mt-4 flex flex-col gap-2.5">
                {group.items.map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2.5 text-sm text-ink-soft"
                  >
                    <TechIcon name={item} className="h-4 w-4 text-ink-faint" />
                    {item}
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