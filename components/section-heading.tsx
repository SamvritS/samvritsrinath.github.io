import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Atmosphere } from "@/components/atmosphere/atmosphere";
import type { AtmosphereVariant } from "@/components/atmosphere/atmosphere";
import {
  HarmonicRegister,
  type HarmonicVariant,
} from "@/components/atmosphere/harmonic-register";
import { SectionDivider } from "@/components/atmosphere/section-divider";
import { Reveal } from "@/components/reveal";

type SectionHeadingProps = {
  id?: string;
  index?: string;
  kicker: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  rail?: string;
  atmosphere?: AtmosphereVariant;
  register?: HarmonicVariant;
  divider?: boolean;
  children?: ReactNode;
};

export function SectionHeading({
  id,
  index,
  kicker,
  title,
  description,
  align = "left",
  className,
  rail,
  atmosphere,
  register,
  divider = false,
  children,
}: SectionHeadingProps) {
  if (!rail) {
    return (
      <Reveal
        className={cn(
          "mb-12 max-w-3xl md:mb-16",
          align === "center" && "mx-auto text-center",
          className,
        )}
      >
        <p className="eyebrow mb-4 flex items-center gap-3">
          {index && <span className="text-accent">{index}</span>}
          <span className="h-px w-8 bg-accent opacity-50" />
          {kicker}
        </p>
        <Reveal mask>
          <h2 className="type-h2 text-ink">{title}</h2>
        </Reveal>
        {description && (
          <p className="type-dek mt-5 max-w-2xl">{description}</p>
        )}
      </Reveal>
    );
  }

  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden",
        !divider && "border-t border-line",
        className,
      )}
    >
      {atmosphere && <Atmosphere variant={atmosphere} />}
      {divider && <SectionDivider />}
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-20 md:py-28">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="self-start lg:col-span-3">
            <p className="eyebrow flex items-center gap-3 lg:sticky lg:top-24">
              <span className="h-px w-6 bg-accent opacity-60" />
              {rail}
            </p>
            {register && (
              <HarmonicRegister
                variant={register}
                className="mt-8 hidden h-auto w-40 lg:block"
              />
            )}
          </div>
          <div className="lg:col-span-9">
            <Reveal mask>
              <h2 className="type-h2 max-w-3xl text-ink">{title}</h2>
            </Reveal>
            {description && (
              <p className="type-dek mt-5 max-w-2xl">{description}</p>
            )}
            {children && <div className="mt-12 md:mt-16">{children}</div>}
          </div>
        </div>
      </div>
    </section>
  );
}
