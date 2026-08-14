"use client";

import Image from "next/image";
import { useRef } from "react";
import { useReducedMotion } from "@/lib/use-reduced-motion";

export function Portrait() {
  const reduced = useReducedMotion();
  const frameRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (reduced) return;
    const el = frameRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -8;
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 10;
    el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
  };

  const onLeave = () => {
    if (reduced || !frameRef.current) return;
    frameRef.current.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
  };

  return (
    <div
      className="relative mx-auto w-full max-w-[19rem] md:max-w-[21rem]"
      style={{ perspective: "900px" }}
    >
      <div
        aria-hidden
        className="absolute -inset-6 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent-indigo)_30%,transparent)_0%,transparent_70%)] blur-2xl"
      />
      <div
        ref={frameRef}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        className="relative rounded-[1.6rem] bg-gradient-to-br from-indigo via-violet to-blue p-[1.5px] shadow-[0_24px_80px_-24px_var(--glow)] transition-transform duration-300 ease-out"
        style={{ transform: "perspective(900px) rotateX(0deg) rotateY(0deg)" }}
      >
        <Image
          src="/assets/profile/profile.webp"
          alt="Portrait of Samvrit Srinath"
          width={1200}
          height={1600}
          priority
          className="block aspect-[3/4] w-full rounded-[calc(1.6rem-1.5px)] object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-x-4 bottom-4 h-1/3 rounded-b-[calc(1.6rem-1.5px)] bg-gradient-to-t from-[rgba(5,6,8,0.55)] to-transparent"
        />
        <span
          aria-hidden
          className="absolute -right-2 -top-2 h-5 w-5 rounded-md border border-ink/20 bg-surface shadow-sm"
          style={{ transform: "rotate(12deg)" }}
        />
        <span
          aria-hidden
          className="absolute -bottom-2 -left-2 h-5 w-5 rounded-md bg-indigo shadow-[0_8px_24px_-8px_var(--glow)]"
          style={{ transform: "rotate(-12deg)" }}
        />
      </div>
    </div>
  );
}