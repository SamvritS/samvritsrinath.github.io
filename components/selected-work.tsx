import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { featuredProjects, projects, spotlightProject } from "@/data/projects";
import { SectionHeading } from "@/components/section-heading";
import { MetricRow } from "@/components/metric";
import { Visual } from "@/components/visuals/registry";
import { ProjectCard } from "@/components/project-card";
import { ProjectCover } from "@/components/project-cover";
import { Reveal } from "@/components/reveal";

export function SelectedWork() {
  const featured = featuredProjects.slice(1, 5);
  const spotlight = spotlightProject;
  const spotlightVisual = spotlight?.sections.find((s) => s.type === "visual");
  const featuredSlugs = new Set(featuredProjects.map((p) => p.slug));
  const moreProjects = projects.filter((p) => !featuredSlugs.has(p.slug)).slice(0, 4);

  return (
    <section id="work" className="mx-auto max-w-6xl px-6 py-24 md:py-36">
      <SectionHeading
        index="03"
        kicker="Selected Projects"
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

          {spotlightVisual && (
            <div className="mt-12 rounded-2xl border border-line bg-surface/60 p-6 md:p-10">
              <Visual id={spotlightVisual.visual} />
            </div>
          )}
          </Link>
        </Reveal>
      )}

      <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((project, i) => (
          <Reveal key={project.slug} delay={i * 0.06} className="h-full">
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>

      <div className="mt-16">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold tracking-tight text-ink">
            More projects
          </h3>
          <Link
            href="/work"
            className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.18em] text-indigo"
          >
            View all
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {moreProjects.map((project, i) => (
            <Reveal key={project.slug} delay={i * 0.04}>
              <Link
                href={`/work/${project.slug}`}
                className="glass-card group relative flex items-center gap-4 overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:border-line-strong hover:shadow-[0_20px_50px_-32px_var(--glow)]"
              >
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-space">
                  <ProjectCover
                    project={project}
                    sizes="96px"
                  />
                </div>
                <div className="min-w-0">
                  <div className="flex items-baseline justify-between gap-3">
                    <h4 className="truncate text-[15px] font-semibold tracking-tight text-ink transition-colors group-hover:text-indigo">
                      {project.title}
                    </h4>
                    <span className="shrink-0 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-faint">
                      {project.year}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-ink-soft">
                    {project.tagline}
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>

      <div className="mt-14 flex justify-center">
        <Link
          href="/work"
          className="glass-float flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium text-ink transition-all duration-300 hover:border-line-strong"
        >
          View all projects
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
