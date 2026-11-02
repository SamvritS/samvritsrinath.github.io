import { cn } from "@/lib/utils";

export function SectionDivider({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      data-testid="section-divider"
      className={cn(
        "pointer-events-none absolute inset-x-0 top-0 z-10 flex h-6 items-center gap-3 px-6",
        className,
      )}
    >
      <span className="h-px flex-1 bg-line" />
      <svg
        viewBox="0 0 96 24"
        fill="none"
        className="h-6 w-24 shrink-0"
      >
        <path d="M0 12h28" stroke="var(--line-strong)" />
        <circle cx="40" cy="12" r="5" stroke="var(--line-strong)" />
        <circle cx="40" cy="12" r="1.5" fill="var(--accent)" />
        <path
          d="M45 12h18"
          stroke="var(--line-strong)"
          strokeDasharray="2 3"
        />
        <circle cx="69" cy="12" r="2" fill="var(--hue, var(--ink-faint))" />
        <path d="M71 12h25" stroke="var(--line)" />
      </svg>
      <span className="h-px w-16 bg-line" />
    </div>
  );
}
