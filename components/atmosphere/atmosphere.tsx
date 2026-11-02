"use client";

import { useEffect, useId, useRef } from "react";
import { CoordinateMarks } from "@/components/atmosphere/coordinate-marks";
import { ContourWaves } from "@/components/atmosphere/contour-waves";
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

  return (
    <div
      ref={ref}
      aria-hidden="true"
      data-testid="atmosphere"
      data-variant={variant}
      data-inview="false"
      className={`ds-atmosphere ds-atmosphere-${variant}`}
    >
      <span className="ds-atmosphere-field" />
      {variant === "ambient" ? (
        <ParticleField />
      ) : (
        (variant === "hero" || variant === "og") && <ContourWaves />
      )}
      {(variant === "article" || variant === "footer") && (
        <span className="ds-atmosphere-halftone" />
      )}
      {variant !== "ambient" && <span className="ds-atmosphere-grid" />}
      <Grain id={grainId} />
      {variant !== "ambient" && (
        <CoordinateMarks className="ds-atmosphere-marks" tone="var(--accent)" />
      )}
    </div>
  );
}
