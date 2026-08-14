import Image from "next/image";
import type { Project } from "@/lib/types";

function initials(title: string) {
  const words = title.replace(/[^A-Za-z0-9 ]/g, " ").split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

export function ProjectCover({ project, sizes }: { project: Project; sizes: string }) {
  if (project.cover) {
    return (
      <Image
        src={project.cover}
        alt={project.coverAlt ?? project.title}
        fill
        sizes={sizes}
        className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
      />
    );
  }
  return (
    <div className="absolute inset-0 flex flex-col justify-between bg-gradient-to-br from-indigo via-violet to-blue p-6">
      <div className="flex items-start justify-between">
        <span className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-white/80">
          {project.category}
        </span>
        <span className="font-mono text-xs text-white/80">{project.year}</span>
      </div>
      <div className="flex items-end justify-between gap-4">
        <span className="text-3xl font-semibold tracking-tight text-white">
          {initials(project.title)}
        </span>
        <span className="h-10 w-10 rounded-full border border-white/40" />
      </div>
    </div>
  );
}