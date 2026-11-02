import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { ResearchArchive } from "@/components/research-archive";

export const metadata: Metadata = {
  title: "Research",
  description:
    "Internet measurement and computing-education research: IP ownership attribution, country-in-the-middle exposure, and LLM-era CS education.",
  alternates: { canonical: "/research" },
};

export default function ResearchPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 pb-28 pt-36 md:pt-44">
      <PageHeader
        index="02"
        kicker="Research"
        title="Internet measurement and CS education."
        description=""
      />

      <div className="mt-16">
        <ResearchArchive level={2} />
      </div>
    </div>
  );
}
