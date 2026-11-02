"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Download,
  Envelope,
  FileText,
} from "@/components/ui-icons";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { AmbientField } from "@/components/atmosphere/ambient-field";
import { CoordinateMarks } from "@/components/atmosphere/coordinate-marks";
import { HarmonicRegister } from "@/components/atmosphere/harmonic-register";
import { SectionDivider } from "@/components/atmosphere/section-divider";
import { SignalTrace } from "@/components/atmosphere/signal-trace";
import { Reveal } from "@/components/reveal";
import { useMailto } from "@/components/utm-capture";
import { site } from "@/data/site";

const channels = [
  {
    label: "GitHub",
    href: site.contact.github,
    icon: GithubIcon,
    external: true,
  },
  {
    label: "LinkedIn",
    href: site.contact.linkedin,
    icon: LinkedinIcon,
    external: true,
  },
  {
    label: "Resume",
    href: site.resume.href,
    icon: FileText,
    external: false,
  },
] as const;

export function ContactSection() {
  const mailto = useMailto(site.contact.email);

  return (
    <section
      id="contact"
      className="relative overflow-hidden"
    >
      <AmbientField variant="contact" />
      <SectionDivider />
      <HarmonicRegister
        variant="converge"
        className="pointer-events-none absolute -bottom-6 right-0 hidden h-auto w-[520px] max-w-[70%] opacity-60 md:block"
      />
      <SignalTrace className="pointer-events-none absolute -bottom-6 right-0 hidden w-[520px] max-w-[70%] opacity-60 md:block" />
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="self-start lg:col-span-3">
            <p className="eyebrow lg:sticky lg:top-24">08 / CONTACT</p>
            <CoordinateMarks className="mt-10 hidden h-16 w-16 md:block" />
          </div>

          <div className="lg:col-span-9">
            <Reveal mask>
              <h2 className="max-w-3xl text-4xl font-semibold tracking-tight text-ink md:text-6xl">
                Open to industry work.
              </h2>
            </Reveal>
            <div className="mt-10">
              <Link
                href={mailto}
                className="inline-flex max-w-full flex-wrap items-center gap-x-4 gap-y-2 border border-ink bg-ink px-6 py-4 font-mono text-sm text-void transition-colors hover:border-wavelength hover:bg-wavelength"
              >
                <span className="inline-flex items-center gap-2">
                  <Envelope className="h-4 w-4" aria-hidden />
                  Say hello
                </span>
                <span className="break-all">{site.contact.email}</span>
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>

            <ul className="mt-12 grid border-t border-line sm:grid-cols-3">
              {channels.map((channel) => {
                const Icon = channel.icon;
                return (
                  <li key={channel.label} className="border-b border-line sm:border-b-0">
                    <a
                      href={channel.href}
                      target={channel.external ? "_blank" : undefined}
                      rel={channel.external ? "noopener noreferrer" : undefined}
                      className="group flex h-full items-center justify-between gap-4 py-5 sm:pr-6"
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-ink-faint" aria-hidden />
                        <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-soft transition-colors group-hover:text-ink">
                          {channel.label}
                        </span>
                      </span>
                      {channel.external ? (
                        <ArrowUpRight className="h-4 w-4 text-ink-faint transition-colors group-hover:text-wavelength" />
                      ) : (
                        <Download className="h-4 w-4 text-ink-faint transition-colors group-hover:text-wavelength" />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
