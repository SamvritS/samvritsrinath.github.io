import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { publications, researchAreas, researchStats } from "@/data/research";
import { SectionHeading } from "@/components/section-heading";
import { MetricRow } from "@/components/metric";

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
          Understanding systems.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft md:text-lg">
          Two threads of work — mapping who really operates the internet, and
          rethinking how we teach computer science in the generative-AI era.
        </p>
      </header>

      <SectionHeading
        index="01"
        kicker="Areas"
        title="Where the research lives."
      />

      <div className="grid gap-6 md:grid-cols-2">
        {researchAreas.map((area) => (
          <div
            key={area.title}
            className="rounded-2xl border border-line bg-surface/60 p-8"
          >
            <h3 className="text-lg font-semibold tracking-tight text-ink md:text-xl">
              {area.title}
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
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
          </div>
        ))}
      </div>

      <div className="mt-24">
        <SectionHeading
          index="02"
          kicker="Publications"
          title="What's been written up."
        />
        <div className="mb-12">
          <MetricRow metrics={[...researchStats]} />
        </div>
        <div className="flex flex-col gap-6">
          {publications.map((pub) => (
            <article
              key={pub.href}
              className="group rounded-2xl border border-line bg-surface/60 p-8 transition-all duration-300 hover:border-line-strong"
            >
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs uppercase tracking-[0.2em] text-indigo">
                  {pub.venue}
                </span>
                <span className="font-mono text-xs text-ink-faint">
                  {pub.year}
                </span>
              </div>
              <h3 className="text-lg font-semibold leading-snug tracking-tight text-ink group-hover:text-indigo md:text-2xl">
                {pub.title}
              </h3>
              <p className="mt-3 text-sm text-ink-faint">{pub.authors.join(" · ")}</p>
              <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
                {pub.abstract}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
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
                className="mt-6 inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.18em] text-indigo"
              >
                Read on arXiv
                <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}