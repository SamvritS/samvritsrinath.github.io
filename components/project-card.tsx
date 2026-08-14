import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/types";
import { CardGlow } from "@/components/card-glow";
import { TechIcon } from "@/components/tech-icon";
import { ProjectCover } from "@/components/project-cover";

export function ProjectCard({ project }: { project: Project }) {
  const tech = project.technologies.slice(0, 5);
  return (
    <Link
      href={`/work/${project.slug}`}
      className="glass-card group relative flex h-full flex-col overflow-hidden rounded-2xl transition-all duration-300 hover:border-line-strong hover:shadow-[0_20px_60px_-32px_var(--glow)]"
    >
      <CardGlow />
      <div className="relative aspect-[16/10] overflow-hidden bg-space">
        <ProjectCover
          project={project}
          sizes="(min-width: 768px) 33vw, 100vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center justify-between">
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-ink-faint">
            {project.category}
          </span>
          <span className="font-mono text-xs text-ink-faint">
            {project.year}
          </span>
        </div>
        <h3 className="text-lg font-semibold tracking-tight text-ink transition-colors group-hover:text-indigo">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-soft">
          {project.tagline}
        </p>
        {tech.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            {tech.map((t) => (
              <TechIcon key={t} name={t} className="h-4 w-4 text-ink-faint" />
            ))}
          </div>
        )}
        <span className="mt-auto flex items-center gap-1 pt-4 font-mono text-xs uppercase tracking-[0.18em] text-indigo">
          Case study
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  );
}