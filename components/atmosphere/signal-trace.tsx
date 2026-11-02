export function SignalTrace({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 520 140"
      fill="none"
      className={className}
    >
      <path
        d="M0 96C90 96 120 24 220 24S360 116 450 96"
        stroke="var(--line-strong)"
        strokeWidth="1"
        pathLength={1}
        className="signal-trace-path"
      />
      <path
        d="M450 96c30 0 42-12 62-12"
        stroke="var(--accent)"
        strokeWidth="1"
        pathLength={1}
        className="signal-trace-path signal-trace-accent"
      />
      <circle cx="220" cy="24" r="2.5" fill="var(--atmosphere-echo)" />
      <circle cx="360" cy="94" r="2.5" fill="var(--atmosphere)" />
      <circle cx="512" cy="84" r="3" fill="var(--accent)" />
    </svg>
  );
}
