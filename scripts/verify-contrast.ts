import { readFileSync } from "node:fs";
import { projects } from "../data/projects";
import { sharedTokens, themeTokens } from "../design/tokens";

type Tokens = Record<string, string>;
type Mode = { name: "light" | "dark"; tokens: Tokens };

const TEXT_MINIMUM = 4.5;
const GRAPHICS_MINIMUM = 3;

function normalize(tokens: Tokens): Tokens {
  const out: Tokens = {};
  for (const [name, value] of Object.entries(tokens)) {
    out[name.replace(/^--/, "")] = value;
  }
  return out;
}

function cssModes(): Mode[] {
  const css = readFileSync("app/globals.css", "utf8");
  const block = (selector: RegExp, label: string) => {
    const match = selector.exec(css);
    if (!match) throw new Error(`FAIL: no ${label} block in app/globals.css`);
    const tokens: Tokens = {};
    for (const token of match[0].matchAll(/--([\w-]+):\s*([^;]+);/g)) {
      tokens[token[1]] = token[2].trim();
    }
    if (tokens.accent && !tokens.accent) tokens.accent = tokens.accent;
    return tokens;
  };
  return [
    { name: "light", tokens: block(/:root\s*\{[^}]*\}/, ":root") },
    { name: "dark", tokens: block(/\.dark\s*\{[^}]*\}/, ".dark") },
  ];
}

function tokenModes(): Mode[] {
  const shared = normalize(sharedTokens);
  return [
    { name: "light", tokens: { ...normalize(themeTokens.light), ...shared } },
    { name: "dark", tokens: { ...normalize(themeTokens.dark), ...shared } },
  ];
}

const useTokens = process.argv.includes("--tokens");
const modes = useTokens ? tokenModes() : cssModes();

