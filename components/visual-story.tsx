import { ArrowUpRight } from "lucide-react";
import type { ContentSection } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Diagram } from "@/components/diagram";
import { Figure } from "@/components/figure";
import { MetricRow } from "@/components/metric";
import { Reveal } from "@/components/reveal";

function SectionShell({
  index,
  children,
  wide,
}: {
  index: number;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="grid gap-5 md:grid-cols-[56px_1fr] md:gap-8">
      <span className="pt-1 font-mono text-xs text-ink-faint md:pt-1.5">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className={cn("min-w-0", wide ? "md:max-w-4xl" : "md:max-w-2xl")}>
        {children}
      </div>
    </div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-5 text-xl font-semibold tracking-tight text-ink md:text-2xl">
      {children}
    </h3>
  );
}

export function VisualStory({ sections }: { sections: ContentSection[] }) {
  const figureIndexes = sections
    .map((s, i) => (s.type === "figure" || s.type === "gallery" ? i : -1))
    .filter((i) => i >= 0);

  return (
    <div className="flex flex-col gap-14 md:gap-20">
      {sections.map((section, i) => {
        let inner: React.ReactNode;

        switch (section.type) {
          case "prose":
            inner = (
              <SectionShell index={i}>
                <SectionHeading>{section.heading}</SectionHeading>
                <div className="flex flex-col gap-4">
                  {section.body.map((p, j) => (
                    <p
                      key={j}
                      className="text-base leading-relaxed text-ink-soft md:text-[17px]"
                    >
                      {p}
                    </p>
                  ))}
                </div>
              </SectionShell>
            );
            break;
          case "metrics":
            inner = (
              <SectionShell index={i}>
                {section.heading && (
                  <SectionHeading>{section.heading}</SectionHeading>
                )}
                <MetricRow metrics={section.metrics} />
              </SectionShell>
            );
            break;
          case "diagram":
            inner = (
              <SectionShell index={i} wide>
                {section.heading && (
                  <SectionHeading>{section.heading}</SectionHeading>
                )}
                <div className="glass-card rounded-2xl p-6 md:p-10">
                  <Diagram data={section.diagram} />
                </div>
              </SectionShell>
            );
            break;
          case "figure":
            inner = (
              <SectionShell index={i} wide>
                {section.heading && (
                  <SectionHeading>{section.heading}</SectionHeading>
                )}
                <Figure
                  figure={section.figure}
                  number={figureIndexes.indexOf(i) + 1}
                />
              </SectionShell>
            );
            break;
          case "gallery":
            inner = (
              <SectionShell index={i} wide>
                {section.heading && (
                  <SectionHeading>{section.heading}</SectionHeading>
                )}
                <div className="flex flex-col gap-6">
                  {section.images.map((figure, j) => (
                    <Figure
                      key={figure.src}
                      figure={figure}
                      number={figureIndexes.indexOf(i) + j + 1}
                    />
                  ))}
                </div>
              </SectionShell>
            );
            break;
          case "links":
            inner = (
              <SectionShell index={i}>
                {section.heading && (
                  <SectionHeading>{section.heading}</SectionHeading>
                )}
                <div className="flex flex-wrap gap-3">
                  {section.links.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="flex items-center gap-1.5 rounded-full border border-line px-5 py-2.5 text-sm text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  ))}
                </div>
              </SectionShell>
            );
            break;
          default:
            inner = null;
        }

        return (
          <Reveal key={i} delay={Math.min(i * 0.04, 0.24)}>
            {inner}
          </Reveal>
        );
      })}
    </div>
  );
}