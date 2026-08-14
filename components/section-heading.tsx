import { cn } from "@/lib/utils";
import { Reveal } from "@/components/reveal";

type SectionHeadingProps = {
  index?: string;
  kicker: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  index,
  kicker,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "mb-12 max-w-3xl md:mb-16",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <p className="eyebrow mb-4 flex items-center gap-3">
        {index && <span className="text-ink-faint">{index}</span>}
        <span className="h-px w-8 bg-current opacity-40" />
        {kicker}
      </p>
      <h2 className="text-3xl font-semibold tracking-tight text-ink md:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-base leading-relaxed text-ink-soft md:text-lg">
          {description}
        </p>
      )}
    </Reveal>
  );
}