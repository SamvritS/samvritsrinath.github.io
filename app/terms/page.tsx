import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Terms",
    description: "Terms of use for this site.",
    path: "/terms",
  }),
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24">
      <p className="eyebrow">Policy</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink">
        Terms
      </h1>
      <div className="mt-8 flex flex-col gap-6 text-sm leading-relaxed text-ink-soft">
        <p>
          Content on this site is published by Samvrit Srinath to document
          projects and research. You may read, link to, and cite it with
          attribution.
        </p>
        <p>
          Project code linked from this site carries its own license in
          each repository. Papers and figures belong to their authors and
          venues as noted on each page.
        </p>
        <p>
          The site is provided as is, with no warranty on availability or
          accuracy. If you reuse measurements or figures, verify them
          against the primary sources linked on each page.
        </p>
        <p className="font-mono text-xs tracking-widest text-ink-faint">
          LAST UPDATED 2026
        </p>
      </div>
    </div>
  );
}
