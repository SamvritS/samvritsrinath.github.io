import type { Metadata } from "next";
import { PageHeader } from "@/components/page-header";
import { Playground } from "@/components/playground";

export const metadata: Metadata = {
  title: "Playground",
  description: "A pointer-driven particle field experiment.",
  alternates: { canonical: "/playground" },
};

export default function PlaygroundPage() {
  return (
    <div className="mx-auto min-h-[70svh] max-w-6xl px-6 pb-24 pt-36 md:pt-44">
      <PageHeader
        index="05"
        kicker="Interactive study"
        title="Playground"
        description="Move the pointer through the field to redirect the particle network."
      />
      <div className="mt-12">
        <Playground />
      </div>
    </div>
  );
}
