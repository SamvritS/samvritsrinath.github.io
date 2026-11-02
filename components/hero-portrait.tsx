import Image from "next/image";

export function HeroPortrait() {
  return (
    <figure data-testid="hero-portrait" className="hero-portrait">
      <div className="hero-portrait-frame">
        <Image
          src="/assets/profile/profile-circle.webp"
          alt="Portrait of Samvrit Srinath"
          width={880}
          height={880}
          priority
          sizes="(min-width: 1024px) 420px, (min-width: 768px) 336px, 280px"
          className="hero-portrait-image"
        />
      </div>
      <figcaption className="hero-portrait-caption">
        <span>San Jose, CA</span>
      </figcaption>
    </figure>
  );
}
