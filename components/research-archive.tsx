import { ArrowUpRight, FileText } from "@/components/ui-icons";
import { CitationControl } from "@/components/citation-control";
import { HarmonicRegister } from "@/components/atmosphere/harmonic-register";
import { researchAreas } from "@/data/research";
import { clean } from "@/lib/copy";

export function ResearchArchive({ level = 3 }: { level?: 2 | 3 }) {
  const AreaHeading = level === 2 ? "h2" : "h3";
  const PaperHeading = level === 2 ? "h3" : "h4";

  return (
    <div className="flex flex-col gap-16">
      {researchAreas.map((area) => (
        <div
          key={area.title}
          data-testid="research-entry"
          style={{ "--hue": area.hue } as React.CSSProperties}
        >
          <div className="border-t hue-line pt-6">
            <AreaHeading className="text-xl font-semibold tracking-tight text-ink md:text-2xl">
              {clean(area.title)}
            </AreaHeading>
            <p className="read mt-3">{clean(area.description)}</p>
            <p className="mt-4 font-mono text-xs tracking-[0.12em] text-ink-faint">
              {area.projects.map(clean).join(" · ")}
            </p>
            <HarmonicRegister
              variant="spectral"
              className="mt-6 h-10 w-full max-w-md opacity-80"
            />
          </div>

          <div className="mt-8 flex flex-col">
            {area.papers.map((paper) => {
              const pdf = paper.href.endsWith(".pdf");
              return (
                <article
                  key={paper.href}
                  className="grid gap-4 border-t border-line py-7 md:grid-cols-[160px_1fr] md:gap-8"
                >
                  <div>
                    <p className="font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-ink">
                      {clean(paper.venue)}
                    </p>
                    <p className="mt-1 font-mono text-xs tabular-nums text-ink-faint">
                      {paper.year}
                    </p>
                  </div>

                  <div>
                    <PaperHeading className="max-w-3xl text-lg font-semibold leading-snug tracking-tight text-ink">
                      {clean(paper.title)}
                    </PaperHeading>
                    {paper.authors && paper.authors.length > 0 && (
                      <p className="mt-2 text-sm text-ink-faint">
                        {paper.authors.join(", ")}
                      </p>
                    )}
                    {paper.note && (
                      <p className="mt-2 font-mono text-xs text-ink-faint">
                        {clean(paper.note)}
                      </p>
                    )}
                    <p className="read mt-3">{clean(paper.abstract)}</p>

                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
                      <p className="font-mono text-xs text-ink-faint">
                        {paper.tags.join(" · ")}
                      </p>
                      <a
                        href={paper.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${pdf ? "PDF" : "arXiv"}: ${paper.title}`}
                        className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.18em] text-ink transition-colors hover:text-wavelength"
                      >
                        {pdf && <FileText className="h-3.5 w-3.5" aria-hidden />}
                        {pdf ? "PDF" : "arXiv"}
                        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                      </a>
                    </div>

                    <CitationControl paper={paper} className="mt-4" />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
