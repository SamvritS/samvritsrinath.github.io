function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

const random = seeded(20261101);

const PARTICLES = Array.from({ length: 60 }, (_, index) => ({
  cx: Number((random() * 1200).toFixed(1)),
  cy: Number((random() * 800).toFixed(1)),
  r: Number((1.1 + random() * 2.1).toFixed(2)),
  warm: index % 9 === 0,
}));

export function ParticleField() {
  return (
    <svg
      aria-hidden="true"
      data-testid="atmosphere-particles"
      className="ds-atmosphere-particles"
      viewBox="0 0 1200 800"
      preserveAspectRatio="xMidYMid slice"
    >
      <g className="ds-atmosphere-particle-layer">
        {PARTICLES.map((particle, index) => (
          <circle
            key={index}
            className="ds-atmosphere-particle"
            cx={particle.cx}
            cy={particle.cy}
            r={particle.r}
            fill={
              particle.warm ? "var(--atmosphere-warm)" : "var(--atmosphere)"
            }
          />
        ))}
      </g>
    </svg>
  );
}
