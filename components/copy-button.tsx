"use client";

import { useRef, useState } from "react";
import { Check, Copy } from "@/components/ui-icons";
import { cn } from "@/lib/utils";

export function CopyButton({
  text,
  label = "Copy",
  className,
  testId = "copy-button",
}: {
  text: string;
  label?: string;
  className?: string;
  testId?: string;
}) {
  const [done, setDone] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const onCopy = async () => {
    await navigator.clipboard.writeText(text).catch(() => undefined);
    setDone(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setDone(false), 1500);
  };

  return (
    <button
      type="button"
      data-testid={testId}
      onClick={onCopy}
      aria-live="polite"
      className={cn(
        "inline-flex items-center gap-1.5 border border-line px-3 py-1.5 font-mono text-xs uppercase tracking-[0.18em] text-ink-soft transition-colors hover:border-wavelength hover:text-ink",
        className,
      )}
    >
      {done ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {done ? "COPIED" : label}
    </button>
  );
}
