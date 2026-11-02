import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, FileText } from "@/components/ui-icons";
import {
  featuredProjects,
  projects,
  spotlightProject,
} from "@/data/projects";
import { clean } from "@/lib/copy";
import { MetricRow } from "@/components/metric";
import { ProjectCover } from "@/components/project-cover";
import { SectionHeading } from "@/components/section-heading";

export function SelectedWork() {
  if (!spotlightProject) return null;

  const spotlight = spotlightProject;
  const ledger = featuredProjects
    .filter((project) => project.slug !== spotlight.slug)
    .slice(0, 4);

  return (
    <SectionHeading
      id="work"
      rail="03 / SELECTED PROJECTS"
      kicker="Work"
      title="Selected work"
      atmosphere="article"
      register="seam"
      divider
    >
      <article
        data-testid="work-lead"
        data-hue={spotlight.hue}
        className={`project-accent-${spotlight.slug}`}
        style={{ "--hue": spotlight.hue } as React.CSSProperties}
      >
        {spotlight.cover && (
          <Image
            src={spotlight.cover}
            alt={spotlight.coverAlt ?? spotlight.title}
            width={5834}
            height={1675}
            sizes="(min-width: 1024px) 840px, 100vw"
            className="project-accent-line h-auto w-full border bg-surface"
          />
        )}

        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <p className="eyebrow project-accent-text">{clean(spotlight.eyebrow)}</p>
            <h3 className="type-h2 mt-3 text-ink">
              {clean(spotlight.title)}
            </h3>
            <p className="read mt-4">{clean(spotlight.tagline)}</p>

            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-faint">
                  Role
                </dt>
                <dd className="mt-1 text-sm text-ink">
                  {clean(spotlight.role)}
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-faint">
                  Record
                </dt>
                <dd className="mt-1 text-sm text-ink">{spotlight.year}</dd>
              </div>
            </dl>

            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href={`/work/${spotlight.slug}`}
                className="inline-flex items-center gap-1.5 border border-ink bg-ink px-5 py-2.5 text-sm font-medium text-void transition-colors hover:border-accent hover:bg-accent"
              >
                Details
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              {spotlight.paper && (
                <a
                  href={spotlight.paper.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.18em] text-ink transition-colors hover:text-accent"
                >
                  <FileText className="h-3.5 w-3.5" aria-hidden />
                  {clean(spotlight.paper.venue)} paper
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                </a>
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <MetricRow
              metrics={spotlight.metrics.slice(0, 4)}
              tone="project"
              className="grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-2"
            />
          </div>
        </div>
      </article>

      <div data-testid="work-ledger" className="mt-16">
        {ledger.map((project, index) => (
          <article key={project.slug}>
            <Link
              href={`/work/${project.slug}`}
              style={{ "--hue": project.hue } as React.CSSProperties}
              className={`project-card project-accent-${project.slug} group grid gap-6 border-t border-line py-8 md:grid-cols-12 md:gap-8`}
            >
              <div className="md:col-span-3">
                <ProjectCover
                  project={project}
                  sizes="(min-width: 768px) 240px, 100vw"
                />
              </div>

              <div className="md:col-span-9">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-faint">
                  <span className="text-ink">
                    {String(index + 2).padStart(2, "0")}
                  </span>
                  <span>{project.year}</span>
                  <span className="project-accent-text">
                    {clean(project.category)}
                  </span>
                </div>

                <h3 className="project-card-title type-h3 mt-3 pr-6 text-ink transition-colors">
                  {clean(project.title)}
                </h3>
                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
                  {clean(project.tagline)}
                </p>

                <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
                  {project.metrics.slice(0, 2).map((metric) => (
                    <div key={metric.label}>
                      <p className="font-mono text-sm font-medium tabular-nums text-ink">
                        {metric.value}
                      </p>
                      <p className="mt-0.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-faint">
                        {metric.label}
                      </p>
                    </div>
                  ))}
                </div>

                <p className="mt-4 font-mono text-xs tracking-[0.12em] text-ink-faint">
                  {project.technologies.slice(0, 5).join(" · ")}
                </p>
              </div>
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-ink-faint">
          {projects.length} records in the archive
        </p>
        <Link
          href="/work"
          className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.18em] text-ink transition-colors hover:text-accent"
        >
          All work
          <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </SectionHeading>
  );
}
