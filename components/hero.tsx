import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { site } from "@/data/site";
import { Portrait } from "@/components/portrait";

export function Hero() {
  return (
    <section className="flex min-h-[92svh] flex-col justify-center px-6 pt-24">
      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 lg:grid-cols-[1fr_auto]">
        <div>
          <p className="eyebrow mb-8 flex items-center gap-3">
            <span className="text-ink-faint">{site.location}</span>
            <span className="h-px w-8 bg-current opacity-40" />
            <span>{site.tagline}</span>
          </p>

          <h1 className="text-[clamp(3rem,9vw,7rem)] font-semibold leading-[0.95] tracking-tight text-ink">
            Samvrit
            <br />
            Srinath
          </h1>

          <div className="mt-10 max-w-xl">
            <p className="text-lg leading-relaxed text-ink-soft md:text-xl">
              {site.bio}
            </p>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-4">
            <Link
              href="/work"
              className="flex items-center gap-2 rounded-full bg-indigo px-7 py-3.5 text-sm font-medium text-white shadow-[0_8px_32px_-12px_var(--glow)] transition-all duration-300 hover:bg-indigo/90 hover:shadow-[0_12px_40px_-12px_var(--glow)]"
            >
              Explore work
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href={site.resume.href}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-float flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium text-ink transition-all duration-300 hover:border-line-strong"
            >
              Résumé
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-14 flex flex-wrap gap-x-10 gap-y-3 font-mono text-xs tracking-widest text-ink-faint">
            <span>B.S./M.S. CS · UCSD</span>
            <span>Regents Scholar</span>
            <span>Software Engineer · Arista</span>
          </div>
        </div>

        <Portrait />
      </div>
    </section>
  );
}
