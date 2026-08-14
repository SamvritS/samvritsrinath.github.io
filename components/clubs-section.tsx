import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { clubs } from "@/data/education";
import { SectionHeading } from "@/components/section-heading";

export function ClubsSection() {
  return (
    <section id="clubs" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-36">
        <SectionHeading
          index="07"
          kicker="Community"
          title="Clubs and leadership."
          description="President, product manager, and technical leads — building software and communities at UCSD."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {clubs.map((club) => (
            <a
              key={club.name}
              href={club.website}
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card group flex flex-col justify-between rounded-2xl p-6 transition-all duration-300 hover:border-line-strong"
            >
              <div>
                <div className="flex items-center gap-3">
                  {club.logo && (
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-surface p-1.5">
                      <Image
                        src={club.logo}
                        alt=""
                        width={72}
                        height={72}
                        className="h-full w-full object-contain"
                      />
                    </span>
                  )}
                  <h3 className="text-base font-semibold tracking-tight text-ink group-hover:text-indigo">
                    {club.name}
                  </h3>
                </div>
                <p className="mt-3 text-sm text-ink-soft">{club.role}</p>
              </div>
              <ArrowUpRight className="mt-6 h-4 w-4 text-ink-faint transition-colors group-hover:text-indigo" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}