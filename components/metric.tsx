import { cn } from "@/lib/utils";

type MetricProps = {
  value: string;
  label: string;
  className?: string;
  tone?: "ink" | "hue";
};

export function Metric({ value, label, className, tone = "ink" }: MetricProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <span
        className={cn(
          "text-3xl font-semibold tracking-tight tabular-nums md:text-4xl",
          tone === "hue" ? "hue-text" : "text-ink",
        )}
      >
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
  tone = "ink",
}: {
  metrics: { value: string; label: string }[];
  className?: string;
  tone?: "ink" | "hue";
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-8 gap-y-8 md:grid-cols-4",
        className,
      )}
    >
      {metrics.map((m) => (
        <Metric key={m.label} value={m.value} label={m.label} tone={tone} />
      ))}
    </div>
  );
}
