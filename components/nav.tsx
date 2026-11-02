"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, List, X } from "@/components/ui-icons";
import { nav, site } from "@/data/site";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { SiteSearch } from "@/components/site-search";

export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 pt-4">
      <nav
        className={cn(
          "site-nav relative z-50 mx-auto grid h-14 w-full max-w-[720px] grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center border border-line px-6",
          scrolled && "border-line-strong",
        )}
        aria-label="Primary"
      >
        <div className="col-start-1 flex items-center gap-4 justify-self-start">
          <Link
            href="/"
            className="font-mono text-sm font-semibold tracking-[0.18em] text-ink transition-opacity hover:opacity-70"
          >
            {site.shortName}
          </Link>
          <SiteSearch />
        </div>

        <div className="col-start-2 hidden items-center gap-1 justify-self-center md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-11 items-center justify-center px-2.5 py-2 text-sm text-ink-soft transition-colors hover:text-accent",
                (pathname === item.href ||
                  pathname.startsWith(`${item.href}/`)) &&
                  "text-accent",
              )}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="col-start-3 hidden items-center gap-2 justify-self-end md:flex">
          <ThemeToggle />
          <Link
            href="/resume"
            className="flex min-h-11 items-center gap-1 border border-line px-4 py-2 font-mono text-xs uppercase tracking-[0.18em] text-ink transition-colors hover:border-accent"
          >
            Résumé
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="col-start-3 flex items-center gap-1 justify-self-end md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="flex h-9 w-9 items-center justify-center text-ink transition-colors hover:bg-transparent"
          >
            {open ? <X className="h-5 w-5" /> : <List className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <div
        className={cn(
          "fixed inset-0 z-40 flex flex-col justify-end bg-void transition-colors md:hidden",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <div className="flex flex-col gap-2 p-8 pb-14">
          {nav.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "px-4 py-4 text-2xl font-medium text-ink transition-colors",
                (pathname === item.href ||
                  pathname.startsWith(`${item.href}/`)) &&
                  "bg-transparent text-accent",
              )}
              style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
            >
              <span className="mr-3 font-mono text-xs text-accent">
                0{i + 1}
              </span>
              {item.label}
            </Link>
          ))}
          <div className="mt-2 px-4 font-mono text-xs tracking-widest text-ink-faint">
            {site.tagline}
          </div>
        </div>
      </div>
    </header>
  );
}
