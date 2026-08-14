"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import type { Project } from "@/lib/types";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { cn } from "@/lib/utils";

export function WorkArchive({ projects }: { projects: Project[] }) {
  const categories = useMemo(
    () => ["All", ...new Set(projects.map((p) => p.category))],
    [projects],
  );
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      const matchCat = active === "All" || p.category === active;
      const matchQ =
        !q ||
        [p.title, p.tagline, p.category, p.technologies.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(q);
      return matchCat && matchQ;
    });
  }, [projects, active, query]);

  return (
    <>
      <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setActive(c)}
              aria-pressed={active === c}
              className={cn(
                "rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-wider transition-colors",
                active === c
                  ? "border-indigo bg-indigo text-white"
                  : "border-line text-ink-soft hover:border-line-strong hover:text-ink",
              )}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="relative md:w-72">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects…"
            aria-label="Search projects"
            className="w-full rounded-full border border-line bg-surface/60 py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-ink-faint focus:border-line-strong focus:outline-none"
          />
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <Reveal key={p.slug} delay={Math.min(i * 0.04, 0.32)} className="h-full">
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      ) : (
        <p className="py-24 text-center font-mono text-sm text-ink-faint">
          No projects match “{query}”.
        </p>
      )}
    </>
  );
}