"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X } from "@/components/ui-icons";
import { cn } from "@/lib/utils";
import type { Figure as FigureType } from "@/lib/types";

function frameRatio(figure: FigureType) {
  if (figure.aspect === "16:10") return "16 / 10";
  if (figure.aspect === "4:3") return "4 / 3";
  return figure.width && figure.height
    ? `${figure.width} / ${figure.height}`
    : "4 / 3";
}

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
  const ratio = frameRatio(figure);
  const imageClass = cn(
    "figure-frame__image",
    fit === "cover" ? "object-cover" : "object-contain",
    figure.blend === "multiply" && "figure-image--multiply",
  );

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
            className={cn(
              "figure-frame",
              figure.cropMarks && "figure-frame--crop",
            )}
          >
            <div
              className="figure-frame__plate"
              style={{ aspectRatio: ratio }}
              data-testid="figure-plate"
            >
              <Image
                src={figure.src}
                alt={figure.alt}
                fill
                sizes="(min-width: 1024px) 760px, 100vw"
                className={imageClass}
                priority={number === 1}
              />
            </div>
          </div>
        </button>

        <figcaption className="figure-caption">
          {label && <span className="figure-caption__label">{label}</span>}
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
              className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center border border-line bg-surface text-ink transition-colors hover:border-accent"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="h-full overflow-auto p-6 md:p-10">
              <div
                className="mx-auto w-fit max-w-[94vw]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="figure-frame">
                  <div
                    className="figure-frame__plate w-[88vw] max-w-[1400px]"
                    style={{ aspectRatio: ratio }}
                    data-testid="figure-lightbox-plate"
                  >
                    <Image
                      src={figure.src}
                      alt={figure.alt}
                      fill
                      sizes="94vw"
                      className={imageClass}
                      priority
                    />
                  </div>
                  <div className="flex items-baseline justify-between gap-6 border-t border-line px-4 py-3">
                    {label && (
                      <span className="figure-caption__label shrink-0">
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
