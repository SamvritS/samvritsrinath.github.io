"use client";

import { useEffect, useState } from "react";

const KEYS = ["utm_source", "utm_medium", "utm_campaign"] as const;

export type Utm = Partial<Record<(typeof KEYS)[number], string>>;

export function readUtm(): Utm {
  if (typeof window === "undefined") return {};
  const out: Utm = {};
  for (const k of KEYS) {
    try {
      const v = sessionStorage.getItem(k);
      if (v) out[k] = v;
    } catch {
      /* storage unavailable */
    }
  }
  return out;
}

export function UtmCapture() {
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      for (const k of KEYS) {
        const v = params.get(k);
        if (v) sessionStorage.setItem(k, v.slice(0, 200));
      }
    } catch {
      /* storage unavailable */
    }
  }, []);
  return null;
}

export function withUtmSubject(href: string): string {
  if (typeof window === "undefined") return href;
  const utm = readUtm();
  const via = [utm.utm_source, utm.utm_medium, utm.utm_campaign]
    .filter(Boolean)
    .join("/");
  if (!via) return href;
  const sep = href.includes("?") ? "&" : "?";
  return `${href}${sep}subject=${encodeURIComponent(`Hello (via ${via})`)}`;
}

export function useMailto(email: string): string {
  const base = `mailto:${email}`;
  const [href, setHref] = useState(base);
  useEffect(() => {
    const id = requestAnimationFrame(() => setHref(withUtmSubject(base)));
    return () => cancelAnimationFrame(id);
  }, [base]);
  return href;
}
