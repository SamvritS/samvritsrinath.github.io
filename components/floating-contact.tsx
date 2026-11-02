"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Envelope } from "@/components/ui-icons";
import { site } from "@/data/site";
import { CopyButton } from "@/components/copy-button";
import { useMailto } from "@/components/utm-capture";
import { cn } from "@/lib/utils";

export function FloatingContact() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const mailto = useMailto(site.contact.email);
  if (pathname === "/contact") return null;

  return (
    <div
      data-testid="floating-contact"
      className={cn(
        "fixed bottom-24 left-6 z-[65] print:hidden",
        pathname.startsWith("/work") && "hidden lg:block",
      )}
    >
      {open && (
        <div className="mb-2 border border-line-strong bg-surface p-4">
          <p className="font-mono text-xs text-ink">{site.contact.email}</p>
          <div className="mt-3 flex gap-2">
            <a
              href={mailto}
              className="border border-ink bg-ink px-3 py-1.5 font-mono text-xs uppercase tracking-[0.18em] text-void transition-colors hover:border-wavelength hover:bg-wavelength"
            >
              Write
            </a>
            <CopyButton text={site.contact.email} />
          </div>
        </div>
      )}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Contact options"
        className="flex items-center gap-2 border border-line-strong bg-surface px-4 py-2.5 font-mono text-xs uppercase tracking-[0.18em] text-ink transition-colors hover:border-wavelength"
      >
        <Envelope className="h-4 w-4" />
        Mail
      </button>
    </div>
  );
}
