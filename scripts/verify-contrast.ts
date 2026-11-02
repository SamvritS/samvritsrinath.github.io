import { readFileSync } from "node:fs";
import { projects } from "../data/projects";

// WCAG 1.4.3, measured from the token sheet rather than trusted from review.
// The pairs below are the reading palette of every route: three greys and the
// accent, each over both page surfaces, in both modes.
//
// Deliberately not gated, with the reason recorded rather than omitted:
//   --line, --line-strong  borders and rules, which carry no text. Gating them
//                          at 3:1 (WCAG 1.4.11, non-text) would force a visible
//                          hairline into a design whose separators are meant to
//                          whisper; that is a brand decision, not a check.
const css = readFileSync("app/globals.css", "utf8");

const BACKGROUNDS = ["void", "surface"];
const FOREGROUNDS = ["ink", "ink-soft", "ink-faint", "wavelength"];
const MINIMUM = 4.5;

function tokensOf(selector: RegExp, label: string): Record<string, string> {
  const match = selector.exec(css);
  if (!match) throw new Error(`FAIL: no ${label} block in app/globals.css`);
  const found: Record<string, string> = {};
  for (const t of match[0].matchAll(/--([\w-]+):\s*([^;]+);/g)) {
    found[t[1]] = t[2].trim();
  }
  return found;
}

const modes = [
  { name: "light", tokens: tokensOf(/:root\s*\{[^}]*\}/, ":root") },
  { name: "dark", tokens: tokensOf(/\.dark\s*\{[^}]*\}/, ".dark") },
];

function parseColor(value: string): { rgb: number[]; alpha: number } {
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(value);
  if (hex) {
    let digits = hex[1];
    if (digits.length === 3) digits = [...digits].map((d) => d + d).join("");
    const channels = [0, 2, 4].map((i) => Number.parseInt(digits.slice(i, i + 2), 16));
    const alpha =
      digits.length === 8 ? Number.parseInt(digits.slice(6, 8), 16) / 255 : 1;
    return { rgb: channels, alpha };
  }
  const fn = /rgba?\(([^)]+)\)/i.exec(value);
  if (fn) {
    const parts = fn[1].split(/[,/\s]+/).filter(Boolean).map(Number);
    if (parts.length >= 3) {
      return { rgb: parts.slice(0, 3), alpha: parts[3] ?? 1 };
    }
  }
  throw new Error(`FAIL: cannot parse colour token value "${value}"`);
}

function composite(fg: number[], bg: number[], alpha: number): number[] {
  return fg.map((channel, i) => channel * alpha + bg[i] * (1 - alpha));
}

