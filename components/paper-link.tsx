import { ArrowUpRight, FileText } from "lucide-react";
import type { Paper } from "@/lib/types";
import { cn } from "@/lib/utils";

export function PaperLink({ paper, className }: { paper: Paper; className?: string }) {
  return (
    <a
      href={paper.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "group flex flex-col gap-2 rounded-2xl border border-line bg-surface/50 p-6 transition-colors hover:border-line-strong",
        className,
      )}
    >
      <span className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-ink-faint">
        Paper
      </span>
      <span className="text-lg font-semibold tracking-tight text-ink transition-colors group-hover:text-indigo">
        {paper.title}
      </span>
      <span className="text-sm text-ink-soft">
        {paper.venue}
        {paper.year ? ` · ${paper.year}` : ""}
      </span>
      <span className="mt-2 flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-indigo">
        <FileText className="h-4 w-4" />
        Open PDF
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
      className="flex items-center gap-1.5 rounded-full border border-line px-6 py-3 text-sm font-medium text-ink transition-all duration-300 hover:border-line-strong hover:text-indigo"
    >
      Paper
      <ArrowUpRight className="h-4 w-4" />
    </a>
  );
}