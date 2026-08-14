import Image from "next/image";
import type { Figure as FigureType } from "@/lib/types";

export function Figure({ figure, number }: { figure: FigureType; number?: number }) {
  return (
    <figure className="my-10">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-surface">
        <Image
          src={figure.src}
          alt={figure.alt}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-contain p-6"
          priority={number === 1}
        />
      </div>
      <figcaption className="mt-4 flex flex-col gap-1 text-sm text-ink-soft">
        {number && (
          <span className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-indigo">
            Fig. {String(number).padStart(2, "0")}
          </span>
        )}
        <span className="leading-relaxed">{figure.caption}</span>
        {figure.source && (
          <span className="font-mono text-xs text-ink-faint">
            Source: {figure.source}
          </span>
        )}
      </figcaption>
    </figure>
  );
}