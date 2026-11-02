"use client";

import { useEffect, useState } from "react";

const KEY = "cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      try {
        if (localStorage.getItem(KEY) === "accepted") setVisible(false);
      } catch {
        /* storage unavailable */
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  if (!visible) return null;

  const accept = () => {
    try {
      localStorage.setItem(KEY, "accepted");
    } catch {
      /* storage unavailable */
    }
    setVisible(false);
  };

  return (
    <div
      data-testid="cookie-banner"
      role="region"
      aria-label="Cookie notice"
      className="fixed inset-x-0 bottom-0 z-[65] border-t border-line bg-surface"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink-soft">
          This site stores a theme choice and a cookie notice flag in your
          browser.
        </p>
        <button
          type="button"
          data-testid="cookie-accept"
          onClick={accept}
          className="border border-line-strong px-5 py-2 font-mono text-xs uppercase tracking-[0.18em] text-ink transition-colors hover:border-wavelength"
        >
          Accept
        </button>
      </div>
    </div>
  );
}