function parseColor(value: string): { rgb: number[]; alpha: number } {
  const hex = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i.exec(value);
  if (hex) {
    let digits = hex[1];
    if (digits.length === 3) digits = [...digits].map((d) => d + d).join("");
    const channels = [0, 2, 4].map((i) =>
      Number.parseInt(digits.slice(i, i + 2), 16),
    );
    const alpha =
      digits.length === 8
        ? Number.parseInt(digits.slice(6, 8), 16) / 255
        : 1;
    return { rgb: channels, alpha };
  }
  const fn = /rgba?\(([^)]+)\)/i.exec(value);
  if (fn) {
    const parts = fn[1]
      .split(/[,/\s]+/)
      .filter(Boolean)
      .map(Number);
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

function percent(value: string | undefined, name: string, mode: string): number {
  if (!value) throw new Error(`FAIL: --${name} missing in ${mode} mode`);
  const match = /^([\d.]+)%$/.exec(value.trim());
  if (!match) {
    throw new Error(`FAIL: --${name} is not a percentage in ${mode} mode`);
  }
  return Number(match[1]) / 100;
}

function permutations<T>(items: T[]): T[][] {
  if (items.length <= 1) return [items];
  return items.flatMap((item, i) =>
    permutations([...items.slice(0, i), ...items.slice(i + 1)]).map((rest) => [
      item,
      ...rest,
    ]),
  );
}

const failures: string[] = [];
const rows: string[] = [];

function check(
  mode: Mode,
  label: string,
  fgName: string,
  bgName: string,
  minimum: number,
) {
  const fgToken = mode.tokens[fgName];
  const bgToken = mode.tokens[bgName];
  if (!fgToken) throw new Error(`FAIL: --${fgName} missing in ${mode.name} mode`);
  if (!bgToken) throw new Error(`FAIL: --${bgName} missing in ${mode.name} mode`);
  const fg = parseColor(fgToken);
  const bg = parseColor(bgToken).rgb;
  const painted = composite(fg.rgb, bg, fg.alpha);
  const measured = ratio(painted, bg);
  const row = `${mode.name}  ${label.padEnd(38)} ${measured.toFixed(2)}:1`;
  rows.push(row);
  if (measured < minimum) {
    failures.push(`${row.trim()} (needs ${minimum})`);
  }
}

function checkPair(
  mode: Mode,
  label: string,
  fg: { rgb: number[]; alpha: number },
  bg: number[],
  minimum: number,
) {
  const painted = composite(fg.rgb, bg, fg.alpha);
  const measured = ratio(painted, bg);
  const row = `${mode.name}  ${label.padEnd(38)} ${measured.toFixed(2)}:1`;
  rows.push(row);
  if (measured < minimum) failures.push(`${row.trim()} (needs ${minimum})`);
}

for (const mode of modes) {
  for (const fgName of ["ink", "ink-soft", "ink-faint", "accent"]) {
    for (const bgName of ["void", "surface"]) {
      check(mode, `${fgName} on ${bgName}`, fgName, bgName, TEXT_MINIMUM);
    }
  }

  if (mode.tokens["accent-contrast"]) {
    check(
      mode,
      "accent-contrast on accent",
      "accent-contrast",
      "accent",
      TEXT_MINIMUM,
    );
  }

  for (const fgName of ["data-slate", "data-ochre", "data-sage"]) {
    if (!mode.tokens[fgName]) continue;
    for (const bgName of ["void", "surface"]) {
      check(mode, `${fgName} on ${bgName}`, fgName, bgName, TEXT_MINIMUM);
      check(
        mode,
        `${fgName} on ${bgName} (graphic)`,
        fgName,
        bgName,
        GRAPHICS_MINIMUM,
      );
    }
  }

  for (const bgName of ["void", "surface"]) {
    check(
      mode,
      `focus accent on ${bgName}`,
      "accent",
      bgName,
      GRAPHICS_MINIMUM,
    );
  }
}

if (modes.some((mode) => mode.tokens["atmosphere"])) {
  for (const mode of modes) {
    const atmosphere = mode.tokens["atmosphere"];
    const echo = mode.tokens["atmosphere-echo"];
    const warm = mode.tokens["atmosphere-warm"];
    if (!atmosphere || !echo || !warm) {
      throw new Error(`FAIL: atmosphere tokens missing in ${mode.name} mode`);
    }
    const layerAlpha = {
      atmosphere: percent(mode.tokens["atmo-field-alpha"], "atmo-field-alpha", mode.name),
      "atmosphere-echo": percent(
        mode.tokens["atmo-echo-alpha"],
        "atmo-echo-alpha",
        mode.name,
      ),
      "atmosphere-warm": percent(
        mode.tokens["atmo-warm-alpha"],
        "atmo-warm-alpha",
        mode.name,
      ),
    };
    const layers = ["atmosphere", "atmosphere-echo", "atmosphere-warm"] as const;

    for (const bgName of ["void", "surface"]) {
      const base = parseColor(mode.tokens[bgName]).rgb;
      let worst = {
        fg: "",
        value: Infinity,
      };
      for (const order of permutations([...layers])) {
        let background = base;
        for (const layer of order) {
          background = composite(
            parseColor(mode.tokens[layer]).rgb,
            background,
            layerAlpha[layer],
          );
        }
        for (const fgName of ["ink", "ink-soft", "ink-faint", "accent"]) {
          const measured = ratio(parseColor(mode.tokens[fgName]).rgb, background);
          if (measured < worst.value) worst = { fg: fgName, value: measured };
        }
      }
      const label = `atmosphere worst ${worst.fg} on ${bgName}`;
      const row = `${mode.name}  ${label.padEnd(38)} ${worst.value.toFixed(2)}:1`;
      rows.push(row);
      if (worst.value < TEXT_MINIMUM) {
        failures.push(`${row.trim()} (needs ${TEXT_MINIMUM})`);
      }
    }
  }

  for (const mode of modes) {
    const atmosphere = mode.tokens["atmosphere"];
    const echo = mode.tokens["atmosphere-echo"];
    const warm = mode.tokens["atmosphere-warm"];
    if (!atmosphere || !echo || !warm) {
      throw new Error(`FAIL: atmosphere tokens missing in ${mode.name} mode`);
    }
    const layers = [
      { name: "field", color: atmosphere, alpha: percent(mode.tokens["site-field-alpha"], "site-field-alpha", mode.name) },
      { name: "echo", color: echo, alpha: percent(mode.tokens["site-echo-alpha"], "site-echo-alpha", mode.name) },
      { name: "warm", color: warm, alpha: percent(mode.tokens["site-warm-alpha"], "site-warm-alpha", mode.name) },
      { name: "particle", color: atmosphere, alpha: percent(mode.tokens["site-particle-alpha"], "site-particle-alpha", mode.name) },
    ];
    const base = parseColor(mode.tokens.void).rgb;
    let worst = { fg: "", value: Infinity };
    for (const order of permutations([...layers])) {
      let background = base;
      for (const layer of order) {
        background = composite(parseColor(layer.color).rgb, background, layer.alpha);
      }
      for (const fgName of ["ink", "ink-soft", "ink-faint", "accent"]) {
        const measured = ratio(parseColor(mode.tokens[fgName]).rgb, background);
        if (measured < worst.value) worst = { fg: fgName, value: measured };
      }
    }
    const label = `site atmosphere worst ${worst.fg} on void`;
    const row = `${mode.name}  ${label.padEnd(38)} ${worst.value.toFixed(2)}:1`;
    rows.push(row);
    if (worst.value < TEXT_MINIMUM) {
      failures.push(`${row.trim()} (needs ${TEXT_MINIMUM})`);
    }
  }
} else {
  for (const mode of modes) {
    const page = parseColor(mode.tokens.void).rgb;
    const blue = parseColor(mode.tokens["field-blue"]).rgb;
    const teal = parseColor(mode.tokens["field-teal"]).rgb;
    const warm = parseColor(mode.tokens["field-warm"]).rgb;
    const blueWash = composite(
      blue,
      page,
      percent(mode.tokens["atmo-wash-blue"], "atmo-wash-blue", mode.name),
    );
    const tealWash =
      mode.name === "dark"
        ? composite(
            teal,
            page,
            percent(mode.tokens["atmo-wash-teal"], "atmo-wash-teal", mode.name),
          )
        : composite(
            warm,
            page,
            percent(mode.tokens["atmo-wash-warm"], "atmo-wash-warm", mode.name),
          );
    const backgrounds = [
      {
        name: "atmo-blue",
        rgb: composite(
          blue,
          blueWash,
          percent(mode.tokens["atmo-field-blue"], "atmo-field-blue", mode.name),
        ),
      },
      {
        name: "atmo-teal",
        rgb: composite(
          teal,
          tealWash,
          percent(mode.tokens["atmo-field-teal"], "atmo-field-teal", mode.name),
        ),
      },
    ];
    for (const bg of backgrounds) {
      for (const fgName of ["ink", "ink-soft", "ink-faint", "accent"]) {
        checkPair(
          mode,
          `${fgName} on ${bg.name}`,
          parseColor(mode.tokens[fgName]),
          bg.rgb,
          TEXT_MINIMUM,
        );
      }
    }
  }
}

for (const mode of modes) {
  const weight = percent(mode.tokens["hue-text-weight"], "hue-text-weight", mode.name);
  const ink = parseColor(mode.tokens.ink).rgb;
  const page = parseColor(mode.tokens.void).rgb;
  const surface = parseColor(mode.tokens.surface).rgb;
  for (const hueValue of [...new Set(projects.map((project) => project.hue))]) {
    const hue = parseColor(hueValue).rgb;
    const text = composite(hue, ink, weight);
    const field = composite(hue, page, 0.07);
    for (const bg of [
      { name: "void", rgb: page },
      { name: "surface", rgb: surface },
      { name: "hue-field", rgb: field },
    ]) {
      checkPair(mode, `hue ${hueValue} on ${bg.name}`, { rgb: text, alpha: 1 }, bg.rgb, TEXT_MINIMUM);
    }
  }
}

for (const mode of modes) {
  for (const project of projects) {
    if (!project.projectAccent) continue;
    const accentValue = project.projectAccent[mode.name];
    const accent = parseColor(accentValue);
    const page = parseColor(mode.tokens.void).rgb;
    const surface = parseColor(mode.tokens.surface).rgb;
    const field = composite(accent.rgb, page, 0.07);
    for (const bg of [
      { name: "void", rgb: page },
      { name: "surface", rgb: surface },
      { name: "project-field", rgb: field },
    ]) {
      checkPair(
        mode,
        `${project.slug} accent on ${bg.name}`,
        accent,
        bg.rgb,
        TEXT_MINIMUM,
      );
      checkPair(
        mode,
        `${project.slug} accent on ${bg.name} (graphic)`,
        accent,
        bg.rgb,
        GRAPHICS_MINIMUM,
      );
    }
  }
}

console.log(rows.join("\n"));

if (failures.length > 0) {
  console.error(`\nFAIL: ${failures.length} pair(s) under the gate`);
  for (const line of failures) console.error(`  ${line}`);
  process.exit(1);
}

console.log(
  `\nOK: ${rows.length} pairs pass (text ${TEXT_MINIMUM}:1, graphics ${GRAPHICS_MINIMUM}:1)`,
);
