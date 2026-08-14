import { education } from "@/data/education";
import { SectionHeading } from "@/components/section-heading";

export function EducationSection() {
  return (
    <section id="education" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-36">
        <SectionHeading
          index="05"
          kicker="Education"
          title="B.S./M.S. in computer science."
          description="Regents Scholar at UC San Diego, focused on systems, networking, and machine learning."
        />

        <div className="glass-card grid gap-10 rounded-2xl p-8 md:p-12 lg:grid-cols-[1fr_auto] lg:gap-20">
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-ink md:text-2xl">
              {education.university}
            </h3>
            <p className="mt-2 text-sm text-ink-soft">
              {education.degree} · {education.duration}
            </p>
            <p className="mt-4 text-sm text-indigo">{education.details}</p>
            <p className="mt-2 text-sm text-ink-soft">{education.focus}</p>
          </div>
          <div className="max-w-md">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
              Relevant coursework
            </span>
            <div className="mt-4 flex flex-wrap gap-2">
              {education.courses.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-line px-3 py-1 font-mono text-xs text-ink-soft"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}