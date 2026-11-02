"use client";

import { CopyButton } from "@/components/copy-button";
import { formatCitation, toBibtex } from "@/lib/bibtex";
import type { Publication } from "@/lib/types";

export function CitationControl({
  paper,
  className,
}: {
  paper: Publication;
  className?: string;
}) {
  const formatted = formatCitation(paper.citation, paper.venue);
  const bibtex = toBibtex(paper.citation);

  return (
    <details
      data-testid="citation-control"
      className={["citation-control", className].filter(Boolean).join(" ")}
    >
      <summary
        data-testid="citation-summary"
        className="citation-summary inline-flex cursor-pointer list-none items-center font-mono text-xs uppercase tracking-[0.18em] text-ink-soft transition-colors hover:text-ink"
      >
        Cite
      </summary>

      <div className="mt-3 border border-line bg-surface p-4">
        <p className="text-sm leading-relaxed text-ink-soft">{formatted}</p>

        <div className="mt-4">
          <p className="font-mono text-[0.625rem] uppercase tracking-[0.18em] text-ink-faint">
            BibTeX
          </p>
          <pre
            data-testid="bibtex-entry"
            className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap break-words font-mono text-xs leading-relaxed text-ink-soft"
          >{bibtex}</pre>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <CopyButton
            text={formatted}
            label="Copy citation"
            testId="copy-citation"
          />
          <CopyButton text={bibtex} label="Copy BibTeX" testId="copy-bibtex" />
        </div>
      </div>
    </details>
  );
}
