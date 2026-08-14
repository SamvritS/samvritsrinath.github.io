import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { publications, researchAreas, researchStats } from "@/data/research";
import { SectionHeading } from "@/components/section-heading";
import { Metric } from "@/components/metric";

export function ResearchSection() {
  return (
    <section id="research" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-36">
        <SectionHeading
          index="04"
          kicker="Research"
          title="Internet measurement and computing education."
          description="Two threads: mapping who actually operates the network, and studying how students learn with generative AI."
        />

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-20">
          {/* Areas */}
          <div className="flex flex-col gap-10">
            {researchAreas.map((area) => (
              <div key={area.title}>
                <h3 className="text-lg font-semibold tracking-tight text-ink">
                  {area.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                  {area.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {area.projects.map((p) => (
                    <span
                      key={p}
                      className="rounded-full border border-line px-3 py-1 font-mono text-xs text-ink-faint"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Publications */}
          <div className="flex flex-col">
            <div className="mb-8 grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-2">
              {researchStats.map((s) => (
                <Metric key={s.label} value={s.value} label={s.label} />
              ))}
            </div>
            <div className="flex flex-col gap-6">
              {publications.map((pub) => (
                <a
                  key={pub.href}
                  href={pub.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card group rounded-2xl p-6 transition-all duration-300 hover:border-line-strong"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="font-mono text-xs uppercase tracking-[0.2em] text-indigo">
                      {pub.venue}
                    </span>
                    <span className="font-mono text-xs text-ink-faint">
                      {pub.year}
                    </span>
                  </div>
                  <h3 className="text-[15px] font-medium leading-snug text-ink group-hover:text-indigo md:text-base">
                    {pub.title}
                  </h3>
                  <p className="mt-3 line-clamp-2 text-sm text-ink-soft">
                    {pub.abstract}
                  </p>
                  <span className="mt-4 flex items-center gap-1 font-mono text-xs uppercase tracking-[0.18em] text-indigo">
                    Read the paper
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </a>
              ))}
            </div>
            <Link
              href="/research"
              className="mt-8 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-indigo"
            >
              All research
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}