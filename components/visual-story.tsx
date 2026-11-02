import { ArrowUpRight } from "@/components/ui-icons";
import type { ContentSection } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Visual } from "@/components/visuals/registry";
import { VisualFrame } from "@/components/visuals/visual-frame";
import { Figure } from "@/components/figure";
import { MetricRow } from "@/components/metric";
import { PaperLink } from "@/components/paper-link";
import { Reveal } from "@/components/reveal";
import { PipelineWalkthrough } from "@/components/demos/pipeline-walkthrough";
import { LomaVerseLazy, SpecSplitLazy } from "@/components/demos/lazy";

function ArticleSection({
  heading,
  caption,
  children,
  wide,
}: {
  heading?: string;
  caption?: string;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <section
      className={cn("mx-auto w-full", wide ? "max-w-[760px]" : "max-w-[680px]")}
    >
      {heading && (
        <h2 className="type-h3 mb-5 text-ink">
          {heading}
        </h2>
      )}
      {children}
      {caption && (
        <p className="mt-5 max-w-[65ch] text-sm leading-relaxed text-ink-soft">
          {caption}
        </p>
      )}
    </section>
  );
}

function figureStartNumbers(sections: ContentSection[]): number[] {
  const out: number[] = [];
  let n = 0;
  for (const s of sections) {
    out.push(n + 1);
    if (s.type === "figure") n += 1;
    if (s.type === "gallery") n += s.images.length;
  }
  return out;
}

export function VisualStory({
  sections,
  primaryVisualIndex = -1,
}: {
  sections: ContentSection[];
  primaryVisualIndex?: number;
}) {
  const visible = sections
    .map((section, i) => ({ section, i }))
    .filter(({ section, i }) => {
      if (section.type !== "visual" || i !== primaryVisualIndex) return true;
      return (
        section.visual === "ownership-pipeline" ||
        section.visual === "lomaverse-orbit"
      );
    });

  const starts = figureStartNumbers(visible.map((v) => v.section));

  return (
    <div data-testid="visual-story" className="flex flex-col gap-10 md:gap-14">
      {visible.map(({ section, i }, displayIndex) => {
        const first = starts[displayIndex] ?? 1;
        let inner: React.ReactNode;

        switch (section.type) {
          case "prose":
            inner = (
              <div className="flex flex-col gap-4">
                {section.body.map((p, j) => (
                  <p key={j} className="read">
                    {p}
                  </p>
                ))}
              </div>
            );
            break;
          case "metrics":
            inner = <MetricRow metrics={section.metrics} tone="hue" />;
            break;
          case "visual":
            if (section.visual === "ownership-pipeline") {
              inner = <PipelineWalkthrough />;
            } else if (section.visual === "lomaverse-orbit") {
              inner = (
                <>
                  {i !== primaryVisualIndex && (
                    <LomaVerseLazy className="h-full min-h-[420px] w-full" />
                  )}
                  <div className={i !== primaryVisualIndex ? "mt-10" : undefined}>
                    <VisualFrame>
                      <Visual id={section.visual} />
                    </VisualFrame>
                  </div>
                </>
              );
            } else if (section.visual === "specsplit-topology") {
              inner = (
                <div className="grid gap-10 md:grid-cols-2">
                  <div className="md:sticky md:top-24 md:self-start">
                    <VisualFrame>
                      <Visual id={section.visual} />
                    </VisualFrame>
                  </div>
                  <div className="min-w-0">
                    <SpecSplitLazy />
                  </div>
                </div>
              );
            } else {
              inner = (
                <VisualFrame>
                  <Visual id={section.visual} />
                </VisualFrame>
              );
            }
            break;
          case "paper":
            inner = (
              <div className="max-w-sm">
                <PaperLink paper={section.paper} />
              </div>
            );
            break;
          case "figure":
            inner = <Figure figure={section.figure} number={first ?? 1} />;
            break;
          case "gallery":
            inner = (
              <div className="flex flex-col gap-8">
                {section.images.map((figure, j) => (
                  <Figure
                    key={figure.src}
                    figure={figure}
                    number={(first ?? 1) + j}
                  />
                ))}
              </div>
            );
            break;
          case "links":
            inner = (
              <div className="flex flex-wrap gap-3">
                {section.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-1.5 border border-line px-5 py-2.5 text-sm text-ink-soft transition-colors hover:border-accent hover:text-ink"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  </a>
                ))}
              </div>
            );
            break;
          case "system":
            inner = (
              <dl className="flex flex-col divide-y divide-line border-y border-line">
                {section.components.map((c) => (
                  <div
                    key={c.name}
                    className="grid gap-1 py-4 md:grid-cols-[180px_minmax(0,1fr)] md:gap-6"
                  >
                    <dt className="project-accent-text font-mono text-xs uppercase tracking-[0.14em]">
                      {c.name}
                    </dt>
                    <dd className="text-sm leading-relaxed text-ink-soft">
                      <span className="text-ink-faint">In: </span>
                      {c.receives}
                      <span className="text-ink-faint">{" · Out: "}</span>
                      {c.emits}
                    </dd>
                  </div>
                ))}
              </dl>
            );
            break;
          case "implementation":
            inner = (
              <dl className="flex flex-col divide-y divide-line border-y border-line">
                {section.decisions.map((d) => (
                  <div
                    key={d.choice}
                    className="grid gap-1 py-4 md:grid-cols-[180px_minmax(0,1fr)] md:gap-6"
                  >
                    <dt className="project-accent-text font-mono text-xs uppercase tracking-[0.14em]">
                      {d.choice}
                    </dt>
                    <dd className="text-sm leading-relaxed text-ink-soft">
                      {d.why}
                    </dd>
                  </div>
                ))}
              </dl>
            );
            break;
          case "evidence":
            inner = (
              <dl className="flex flex-col divide-y divide-line border-y border-line">
                {section.items.map((item) => (
                  <div
                    key={item.result}
                    className="grid gap-1 py-4 md:grid-cols-[180px_minmax(0,1fr)] md:gap-6"
                  >
                    <dt className="project-accent-text font-mono text-sm font-medium tabular-nums">
                      {item.result}
                    </dt>
                    <dd className="text-sm leading-relaxed text-ink-soft">
                      {item.basis}
                    </dd>
                  </div>
                ))}
              </dl>
            );
            break;
          default:
            inner = null;
        }

        const wide =
          section.type === "visual" ||
          section.type === "figure" ||
          section.type === "gallery";

        return (
          <Reveal key={i} delay={Math.min(displayIndex * 0.04, 0.24)}>
            <ArticleSection
              heading={section.heading}
              caption={
                section.type === "visual" && i !== primaryVisualIndex
                  ? section.caption
                  : undefined
              }
              wide={wide}
            >
              {inner}
            </ArticleSection>
          </Reveal>
        );
      })}
    </div>
  );
}
