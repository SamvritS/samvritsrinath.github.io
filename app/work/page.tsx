import type { Metadata } from "next";
import { projects } from "@/data/projects";
import { ProjectCard } from "@/components/project-card";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Research, systems engineering, and software across internet measurement, LLM infrastructure, and education.",
};

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-28 pt-36 md:pt-44">
      <header className="mb-14 max-w-3xl">
        <p className="eyebrow mb-5 flex items-center gap-3">
          <span className="text-ink-faint">Work</span>
          <span className="h-px w-8 bg-current opacity-40" />
          <span>Systems · Research · Software</span>
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-ink md:text-6xl">
          All the work.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft md:text-lg">
          Every project below has a case study with the system, the evidence,
          and the numbers that matter.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </div>
  );
}