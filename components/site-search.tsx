"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { MagnifyingGlass, X } from "@/components/ui-icons";
import { projects } from "@/data/projects";
import { researchAreas } from "@/data/research";

type Entry = {
  title: string;
  detail: string;
  href: string;
  text: string;
};

const index: Entry[] = [
  ...projects.map((p) => ({
    title: p.title,
    detail: p.tagline,
    href: `/work/${p.slug}`,
    text: `${p.title} ${p.tagline} ${p.description} ${p.category} ${p.technologies.join(" ")}`,
  })),
  ...researchAreas.map((a) => ({
    title: a.title,
    detail: a.description,
    href: "/research",
    text: `${a.title} ${a.description} ${a.projects.join(" ")} ${a.papers.map((paper) => `${paper.title} ${paper.venue} ${paper.tags.join(" ")}`).join(" ")}`,
  })),
  {
    title: "About",
    detail: "Ethernet switch software at Arista, research at UCSD",
    href: "/about",
    text: "about ethernet switch software arista research ucsd bio",
  },
  {
    title: "Home",
    detail: "Software engineer, Ethernet switch software at Arista",
    href: "/",
    text: "home software engineer ethernet switch software arista",
  },
];

export function SiteSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return index.filter((e) => e.text.toLowerCase().includes(q)).slice(0, 8);
  }, [query]);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const onTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = [
        ...dialog.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ].filter(
        (el) =>
          el.getClientRects().length > 0 &&
          getComputedStyle(el).visibility !== "hidden",
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onEscape);
    dialog.addEventListener("keydown", onTab);
    return () => {
      window.removeEventListener("keydown", onEscape);
      dialog.removeEventListener("keydown", onTab);
    };
  }, [open]);

  return (
    <div className="relative">
      <button
        type="button"
        data-testid="site-search-trigger"
        ref={triggerRef}
        aria-label={open ? "Close site search" : "Open site search"}
        aria-expanded={open}
        aria-controls={open ? "site-search-dialog" : undefined}
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center text-ink-soft transition-colors hover:text-ink"
      >
        {open ? (
          <X className="h-[18px] w-[18px]" />
        ) : (
          <MagnifyingGlass className="h-[18px] w-[18px]" />
        )}
      </button>
      {open && (
        <div
          ref={dialogRef}
          id="site-search-dialog"
          data-testid="site-search"
          role="dialog"
          aria-label="Site search"
          className="fixed left-1/2 top-20 z-[70] w-[min(24rem,calc(100vw-2rem))] -translate-x-1/2 border border-line-strong bg-surface"
        >
          <div className="flex items-center gap-2 border-b border-line px-4">
            <MagnifyingGlass className="h-4 w-4 shrink-0 text-ink-faint" />
            <input
              data-testid="site-search-input"
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects and research"
              aria-label="Search projects and research"
              className="h-12 w-full bg-transparent text-sm text-ink placeholder:text-ink-faint"
            />
          </div>
          <div data-testid="site-search-results" className="max-h-80 overflow-y-auto">
            {results.map((r) => (
              <Link
                key={`${r.href}-${r.title}`}
                href={r.href}
                onClick={() => setOpen(false)}
                className="flex flex-col gap-1 border-b border-line px-4 py-3 transition-colors last:border-b-0 hover:bg-void"
              >
                <span className="text-sm text-ink">{r.title}</span>
                <span className="font-mono text-xs text-ink-faint">
                  {r.detail}
                </span>
              </Link>
            ))}
            {query.trim() !== "" && results.length === 0 && (
              <p className="px-4 py-6 text-sm text-ink-faint">No matches found</p>
            )}
            {query.trim() === "" && (
              <p className="px-4 py-6 font-mono text-xs tracking-widest text-ink-faint">
                TYPE TO SEARCH PROJECTS AND RESEARCH
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
