import type { Metadata } from "next";
import { projects } from "@/data/projects";
import { WorkArchive } from "@/components/work-archive";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Research, systems engineering, and software across internet measurement, LLM infrastructure, and education.",
};

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-28 pt-36 md:pt-44">
      <header className="mb-16 max-w-3xl">
        <p className="eyebrow mb-5 flex items-center gap-3">
          <span className="text-ink-faint">Work</span>
          <span className="h-px w-8 bg-current opacity-40" />
          <span>Systems · Research · Software</span>
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-ink md:text-6xl">
          Work &amp; case studies.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft md:text-lg">
          Every project below has a case study with the system, the evidence,
          and the numbers that matter.
        </p>
      </header>

      <WorkArchive projects={projects} />
    </div>
  );
}