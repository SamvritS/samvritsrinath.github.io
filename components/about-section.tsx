import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { education } from "@/data/education";
import { SectionHeading } from "@/components/section-heading";

export function AboutSection() {
  return (
    <section id="about" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-36">
        <SectionHeading
          index="04"
          kicker="About"
          title="Engineer, researcher, teacher."
          description="Systems work at the intersection of research and production — and a deep investment in how the next generation of engineers learns."
        />

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
          <div>
            <p className="text-base leading-relaxed text-ink-soft md:text-[17px]">
              I&apos;m a B.S./M.S. computer science student at UC San Diego headed
              to Arista Networks, where I&apos;ve built switch modeling frameworks,
              device-communication infrastructure, and diagnostics for
              next-generation Ethernet hardware. My research sits at the
              intersection of internet measurement and computing education, and
              I&apos;ve spent years teaching everything from systems programming to
              advanced data structures.
            </p>
            <Link
              href="/about"
              className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-indigo"
            >
              More about me
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="rounded-2xl border border-line bg-surface/60 p-8">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-ink-faint">
                Education
              </span>
              <h3 className="text-lg font-semibold tracking-tight text-ink">
                {education.university}
              </h3>
              <p className="text-sm text-ink-soft">
                {education.degree} · {education.duration}
              </p>
              <p className="mt-2 text-sm text-indigo">{education.details}</p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 border-t border-line pt-6">
              {education.focus.split("·").map((f) => (
                <span
                  key={f}
                  className="rounded-full border border-line px-3 py-1 font-mono text-xs text-ink-faint"
                >
                  {f.trim()}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}