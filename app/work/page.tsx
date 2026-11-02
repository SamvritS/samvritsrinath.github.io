import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";
import { PageHeader } from "@/components/page-header";
import { WorkArchive } from "@/components/work-archive";
import { projects } from "@/data/projects";

export const metadata: Metadata = pageMetadata({
  title: "Projects",
  description:
    "Research, systems engineering, and software across internet measurement, LLM infrastructure, and education.",
  path: "/work",
});

export default function WorkPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-28 pt-36 md:pt-44">
      <PageHeader
        index="01"
        kicker="Work archive"
        title="Projects and details."
        description="Every project below has a details page with the system, the evidence, and the numbers that matter."
      />

      <div className="mt-16">
        <WorkArchive projects={projects} />
      </div>
    </div>
  );
}
