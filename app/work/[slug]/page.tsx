import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { bySlug, projects } from "@/data/projects";
import { MetricRow } from "@/components/metric";
import { Figure } from "@/components/figure";
import { VisualStory } from "@/components/visual-story";

export const dynamicParams = false;

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
    openGraph: {
      title: `${project.title} — ${project.tagline}`,
      description: project.description,
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

  return (
    <div className="mx-auto max-w-6xl px-6 pb-28 pt-32 md:pt-40">
      <Link
        href="/work"
        className="mb-14 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-ink-soft transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        All work
      </Link>

      <header className="max-w-4xl">
        <p className="eyebrow mb-6 flex items-center gap-3">
          <span>{project.eyebrow}</span>
          <span className="h-px w-8 bg-current opacity-40" />
          <span className="text-ink-faint">{project.year}</span>
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-ink md:text-6xl">
          {project.title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-soft md:text-xl">
          {project.tagline}
        </p>
      </header>

      <div className="mt-14 border-t border-line pt-10">
        <MetricRow metrics={project.metrics} />
      </div>

      <div className="mt-16 flex flex-wrap items-center gap-3">
        {project.technologies.map((t) => (
          <span
            key={t}
            className="rounded-full border border-line px-3.5 py-1.5 font-mono text-xs text-ink-soft"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        {project.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target={link.external ? "_blank" : undefined}
            rel={link.external ? "noopener noreferrer" : undefined}
            className="flex items-center gap-1.5 rounded-full border border-line px-6 py-3 text-sm font-medium text-ink transition-all duration-300 hover:border-line-strong hover:text-indigo"
          >
            {link.label}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        ))}
      </div>

      <div className="mt-10 max-w-4xl">
        <Figure figure={{ src: project.cover, alt: project.coverAlt, caption: project.coverAlt, source: project.title }} number={1} />
      </div>

      <div className="mt-10 border-t border-line pt-10">
        <VisualStory sections={project.sections} />
      </div>

      <div className="mt-24 flex justify-between border-t border-line pt-10">
        <Link
          href="/work"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-ink-soft transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          All work
        </Link>
        <Link
          href={`/work/${next.slug}`}
          className="inline-flex items-center gap-2 text-right font-mono text-xs uppercase tracking-[0.18em] text-indigo"
        >
          {next.title}
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}