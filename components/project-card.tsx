import Link from "next/link";
import { ArrowUpRight } from "@/components/ui-icons";
import type { Project } from "@/lib/types";
import { clean } from "@/lib/copy";
import { ProjectCover } from "@/components/project-cover";
import { cn } from "@/lib/utils";

export function ProjectCard({
  project,
  featured = false,
  orientation = "stack",
}: {
  project: Project;
  featured?: boolean;
  orientation?: "stack" | "row";
}) {
  const tech = project.technologies.slice(0, orientation === "stack" ? 4 : 5);
  const row = orientation === "row";
  return (
    <Link
      href={`/work/${project.slug}`}
      style={{ "--hue": project.hue } as React.CSSProperties}
      data-hue={project.hue}
      className={cn(
        "group grid min-w-0 gap-6 border-t border-line py-7 transition-colors hover:border-wavelength",
        row
          ? "md:grid-cols-[280px_minmax(0,1fr)] md:gap-10 md:py-9"
          : "grid-cols-1",
      )}
    >
      <ProjectCover
        project={project}
        sizes={row ? "(max-width: 768px) 100vw, 280px" : "(min-width: 1280px) 896px, (min-width: 1024px) 896px, 100vw"}
        featured={featured}
      />
      <div className="flex min-w-0 flex-col">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="flex items-center gap-3 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-ink-faint">
            {clean(project.category)}
          </span>
          <span className="font-mono text-xs text-ink-faint tabular-nums">
            {project.year}
          </span>
        </div>
        <h3 className="pr-6 text-lg font-semibold tracking-tight text-ink">
          {clean(project.title)}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">
          {clean(project.tagline)}
        </p>
        {tech.length > 0 && (
          <p className="mt-4 font-mono text-xs tracking-widest text-ink-faint">
            {tech.join(" + ")}
          </p>
        )}
        <span className="mt-5 flex items-center gap-1 font-mono text-xs uppercase tracking-[0.18em] text-ink">
          Details
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  );
}
