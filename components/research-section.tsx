import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { researchAreas } from "@/data/research";
import { SectionHeading } from "@/components/section-heading";

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

        <div className="grid gap-8 lg:grid-cols-2">
          {researchAreas.map((area) => (
            <div key={area.title} className="glass-card flex flex-col rounded-2xl p-8">
              <h3 className="text-lg font-semibold tracking-tight text-ink md:text-xl">
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

              <div className="mt-8 flex flex-col gap-5 border-t border-line pt-6">
                {area.papers.map((pub) => (
                  <a
                    key={pub.href}
                    href={pub.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group block"
                  >
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-indigo">
                        {pub.venue}
                      </span>
                      <span className="font-mono text-xs text-ink-faint">
                        {pub.year}
                      </span>
                    </div>
                    <h4 className="text-[15px] font-medium leading-snug text-ink transition-colors group-hover:text-indigo">
                      {pub.title}
                    </h4>
                    {pub.note && (
                      <p className="mt-1 font-mono text-xs text-ink-faint">
                        {pub.note}
                      </p>
                    )}
                    <span className="mt-2 flex items-center gap-1 font-mono text-xs uppercase tracking-[0.18em] text-indigo">
                      Read the paper
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Link
            href="/research"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-indigo"
          >
            All research
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}