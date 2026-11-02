import Link from "next/link";
import { ArrowUpRight } from "@/components/ui-icons";
import { Atmosphere } from "@/components/atmosphere/atmosphere";
import { HeroPortrait } from "@/components/hero-portrait";
import { HeroTitles } from "@/components/hero-titles";
import { Reveal } from "@/components/reveal";

export function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden pb-20 pt-32 md:pb-28 md:pt-40"
    >
      <Atmosphere variant="hero" />
      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        <div className="grid items-center gap-x-12 gap-y-16 lg:grid-cols-2">
          <div>
            <p data-testid="hero-eyebrow" className="eyebrow">
              SOFTWARE ENGINEER · SYSTEMS · RESEARCH
            </p>

            <Reveal mask className="block">
              <h1
                data-testid="hero-headline"
                className="type-display mt-8 text-ink"
              >
                Samvrit Srinath
              </h1>
            </Reveal>

            <HeroTitles />

            <p
              data-testid="hero-support"
              className="mt-6 max-w-xl text-left text-lg leading-relaxed text-ink md:text-xl"
            >
              I build software for networks, large-scale data, and machine
              learning systems.
            </p>

            <p
              data-testid="hero-proof"
              className="mt-4 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-ink-faint"
            >
              Arista Networks · UC San Diego · Internet Measurement
            </p>

            <div className="mt-9 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6 sm:gap-y-4">
              <Link
                data-testid="hero-view-work"
                href="/work"
                className="border border-ink bg-ink px-7 py-3.5 text-center text-sm font-medium text-void transition-colors hover:border-accent hover:bg-accent"
              >
                View work
              </Link>
              <Link
                data-testid="hero-contact"
                href="/contact"
                className="border border-line-strong px-7 py-3.5 text-center text-sm font-medium text-ink transition-colors hover:border-accent"
              >
                Get in touch
              </Link>
              <Link
                href="/resume"
                className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.18em] text-ink-soft transition-colors hover:text-accent"
              >
                Résumé
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>

          <div className="w-full max-w-[17.5rem] justify-self-start md:max-w-[21rem] lg:max-w-[26.25rem] lg:justify-self-center">
            <HeroPortrait />
          </div>
        </div>
      </div>
    </section>
  );
}
