"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X } from "@/components/ui-icons";
import type { Figure as FigureType } from "@/lib/types";

export function Figure({
  figure,
  number,
}: {
  figure: FigureType;
  number?: number;
}) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const label = number ? `Fig. ${String(number).padStart(2, "0")}` : null;
  const fit = figure.fit ?? "contain";
  const ratio =
    figure.width && figure.height
      ? `${figure.width} / ${figure.height}`
      : "4 / 3";

  const openFrom = useCallback((trigger: HTMLButtonElement | null) => {
    triggerRef.current = trigger;
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;
      const items = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute("disabled"));
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      triggerRef.current?.focus();
    };
  }, [open, close]);

  return (
    <>
      <figure>
        <button
          type="button"
          data-testid="figure-thumb"
          onClick={(e) => openFrom(e.currentTarget)}
          aria-haspopup="dialog"
          aria-label={number ? `Enlarge figure ${number}` : "Enlarge figure"}
          className="block w-full cursor-zoom-in text-left"
        >
          <div
            className="relative overflow-hidden border border-line bg-surface"
            style={{ aspectRatio: ratio }}
          >
            <Image
              src={figure.src}
              alt={figure.alt}
              fill
              sizes="(min-width: 1024px) 760px, 100vw"
              className={fit === "cover" ? "object-cover" : "object-contain"}
              priority={number === 1}
            />
          </div>
        </button>

        <figcaption className="mt-3 flex flex-col gap-1 text-sm leading-relaxed text-ink-soft">
          {label && (
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-ink">
              {label}
            </span>
          )}
          <span>{figure.caption}</span>
          {figure.source && (
            <span className="font-mono text-xs text-ink-faint">
              Source: {figure.source}
            </span>
          )}
        </figcaption>
      </figure>

      {open &&
        createPortal(
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={figure.alt}
            data-testid="figure-lightbox"
            className="fixed inset-0 z-[90] bg-void"
            onClick={close}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Close figure"
              className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center border border-line bg-surface text-ink transition-colors hover:border-wavelength"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="h-full overflow-auto p-6 md:p-10">
              <div
                className="mx-auto w-fit max-w-[94vw]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="border border-line bg-surface">
                  <div
                    className="relative w-[88vw] max-w-[1400px]"
                    style={{ aspectRatio: ratio }}
                  >
                    <Image
                      src={figure.src}
                      alt={figure.alt}
                      fill
                      sizes="94vw"
                      className={fit === "cover" ? "object-cover" : "object-contain"}
                      priority
                    />
                  </div>
                  <div className="flex items-baseline justify-between gap-6 border-t border-line px-4 py-3">
                    {label && (
                      <span className="shrink-0 font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-ink">
                        {label}
                      </span>
                    )}
                    <span className="min-w-0 text-left text-sm leading-relaxed text-ink-soft">
                      {figure.caption}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
