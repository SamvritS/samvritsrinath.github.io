export type HarmonicVariant = "hero" | "seam" | "spectral" | "converge";

function Lines({
  paths,
  tone,
}: {
  paths: string[];
  tone: string;
}) {
  return (
    <>
      {paths.map((d, index) => (
        <path
          key={d}
          d={d}
          pathLength={1}
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          opacity={index === 2 ? 0.85 : 0.55}
          className="harmonic-line"
          style={{
            animationDelay: `${index * 90}ms`,
            color: tone,
          }}
        />
      ))}
    </>
  );
}

export function HarmonicRegister({
  variant,
  className,
}: {
  variant: HarmonicVariant;
  className?: string;
}) {
  const classes = ["harmonic-register", className].filter(Boolean).join(" ");

  if (variant === "hero") {
    return (
      <svg
        aria-hidden="true"
        data-testid="harmonic-register"
        data-variant={variant}
        viewBox="0 0 640 560"
        fill="none"
        className={classes}
      >
        <Lines
          tone="var(--line-strong)"
          paths={[
            "M0 132C150 132 232 82 356 82S556 142 640 112",
            "M0 212C170 212 250 162 378 162S572 222 640 192",
            "M0 292C190 292 268 242 398 242S586 302 640 272",
            "M0 372C210 372 288 322 418 322S600 382 640 352",
            "M0 452C230 452 306 402 438 402S614 462 640 432",
          ]}
        />
      </svg>
    );
  }

  if (variant === "seam") {
    return (
      <svg
        aria-hidden="true"
        data-testid="harmonic-register"
        data-variant={variant}
        viewBox="0 0 160 56"
        fill="none"
        className={classes}
      >
        <Lines
          tone="var(--line-strong)"
          paths={[
            "M0 8C40 8 62 4 96 4S140 10 160 7",
            "M0 18C42 18 64 14 98 14S142 20 160 17",
            "M0 28C44 28 66 24 100 24S144 30 160 27",
            "M0 38C46 38 68 34 102 34S146 40 160 37",
            "M0 48C48 48 70 44 104 44S148 50 160 47",
          ]}
        />
        <circle cx="100" cy="24" r="2" fill="var(--wavelength)" />
      </svg>
    );
  }

  if (variant === "spectral") {
    return (
      <svg
        aria-hidden="true"
        data-testid="harmonic-register"
        data-variant={variant}
        viewBox="0 0 480 64"
        fill="none"
        className={classes}
      >
        <Lines
          tone="var(--hue, var(--field-teal))"
          paths={[
            "M0 12C60 12 84 6 140 6S232 16 292 16S394 8 480 12",
            "M0 22C58 22 88 14 146 14S238 26 298 26S398 18 480 22",
            "M0 32C62 32 90 22 152 22S244 38 304 38S402 28 480 32",
            "M0 42C66 42 94 34 158 34S250 48 310 48S406 38 480 42",
            "M0 52C70 52 98 44 164 44S256 56 316 56S410 48 480 52",
          ]}
        />
        <circle cx="146" cy="14" r="2.5" fill="var(--wavelength)" />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden="true"
      data-testid="harmonic-register"
      data-variant={variant}
      viewBox="0 0 520 140"
      fill="none"
      className={classes}
    >
      <Lines
        tone="var(--line-strong)"
        paths={[
          "M0 30C170 30 300 42 512 84",
          "M0 56C180 56 320 60 512 84",
          "M0 82C190 82 340 80 512 84",
          "M0 108C200 108 350 100 512 84",
          "M0 134C210 134 360 118 512 84",
        ]}
      />
    </svg>
  );
}
