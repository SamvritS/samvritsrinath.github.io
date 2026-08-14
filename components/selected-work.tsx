import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { featuredProjects, spotlightProject } from "@/data/projects";
import { SectionHeading } from "@/components/section-heading";
import { MetricRow } from "@/components/metric";
import { Diagram } from "@/components/diagram";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";

export function SelectedWork() {
  const more = featuredProjects.slice(1, 5);
  const spotlight = spotlightProject;
  const pipeline = spotlight?.sections.find((s) => s.type === "diagram");

  return (
    <section id="work" className="mx-auto max-w-6xl px-6 py-24 md:py-36">
      <SectionHeading
        index="03"
        kicker="Selected Work"
        title="Projects with papers, benchmarks, and shipped systems."
        description="Research and systems engineering with measurable outcomes — each case study links to its source, dataset, or paper."
      />

      {spotlight && (
        <Reveal>
          <Link
            href={`/work/${spotlight.slug}`}
            className="glass-card group relative block overflow-hidden rounded-3xl p-8 transition-all duration-300 hover:border-line-strong hover:shadow-[0_32px_80px_-48px_var(--glow)] md:p-14"
          >
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="eyebrow mb-4">{spotlight.eyebrow}</p>
              <h3 className="text-3xl font-semibold tracking-tight text-ink md:text-5xl">
                {spotlight.title}
              </h3>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-soft md:text-lg">
                {spotlight.tagline}
              </p>
            </div>
            <span className="flex shrink-0 items-center gap-1.5 self-start font-mono text-xs uppercase tracking-[0.18em] text-indigo">
              Case study
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </div>

          <div className="mt-12 border-t border-line pt-10">
            <MetricRow metrics={spotlight.metrics} />
          </div>

          {pipeline?.type === "diagram" && (
            <div className="mt-12 rounded-2xl border border-line bg-surface/60 p-6 md:p-10">
              <Diagram data={pipeline.diagram} />
            </div>
          )}
          </Link>
        </Reveal>
      )}

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {more.map((project, i) => (
          <Reveal key={project.slug} delay={i * 0.06} className="h-full">
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>

      <div className="mt-14 flex justify-center">
        <Link
          href="/work"
          className="glass-float flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium text-ink transition-all duration-300 hover:border-line-strong"
        >
          View all work
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}