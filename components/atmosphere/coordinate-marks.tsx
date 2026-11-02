export function CoordinateMarks({
  className,
  tone = "var(--accent)",
}: {
  className?: string;
  tone?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 96 96"
      fill="none"
      className={className}
    >
      <path
        d="M48 8v24M48 64v24M8 48h24M64 48h24"
        stroke="var(--line-strong)"
      />
      <circle cx="48" cy="48" r="10" stroke="var(--line)" />
      <circle cx="48" cy="48" r="2" fill={tone} />
      <path
        d="M20 20h8M20 20v8M76 76h-8M76 76v-8"
        stroke="var(--line-strong)"
      />
    </svg>
  );
}
