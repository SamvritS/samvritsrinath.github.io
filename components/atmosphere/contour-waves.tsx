function wavePath(y: number, amplitude: number, phase: number) {
  const width = 1200;
  const steps = 6;
  const points = Array.from({ length: steps + 1 }, (_, index) => {
    const x = (width / steps) * index;
    const py = y + Math.sin(index * 0.85 + phase) * amplitude;
    return [x, py] as const;
  });

  return points.reduce((path, point, index) => {
    if (index === 0) return `M${point[0]} ${point[1].toFixed(1)}`;
    const previous = points[index - 1];
    const controlX = (previous[0] + point[0]) / 2;
    return `${path} Q${controlX} ${previous[1].toFixed(1)} ${point[0]} ${point[1].toFixed(1)}`;
  }, "");
}

const LAYER_A = [
  wavePath(120, 34, 0.2),
  wavePath(260, 28, 0.7),
  wavePath(400, 24, 1.2),
  wavePath(540, 30, 1.7),
  wavePath(680, 38, 2.2),
];

const LAYER_B = [
  wavePath(160, 48, 1.4),
  wavePath(300, 36, 1.9),
  wavePath(440, 44, 2.4),
  wavePath(580, 32, 2.9),
  wavePath(720, 50, 3.4),
];

function ContourLayer({ paths, layer }: { paths: string[]; layer: "a" | "b" }) {
  return (
    <g className={`ds-atmosphere-contour-layer ds-atmosphere-contour-layer--${layer}`}>
      {paths.map((path) => (
        <path
          key={path}
          d={path}
          className="ds-atmosphere-contour-line"
          pathLength={1}
        />
      ))}
    </g>
  );
}

export function ContourWaves() {
  return (
    <svg
      aria-hidden="true"
      data-testid="atmosphere-contour"
      viewBox="0 0 1200 800"
      preserveAspectRatio="none"
      className="ds-atmosphere-contour"
    >
      <ContourLayer paths={LAYER_A} layer="a" />
      <ContourLayer paths={LAYER_B} layer="b" />
    </svg>
  );
}
