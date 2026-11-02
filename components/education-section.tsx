import Link from "next/link";
import { ArrowUpRight } from "@/components/ui-icons";
import { LogoTile } from "@/components/logo-tile";
import { education } from "@/data/education";
import { clean } from "@/lib/copy";
import { SectionHeading } from "@/components/section-heading";

export function EducationSection() {
  return (
    <SectionHeading
      id="education"
      rail="05 / EDUCATION"
      kicker="Record"
      title="Education"
      description="Regents Scholar at UC San Diego, focused on systems, networking, and machine learning."
    >
      <div className="border-t border-line pt-6">
        <div className="grid gap-8 lg:grid-cols-[1fr_260px] lg:gap-12">
          <div>
            <div className="flex items-center gap-4">
              <LogoTile
                src={education.logo}
                alt={`${education.university} logo`}
                className="h-16 w-16"
                bare
              />
              <h3 className="text-xl font-semibold tracking-tight text-ink md:text-2xl">
                {clean(education.university)}
              </h3>
            </div>
            <p className="mt-2 text-sm text-ink-soft">
              {clean(education.degree)} · {clean(education.duration)}
            </p>
            <p className="mt-4 text-sm text-ink">{clean(education.details)}</p>
            <p className="mt-2 text-sm text-ink-soft">{clean(education.focus)}</p>
          </div>

          <div className="border-t border-line pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-faint">
              Coursework
            </p>
            <p className="mt-2 text-2xl font-semibold tabular-nums text-ink">
              {education.courses.length}
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              graduate and upper-division courses
            </p>
            <Link
              href="/about"
              className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.18em] text-ink transition-colors hover:text-wavelength"
            >
              Full record
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </SectionHeading>
  );
}
