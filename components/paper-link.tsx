import { ArrowUpRight, FileText } from "@/components/ui-icons";
import type { Paper } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PaperLink({ paper, className }: { paper: Paper; className?: string }) {
  return (
    <a
      href={paper.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex flex-col gap-2 border border-line bg-surface p-6 transition-colors hover:border-accent",
        className,
      )}
    >
      <span className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-ink-faint">
        Paper
      </span>
      <span className="text-lg font-semibold tracking-tight text-ink transition-colors ">
        {paper.title}
      </span>
      <span className="text-sm text-ink-soft">
        {paper.venue}
        {paper.year ? ` · ${paper.year}` : ""}
      </span>
      <span className="mt-2 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-ink">
        <FileText className="h-4 w-4" aria-hidden />
        Open PDF
        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
      </span>
    </a>
  );
}

export function PaperPill({ paper }: { paper: Paper }) {
  return (
    <a
      href={paper.href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 border border-line px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-ink"
    >
      <FileText className="h-4 w-4" aria-hidden />
      Paper
      <ArrowUpRight className="h-4 w-4" aria-hidden />
    </a>
  );
}