import Image from "next/image";

export function Portrait() {
  return (
    <figure data-testid="portrait" className="w-full">
      <div className="relative mx-auto aspect-square w-full max-w-[320px]">
        <Image
          src="/assets/profile/profile-circle.webp"
          alt="Portrait of Samvrit Srinath"
          width={880}
          height={880}
          loading="eager"
          className="block h-full w-full rounded-full border border-line-strong object-cover"
        />
      </div>
      <figcaption className="sr-only">
        Portrait of Samvrit Srinath
      </figcaption>
    </figure>
  );
}
