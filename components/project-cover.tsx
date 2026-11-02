"use client";

import { useState } from "react";
import Image from "next/image";
import type { Project } from "@/lib/types";
import { cn } from "@/lib/utils";

function initials(title: string) {
  const words = title.replace(/[^A-Za-z0-9 ]/g, " ").split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function MetricPlate({ project }: { project: Project }) {
  const first = project.metrics.slice(0, 2);
  return (
    <div className="absolute inset-0 flex flex-col justify-between bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-ink-faint">
          {project.category}
        </span>
        <span className="font-mono text-xs text-ink-faint tabular-nums">
          {project.year}
        </span>
      </div>
      <svg
        viewBox="0 0 200 44"
        role="img"
        aria-label={`${project.title} metrics plate`}
        className="mt-4 h-11 w-full"
      >
        <line x1="0" y1="1" x2="200" y2="1" stroke="var(--line)" strokeWidth="1" />
        <rect x="0" y="10" width="128" height="7" fill="var(--hue)" />
        <rect x="0" y="21" width="76" height="7" fill="var(--hue)" opacity="0.45" />
        <line x1="0" y1="36" x2="200" y2="36" stroke="var(--line)" strokeWidth="1" />
      </svg>
      <div className="mt-3 flex items-end justify-between gap-4">
        <div className="flex min-w-0 gap-6">
          {first.map((m) => (
            <div key={m.label} className="min-w-0">
              <p className="font-mono text-sm font-medium tabular-nums text-ink">
                {m.value}
              </p>
              <p className="mt-0.5 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ink-faint">
                {m.label}
              </p>
            </div>
          ))}
        </div>
        <span className="shrink-0 font-mono text-[12px] tracking-[0.1em] text-ink-faint">
          {initials(project.title)}
        </span>
      </div>
    </div>
  );
}

export function ProjectCover({
  project,
  sizes,
  featured = false,
}: {
  project: Project;
  sizes: string;
  featured?: boolean;
}) {
  const [loaded, setLoaded] = useState(false);
  const fit = project.coverFit ?? "cover";

  return (
    <div
      className={cn(
        "hue-line relative overflow-hidden border-b bg-surface",
        featured ? "aspect-[21/9]" : "aspect-[16/9]",
      )}
    >
      {project.cover ? (
        <>
          {!loaded && (
            <div
              data-testid="cover-skeleton"
              aria-hidden
              className="absolute inset-0 bg-line/50"
            />
          )}
          {fit === "contain" ? (
            <div className="absolute inset-0 bg-surface p-5">
              <Image
                src={project.cover}
                alt={project.coverAlt ?? project.title}
                fill
                sizes={sizes}
                onLoad={() => setLoaded(true)}
                data-testid={loaded ? "cover-loaded" : undefined}
                className={cn(
                  "object-contain transition-opacity duration-300",
                  loaded ? "opacity-100" : "opacity-0",
                )}
              />
            </div>
          ) : (
            <Image
              src={project.cover}
              alt={project.coverAlt ?? project.title}
              fill
              sizes={sizes}
              onLoad={() => setLoaded(true)}
              data-testid={loaded ? "cover-loaded" : undefined}
              className={cn(
                "object-cover transition-opacity duration-300",
                loaded ? "opacity-100" : "opacity-0",
              )}
            />
          )}
        </>
      ) : (
        <MetricPlate project={project} />
      )}
    </div>
  );
}
