import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, FileText } from "@/components/ui-icons";
import { bySlug, projects } from "@/data/projects";
import { MetricRow } from "@/components/metric";
import { VisualStory } from "@/components/visual-story";
import { PaperLink } from "@/components/paper-link";
import { ProductStage } from "@/components/product-stage";
import type { Project } from "@/lib/types";

export const dynamicParams = false;

const INTERACTIVE_VISUALS = new Set([
  "ownership-pipeline",
  "specsplit-topology",
  "honeyllm-flow",
  "lomaverse-orbit",
  "megakernel-anatomy",
]);

function readingMinutes(project: Project): number {
  const words = project.sections.reduce((total, section) => {
    if (section.type !== "prose") return total;
    return total + section.body.join(" ").split(/\s+/).filter(Boolean).length;
  }, 0);
  return Math.max(1, Math.ceil(words / 200));
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = bySlug(slug);
  if (!project) return { title: "Project" };
  return {
    title: project.title,
    description: project.tagline,
    alternates: { canonical: `/work/${project.slug}` },
    openGraph: {
      title: `${project.title}: ${project.tagline}`,
      description: project.description,
      images: [
        {
          url: "/opengraph-image",
          width: 1200,
          height: 630,
          alt: `${project.title}: ${project.tagline}`,
        },
      ],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = bySlug(slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];
  const primaryVisualIndex = project.sections.findIndex(
    (section) => section.type === "visual",
  );
  const primaryVisual = project.sections[primaryVisualIndex];
  const showProductStage =
    primaryVisual?.type === "visual" &&
    INTERACTIVE_VISUALS.has(primaryVisual.visual);
  const minutes = readingMinutes(project);

  return (
    <div
      style={{ "--hue": project.hue } as React.CSSProperties}
      data-hue={project.hue}
    >
      <div className="mx-auto max-w-6xl px-6 pb-28 pt-32 md:pt-40">
        <Link
          href="/work"
          className="mb-14 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-ink-soft transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          All projects
        </Link>

        <header className="mx-auto max-w-[760px]">
          <p className="eyebrow mb-6 flex items-center gap-3">
            <span>{project.eyebrow}</span>
            <span className="h-px w-8 bg-current opacity-40" />
            <span className="text-ink-faint">{project.year}</span>
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-ink md:text-6xl">
            {project.title}
          </h1>
          <p className="mt-6 max-w-[65ch] text-lg leading-relaxed text-ink-soft md:text-xl">
            {project.tagline}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-ink-faint">
            <span className="text-ink">{project.role}</span>
            <span>{project.year}</span>
            <span>{minutes} min read</span>
            {project.team && <span>{project.team}</span>}
            {project.paper && (
              <a
                href={project.paper.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-ink transition-colors hover:text-wavelength"
              >
                <FileText className="h-3.5 w-3.5" aria-hidden />
                Paper
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </a>
            )}
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-1.5 text-ink transition-colors hover:text-wavelength"
              >
                {link.label}
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </a>
            ))}
          </div>
          <p className="mt-4 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-faint">
            <span className="text-ink">Tech stack</span>
            <span className="mx-2 opacity-40">/</span>
            {project.technologies.join(" · ")}
          </p>
        </header>

        {showProductStage && primaryVisual?.type === "visual" && (
          <div className="mx-auto mt-12 max-w-[860px]">
            <ProductStage
              project={project}
              visual={primaryVisual.visual}
              mode="case-study"
              caption={primaryVisual.caption}
            />
          </div>
        )}

        <article className="mx-auto mt-14 border-t border-line pt-10">
          <VisualStory
            sections={project.sections}
            primaryVisualIndex={showProductStage ? primaryVisualIndex : -1}
          />
        </article>

        <section
          aria-label="Project facts"
          className="mx-auto mt-20 max-w-[680px] border-t border-line pt-8"
        >
          <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-ink-faint">
            Project facts
          </h2>
          <dl className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-faint">
                Role
              </dt>
              <dd className="mt-1 text-sm text-ink">{project.role}</dd>
            </div>
            <div>
              <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-faint">
                Year
              </dt>
              <dd className="mt-1 text-sm text-ink">{project.year}</dd>
            </div>
            {project.team && (
              <div>
                <dt className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-faint">
                  Team
                </dt>
                <dd className="mt-1 text-sm text-ink">{project.team}</dd>
              </div>
            )}
          </dl>

          <div className="mt-8">
            <MetricRow metrics={project.metrics} tone="hue" />
          </div>

          <div className="mt-8">
            <h3 className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink-faint">
              Tech stack
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.technologies.map((t) => (
                <span
                  key={t}
                  className="border px-3.5 py-1.5 font-mono text-xs hue-line text-ink-soft"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {project.paper && (
          <div className="mx-auto mt-20 max-w-[680px]">
            <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-ink-faint">
              Primary sources
            </h2>
            <div className="mt-6 max-w-md">
              <PaperLink paper={project.paper} />
            </div>
          </div>
        )}

        <div className="mx-auto mt-24 flex max-w-[760px] justify-between border-t border-line pt-10">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-ink-soft transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            All projects
          </Link>
          <Link
            href={`/work/${next.slug}`}
            className="inline-flex items-center gap-2 text-right font-mono text-xs uppercase tracking-[0.18em] text-ink"
          >
            {next.title}
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </div>
  );
}
