import Image from "next/image";

export function Portrait() {
  return (
    <div className="relative mx-auto w-full max-w-[19rem] md:max-w-[21rem]">
      <div
        aria-hidden
        className="absolute -inset-6 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--accent-indigo)_30%,transparent)_0%,transparent_70%)] blur-2xl"
      />
      <div className="relative rounded-[1.6rem] bg-gradient-to-br from-indigo via-violet to-blue p-[1.5px] shadow-[0_24px_80px_-24px_var(--glow)]">
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[calc(1.6rem-1.5px)]">
          <Image
            src="/assets/profile/profile.webp"
            alt="Portrait of Samvrit Srinath"
            width={1200}
            height={1600}
            priority
            className="h-full w-full origin-bottom scale-[1.14] object-cover"
          />
        </div>
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