"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const TITLES = ["Arista Networks", "UC San Diego", "Internet Measurement"];

export function HeroTitles() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [chars, setChars] = useState(TITLES[0].length);
  const [visible, setVisible] = useState(true);
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (reduced || !visible) return;
    if (chars < TITLES[index].length) {
      const tick = window.setTimeout(() => setChars((c) => c + 1), 45);
      return () => window.clearTimeout(tick);
    }
    const hold = window.setTimeout(() => {
      const next = (index + 1) % TITLES.length;
      setIndex(next);
      setChars(1);
    }, 1800);
    return () => window.clearTimeout(hold);
  }, [chars, index, reduced, visible]);

  const text = reduced ? TITLES[0] : TITLES[index].slice(0, chars);

  return (
    <p
      ref={ref}
      data-testid="hero-titles"
      className="mt-5 font-mono text-xs uppercase tracking-[0.16em] text-ink-faint"
    >
      <span className="sr-only">Currently: {TITLES.join(", ")}</span>
      <span aria-hidden>
        Currently:&nbsp;
        <span className="text-ink">{text}</span>
        <span className="text-wavelength">▍</span>
      </span>
    </p>
  );
}
