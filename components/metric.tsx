import { cn } from "@/lib/utils";

type MetricProps = {
  value: string;
  label: string;
  className?: string;
};

export function Metric({ value, label, className }: MetricProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span className="text-3xl font-semibold tracking-tight text-ink md:text-4xl">
        {value}
      </span>
      <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-ink-faint">
        {label}
      </span>
    </div>
  );
}

export function MetricRow({
  metrics,
  className,
}: {
  metrics: { value: string; label: string }[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-8 gap-y-8 md:grid-cols-4",
        className,
      )}
    >
      {metrics.map((m) => (
        <Metric key={m.label} value={m.value} label={m.label} />
      ))}
    </div>
  );
}