function luminance(rgb: number[]): number {
  const [r, g, b] = rgb.map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(fg: number[], bg: number[]): number {
  const a = luminance(fg);
  const b = luminance(bg);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

const failures: string[] = [];
const rows: string[] = [];

for (const { name, tokens } of modes) {
  for (const fgName of FOREGROUNDS) {
    const fgToken = tokens[fgName];
    if (!fgToken) throw new Error(`FAIL: --${fgName} missing in ${name} mode`);
    const fg = parseColor(fgToken);
    for (const bgName of BACKGROUNDS) {
      const bgToken = tokens[bgName];
      if (!bgToken) throw new Error(`FAIL: --${bgName} missing in ${name} mode`);
      const bg = parseColor(bgToken).rgb;
      const painted = composite(fg.rgb, bg, fg.alpha);
      const measured = ratio(painted, bg);
      const label = `${name}  ${fgName.padEnd(10)} on ${bgName.padEnd(8)}`;
      rows.push(`${label}  ${measured.toFixed(2)}:1`);
      if (measured < MINIMUM) {
        failures.push(`${label.trim()}  ${measured.toFixed(2)}:1 (needs ${MINIMUM})`);
      }
    }
  }
}

function alphaOf(token: string | undefined, name: string, mode: string): number {
  if (!token) {
    throw new Error(`FAIL: --${name} missing in ${mode} mode`);
  }
  const match = /^([\d.]+)%$/.exec(token.trim());
  if (!match) {
    throw new Error(`FAIL: --${name} is not a percentage in ${mode} mode`);
  }
  return Number(match[1]) / 100;
}

// The atmosphere fields paint over the page, so the measure that matters is
// the worst texel a reader can sit on: the field centre after the section wash.
// The alphas live in the token sheet, so a stronger field cannot silently
// push a label below the floor.
for (const { name, tokens } of modes) {
  const color = (token: string) => {
    const value = tokens[token];
    if (!value) throw new Error(`FAIL: --${token} missing in ${name} mode`);
    return parseColor(value).rgb;
  };

  const page = color("void");
  const blue = color("field-blue");
  const teal = color("field-teal");
  const warm = color("field-warm");

  const blueWash = composite(
    blue,
    page,
    alphaOf(tokens["atmo-wash-blue"], "atmo-wash-blue", name),
  );
  const tealWash =
    name === "dark"
      ? composite(
          teal,
          page,
          alphaOf(tokens["atmo-wash-teal"], "atmo-wash-teal", name),
        )
      : composite(
          warm,
          page,
          alphaOf(tokens["atmo-wash-warm"], "atmo-wash-warm", name),
        );

  const backgrounds = [
    {
      name: "atmo-blue",
      rgb: composite(
        blue,
        blueWash,
        alphaOf(tokens["atmo-field-blue"], "atmo-field-blue", name),
      ),
    },
    {
      name: "atmo-teal",
      rgb: composite(
        teal,
        tealWash,
        alphaOf(tokens["atmo-field-teal"], "atmo-field-teal", name),
      ),
    },
  ];

  for (const bg of backgrounds) {
    for (const fgName of FOREGROUNDS) {
      const fg = parseColor(tokens[fgName]);
      const painted = composite(fg.rgb, bg.rgb, fg.alpha);
      const measured = ratio(painted, bg.rgb);
      const label = `${name}  ${fgName.padEnd(10)} on ${bg.name}`;
      rows.push(`${label}  ${measured.toFixed(2)}:1`);
      if (measured < MINIMUM) {
        failures.push(`${label.trim()}  ${measured.toFixed(2)}:1 (needs ${MINIMUM})`);
      }
    }
  }
}

// Project hue text is tinted from each project's own hue, so it needs its own
// gate. The token weight is the hue fraction in the color-mix.
for (const { name, tokens } of modes) {
  const weight = alphaOf(tokens["hue-text-weight"], "hue-text-weight", name);
  const ink = parseColor(tokens["ink"]).rgb;
  const page = parseColor(tokens["void"]).rgb;
  const surface = parseColor(tokens["surface"]).rgb;

  for (const hueValue of [...new Set(projects.map((project) => project.hue))]) {
    const hue = parseColor(hueValue).rgb;
    const text = composite(hue, ink, weight);
    const field = composite(hue, page, 0.07);

    const hueBackgrounds = [
      { name: "void", rgb: page },
      { name: "surface", rgb: surface },
      { name: "hue-field", rgb: field },
    ];

    for (const bg of hueBackgrounds) {
      const measured = ratio(text, bg.rgb);
      const label = `${name}  hue ${hueValue} on ${bg.name}`;
      rows.push(`${label}  ${measured.toFixed(2)}:1`);
      if (measured < MINIMUM) {
        failures.push(`${label}  ${measured.toFixed(2)}:1 (needs ${MINIMUM})`);
      }
    }
  }
}

console.log(rows.join("\n"));

if (failures.length > 0) {
  console.error(`FAIL: ${failures.length} text pair(s) under ${MINIMUM}:1`);
  for (const line of failures) console.error(`  ${line}`);
  process.exit(1);
}

console.log(`OK: every gated text pair is at or above ${MINIMUM}:1 in both modes`);
