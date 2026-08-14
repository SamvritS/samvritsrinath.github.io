import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";

export function ContactSection() {
  return (
    <section id="contact" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-28 md:py-40">
        <p className="eyebrow mb-6 flex items-center gap-3">
          <span className="text-ink-faint">08</span>
          <span className="h-px w-8 bg-current opacity-40" />
          Contact
        </p>
        <h2 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight text-ink md:text-6xl">
          Open to industry work.
        </h2>

        <div className="mt-12 flex flex-wrap items-center gap-4">
          <Link
            href={`mailto:${site.contact.email}`}
            className="flex items-center gap-2 rounded-full bg-indigo px-7 py-3.5 text-sm font-medium text-white shadow-[0_8px_32px_-12px_var(--glow)] transition-all duration-300 hover:bg-indigo/90"
          >
            {site.contact.email}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            href="/contact"
            className="glass-float flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium text-ink transition-all duration-300 hover:border-line-strong"
          >
            Send a message
          </Link>
        </div>
      </div>
    </section>
  );
}