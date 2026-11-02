export type AtmosphereVariant =
  | "hero"
  | "experience"
  | "work"
  | "research"
  | "contact";

export function AmbientField({ variant }: { variant: AtmosphereVariant }) {
  return (
    <div
      aria-hidden="true"
      data-testid="ambient-field"
      data-variant={variant}
      className={`atmosphere atmosphere-${variant}`}
    >
      <span className="atmosphere-wash" />
      <span className="atmosphere-field" />
      <span className="atmosphere-grid" />
    </div>
  );
}
