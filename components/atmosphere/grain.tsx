export function Grain({ id }: { id: string }) {
  const filterId = `${id}-filter`;
  return (
    <svg
      aria-hidden="true"
      data-testid="atmosphere-grain"
      className="ds-atmosphere-grain"
      width="100%"
      height="100%"
      preserveAspectRatio="none"
    >
      <filter id={filterId}>
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.8"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter={`url(#${filterId})`} />
    </svg>
  );
}
