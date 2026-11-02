export type Swatch = { hex: string; alpha: number };

let ctx2d: CanvasRenderingContext2D | null | undefined;

// Design tokens reach the scene as CSS text, and Tailwind's optimizer rewrites
// rgba() into 8-digit hex. THREE.Color parses only #rgb and #rrggbb and carries
// no alpha channel, so an alpha-bearing token warns and leaves the material at
// its default white. A 2D canvas resolves whatever the browser understands into
// one shape, which turns the discarded alpha into material opacity.
export function swatch(value: string): Swatch {
  if (/^#[0-9a-f]{6}$/i.test(value)) return { hex: value, alpha: 1 };
  const alphaHex = /^#([0-9a-f]{6})([0-9a-f]{2})$/i.exec(value);
  if (alphaHex) {
    return { hex: `#${alphaHex[1]}`, alpha: parseInt(alphaHex[2], 16) / 255 };
  }
  if (ctx2d === undefined) {
    ctx2d =
      typeof document === "undefined"
        ? null
        : document.createElement("canvas").getContext("2d");
  }
  if (ctx2d) {
    // The sentinel is read back rather than compared as a literal: the canvas
    // serializes any opaque color to "#rrggbb" on read, so a literal string
    // comparison would never match and every token would look invalid. The
    // invalid-color path leaves the previous value untouched, so comparing
    // against the sentinel's own readback is what actually detects it. A CSS
    // keyword seeds it because a colour literal here would trip the same ban
    // this module exists to enforce elsewhere.
    ctx2d.fillStyle = "black";
    const sentinel = ctx2d.fillStyle;
    ctx2d.fillStyle = value;
    // The setter ignores invalid colors, so an untouched sentinel is the tell.
    if (ctx2d.fillStyle !== sentinel) {
      const [r, g, b, a] = ctx2d.fillStyle
        .replace(/^rgba?\(/, "")
        .replace(")", "")
        .split(/[,/\s]+/)
        .map(Number);
      if ([r, g, b].every((n) => Number.isFinite(n))) {
        const hex = `#${[r, g, b]
          .map((n) => Math.round(n).toString(16).padStart(2, "0"))
          .join("")}`;
        return { hex, alpha: Number.isFinite(a) ? a : 1 };
      }
    }
  }
  return { hex: value, alpha: 1 };
}
