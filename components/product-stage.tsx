import type { ProductStageMode, Project, VisualId } from "@/lib/types";
import { Visual } from "@/components/visuals/registry";
import { cn } from "@/lib/utils";
import { AddressSpaceLazy, SpecSplitLazy } from "@/components/demos/lazy";

export function ProductStage({
  project,
  visual,
  mode,
  caption,
  className,
}: {
  project: Project;
  visual: VisualId;
  mode: ProductStageMode;
  caption?: string;
  className?: string;
}) {
  return (
    <section
      data-testid="product-stage"
      data-mode={mode}
      data-hue={project.hue}
      style={{ "--hue": project.hue } as React.CSSProperties}
      role="region"
      aria-label={`${project.title} product stage`}
      className={cn(
        "product-stage relative min-w-0 overflow-hidden border-y hue-line bg-void",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <span className="absolute left-0 top-0 h-5 w-5 border-l border-t hue-line" />
        <span className="absolute right-0 top-0 h-5 w-5 border-r border-t hue-line" />
        <span className="absolute bottom-0 left-0 h-5 w-5 border-b border-l hue-line" />
        <span className="absolute bottom-0 right-0 h-5 w-5 border-b border-r hue-line" />
      </div>

      <div className="grid min-h-[300px] gap-8 px-5 py-8 md:min-h-[420px] md:grid-cols-[minmax(0,1fr)_220px] md:items-end md:px-8 md:py-10">
        <div className="relative min-w-0 self-center">
          <div
            data-testid="product-stage-skeleton"
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 border border-line"
          />
          <div data-testid="product-stage-fallback" className="relative min-w-0 overflow-x-auto pb-1">
            {visual === "ownership-pipeline" && mode === "case-study" && (
              <AddressSpaceLazy />
            )}
            {visual === "specsplit-topology" && mode === "case-study" ? (
              <SpecSplitLazy />
            ) : (
              <Visual id={visual} mode={mode} />
            )}
          </div>
          {caption && (
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft">
              {caption}
            </p>
          )}
        </div>

        <aside
          data-testid="product-stage-live-readout"
          className="grid grid-cols-2 gap-x-5 gap-y-4 border-t hue-line pt-4 md:grid-cols-1 md:border-l md:border-t-0 md:pl-5 md:pt-0"
          aria-label={`${project.title} measurements`}
        >
          {project.metrics.slice(0, 4).map((metric) => (
            <div key={metric.label} className="min-w-0">
              <p className="font-mono text-xl font-medium tabular-nums hue-text md:text-2xl">
                {metric.value}
              </p>
              <p className="mt-1 font-mono text-[0.625rem] uppercase leading-relaxed tracking-[0.12em] text-ink-faint">
                {metric.label}
              </p>
            </div>
          ))}
        </aside>
      </div>
    </section>
  );
}
