import { cn } from "@/lib/utils";

export function VisualFrame({
  caption,
  children,
  className,
}: {
  caption?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <figure
      className={cn(
        "glass-card overflow-hidden rounded-2xl p-6 md:p-10",
        className,
      )}
    >
      <div className="overflow-x-auto pb-1">
        <div className="mx-auto">{children}</div>
      </div>
      {caption && (
        <figcaption className="mx-auto mt-5 max-w-xl text-center text-sm leading-relaxed text-ink-soft">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}