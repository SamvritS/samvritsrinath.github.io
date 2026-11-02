"use client";

import { useEffect, useId, useRef } from "react";
import { CoordinateMarks } from "@/components/atmosphere/coordinate-marks";
import { Grain } from "@/components/atmosphere/grain";
import { ParticleField } from "@/components/atmosphere/particle-field";

export type AtmosphereVariant =
  | "ambient"
  | "hero"
  | "article"
  | "footer"
  | "og";

export function Atmosphere({ variant }: { variant: AtmosphereVariant }) {
  const ref = useRef<HTMLDivElement>(null);
  const grainId = useId().replace(/:/g, "");

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      node.dataset.inview = "true";
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        node.dataset.inview = entry.isIntersecting ? "true" : "false";
      },
      { rootMargin: "120px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const sync = () => {
      node.dataset.hidden = document.hidden ? "true" : "false";
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-testid="atmosphere"
      data-variant={variant}
      data-inview="false"
      className={`ds-atmosphere ds-atmosphere-${variant}`}
    >
      {variant === "ambient" ? (
        <span className="ds-atmosphere-mesh" />
      ) : (
        <span className="ds-atmosphere-field" />
      )}
      {(variant === "article" || variant === "footer") && (
        <span className="ds-atmosphere-halftone" />
      )}
      <Grain id={grainId} />
      {variant === "ambient" && (
        <span className="ds-atmosphere-dots" data-testid="atmosphere-dots" />
      )}
      {variant === "ambient" && <ParticleField />}
      {variant !== "ambient" && (
        <CoordinateMarks className="ds-atmosphere-marks" tone="var(--accent)" />
      )}
    </div>
  );
}
