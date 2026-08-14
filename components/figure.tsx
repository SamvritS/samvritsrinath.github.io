"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import type { Figure as FigureType } from "@/lib/types";

export function Figure({
  figure,
  number,
}: {
  figure: FigureType;
  number?: number;
}) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, close]);

  return (
    <>
      <figure className="my-10">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-label={number ? `Enlarge figure ${number}` : "Enlarge figure"}
          className="group block w-full cursor-zoom-in text-left"
        >
          <div className="glass-card relative aspect-[4/3] overflow-hidden rounded-2xl">
            <Image
              src={figure.src}
              alt={figure.alt}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-contain p-6 transition-transform duration-500 group-hover:scale-[1.02]"
              priority={number === 1}
            />
            <span className="absolute bottom-3 right-3 rounded-full bg-ink/80 px-3 py-1.5 font-mono text-[0.65rem] uppercase tracking-wider text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              Enlarge
            </span>
          </div>
        </button>

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

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={figure.alt}
          className="fixed inset-0 z-[70] flex flex-col bg-void/95 backdrop-blur-xl"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            autoFocus
            aria-label="Close figure"
            className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface/60 text-ink transition-colors hover:text-indigo"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex flex-1 items-center justify-center p-6 md:p-14">
            <Image
              src={figure.src}
              alt={figure.alt}
              width={1600}
              height={1200}
              sizes="90vw"
              className="max-h-[85vh] w-auto max-w-full rounded-lg object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
}