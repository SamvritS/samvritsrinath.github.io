import type { Metadata } from "next";
import { Download, Mail, ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
import { education, skills, teaching } from "@/data/education";
import { experience } from "@/data/experience";
import { researchAreas } from "@/data/research";
import { clubs } from "@/data/education";

export const metadata: Metadata = {
  title: "Résumé",
  description: "Samvrit Srinath's résumé — systems engineer and researcher.",
};

function PaperSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <h2 className="border-b border-black/15 pb-1 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-black/70">
        {title}
      </h2>
      <div className="mt-5 flex flex-col gap-6">{children}</div>
    </section>
  );
}

function PaperEntry({
  title,
  meta,
  children,
}: {
  title: string;
  meta: string;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h3 className="text-[15px] font-semibold text-black">{title}</h3>
        <span className="font-mono text-[0.72rem] text-black/60">{meta}</span>
      </div>
      {children}
    </div>
  );
}

export default function ResumePage() {
  return (
    <div className="mx-auto max-w-4xl px-6 pb-28 pt-32 md:pt-36">
      <div className="mb-10 flex items-center justify-between print:hidden">
        <p className="eyebrow flex items-center gap-3">
          <span className="text-ink-faint">Résumé</span>
          <span className="h-px w-8 bg-current opacity-40" />
          <span>Document</span>
        </p>
        <a
          href={site.resume.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 rounded-full bg-indigo px-6 py-3 text-sm font-medium text-white shadow-[0_8px_32px_-12px_var(--glow)] transition-all duration-300 hover:bg-indigo/90"
        >
          <Download className="h-4 w-4" />
          Download PDF
        </a>
      </div>

      {/* Paper sheet — intentionally stays warm-white in both themes */}
      <article className="print-sheet overflow-hidden rounded-2xl bg-[#fbfaf6] text-black shadow-[0_32px_80px_-40px_rgba(0,0,0,0.5)]">
        <div className="px-8 py-12 md:px-16 md:py-16">
          <header>
            <h1 className="text-3xl font-semibold tracking-tight text-black md:text-4xl">
              {site.name}
            </h1>
            <p className="mt-1.5 text-sm text-black/70">
              Software Engineer · Researcher · {site.location}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[0.72rem] text-black/60">
              <a href={`mailto:${site.contact.email}`} className="flex items-center gap-1.5 hover:text-black">
                <Mail className="h-3.5 w-3.5" />
                {site.contact.email}
              </a>
              <a href={site.contact.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-black">
                {site.contact.github.replace("https://", "")}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
              <a href={site.contact.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-black">
                linkedin.com/in/samvrit-srinath
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </header>

          <PaperSection title="Education">
            <PaperEntry
              title={`${education.university} — ${education.degree}`}
              meta={education.duration}
            >
              <p className="mt-1.5 text-sm leading-relaxed text-black/75">
                {education.details}. Focus: {education.focus}. Regents Scholar.
              </p>
            </PaperEntry>
          </PaperSection>

          <PaperSection title="Experience">
            {experience.map((company) =>
              company.roles.map((role) => (
                <PaperEntry
                  key={role.role}
                  title={`${company.company} — ${role.role}`}
                  meta={role.duration}
                >
                  {role.description.length > 0 && (
                    <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed text-black/75">
                      {role.description.map((d, i) => (
                        <li key={i}>{d}</li>
                      ))}
                    </ul>
                  )}
                </PaperEntry>
              )),
            )}
          </PaperSection>

          <PaperSection title="Research & Publications">
            {researchAreas.flatMap((area) => area.papers).map((pub) => (
              <PaperEntry key={pub.href} title={pub.title} meta={`${pub.year} · ${pub.venue}`}>
                {pub.authors && pub.authors.length > 0 && (
                  <p className="mt-1.5 text-sm text-black/60">
                    {pub.authors.join(", ")}
                  </p>
                )}
                {pub.note && (
                  <p className="mt-1 text-sm text-black/60">{pub.note}</p>
                )}
              </PaperEntry>
            ))}
          </PaperSection>

          <PaperSection title="Teaching">
            {teaching.map((company) =>
              company.roles.map((role) => (
                <PaperEntry
                  key={role.role}
                  title={`${company.company} — ${role.role}`}
                  meta={role.duration}
                >
                  <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-sm leading-relaxed text-black/75">
                    {role.description.slice(0, 2).map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                </PaperEntry>
              )),
            )}
          </PaperSection>

          <PaperSection title="Technical Skills">
            <div className="flex flex-col gap-3">
              {skills.map((s) => (
                <div key={s.group} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm">
                  <span className="w-44 shrink-0 font-mono text-[0.72rem] font-semibold uppercase tracking-wider text-black/60">
                    {s.group}
                  </span>
                  <span className="text-black/80">{s.items.join(", ")}</span>
                </div>
              ))}
            </div>
          </PaperSection>

          <PaperSection title="Leadership">
            {clubs.map((club) => (
              <PaperEntry key={club.name} title={club.name} meta={club.role} />
            ))}
          </PaperSection>
        </div>
      </article>
    </div>
  );
}