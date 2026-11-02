import Image from "next/image";

export function CoverParallax({
  src,
  alt,
}: {
  src: string;
  alt: string;
}) {
  return (
    <div className="hue-line relative overflow-hidden border-y" data-testid="cover-parallax">
      <div className="relative h-[38vh] md:h-[52vh]">
        <Image
          src={src}
          alt={alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
