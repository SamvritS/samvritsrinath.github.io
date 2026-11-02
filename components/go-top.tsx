"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "@/components/ui-icons";

export function GoTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  const toTop = () => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      data-testid="go-to-top"
      aria-label="Go to top"
      onClick={toTop}
      className="fixed bottom-6 right-6 z-[65] flex h-10 w-10 items-center justify-center border border-line-strong bg-surface text-ink transition-colors hover:border-wavelength"
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}
