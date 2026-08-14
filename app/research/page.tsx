import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { researchAreas } from "@/data/research";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Internet measurement and computing-education research: IP ownership attribution, country-in-the-middle exposure, and LLM-era CS education.",
};

export default function ResearchPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-28 pt-36 md:pt-44">
      <header className="mb-20 max-w-3xl">
        <p className="eyebrow mb-5 flex items-center gap-3">
          <span className="text-ink-faint">Research</span>
          <span className="h-px w-8 bg-current opacity-40" />
          <span>Measurement · Education</span>
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-ink md:text-6xl">
          Internet measurement &amp; CS education.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft md:text-lg">
          Two threads of work — mapping who really operates the internet, and
          rethinking how we teach computer science in the generative-AI era.
        </p>
      </header>

      <div className="flex flex-col gap-10">
        {researchAreas.map((area, i) => (
          <section key={area.title}>
            <SectionHeading
              index={String(i + 1).padStart(2, "0")}
              kicker="Research area"
              title={area.title}
            />
            <div className="glass-card rounded-2xl p-8 md:p-10">
              <p className="max-w-2xl text-[15px] leading-relaxed text-ink-soft md:text-base">
                {area.description}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {area.projects.map((p) => (
                  <span
                    key={p}
                    className="rounded-full border border-line px-3 py-1 font-mono text-xs text-ink-faint"
                  >
                    {p}
                  </span>
                ))}
              </div>

              <div className="mt-10 flex flex-col gap-8 border-t border-line pt-8">
                {area.papers.map((pub) => (
                  <article
                    key={pub.href}
                    className="group rounded-2xl border border-line bg-surface/40 p-6 transition-all duration-300 hover:border-line-strong"
                  >
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-xs uppercase tracking-[0.2em] text-indigo">
                        {pub.venue}
                      </span>
                      <span className="font-mono text-xs text-ink-faint">
                        {pub.year}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold leading-snug tracking-tight text-ink group-hover:text-indigo md:text-xl">
                      {pub.title}
                    </h3>
                    {pub.authors && pub.authors.length > 0 && (
                      <p className="mt-2 text-sm text-ink-faint">
                        {pub.authors.join(" · ")}
                      </p>
                    )}
                    {pub.note && (
                      <p className="mt-2 font-mono text-xs text-ink-faint">
                        {pub.note}
                      </p>
                    )}
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                      {pub.abstract}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {pub.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-full border border-line px-3 py-1 font-mono text-xs text-ink-faint"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <a
                      href={pub.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.18em] text-indigo"
                    >
                      Read the paper
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}