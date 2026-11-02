import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { projects } from "../data/projects";
import { sharedTokens, themeTokens } from "../design/tokens";

const BEGIN =
  "/* design-system:tokens:begin - generated from design/tokens.ts; do not edit */";
const END = "/* design-system:tokens:end */";

function declarations(tokens: Record<string, string>, indent: string) {
  return Object.entries(tokens)
    .map(([name, value]) => `${indent}${name.startsWith("--") ? name : `--${name}`}: ${value};`)
    .join("\n");
}

function projectClasses() {
  const rows: string[] = [];
  for (const project of projects) {
    if (!project.projectAccent) continue;
    const className = `project-accent-${project.slug}`;
    rows.push(`.${className} { --project-accent: ${project.projectAccent.light}; }`);
    rows.push(
      `.dark .${className} { --project-accent: ${project.projectAccent.dark}; }`,
    );
  }
  return rows.join("\n");
}

export function renderTokens() {
  return [
    BEGIN,
    ":root {",
    declarations(themeTokens.light, "  "),
    declarations(sharedTokens, "  "),
    "}",
    ".dark {",
    declarations(themeTokens.dark, "  "),
    "}",
    ".light {",
    declarations(themeTokens.light, "  "),
    "}",
    projectClasses(),
    END,
  ]
    .filter(Boolean)
    .join("\n");
}

function standalone() {
  return renderTokens().replace(BEGIN, "").replace(END, "").trim() + "\n";
}

function replaceBlock(path: string) {
  const css = readFileSync(path, "utf8");
  const start = css.indexOf(BEGIN);
  const end = css.indexOf(END);
  if (start === -1 || end === -1 || end < start) {
    throw new Error(`FAIL: token markers missing from ${path}`);
  }
  const next = `${css.slice(0, start)}${renderTokens()}${css.slice(end + END.length)}`;
  return { current: css, next };
}

const args = process.argv.slice(2);
const outIndex = args.indexOf("--out");
const out = outIndex >= 0 ? args[outIndex + 1] : undefined;
const check = args.includes("--check");
const isStandalone = args.includes("--standalone");

if (!out) {
  throw new Error("FAIL: pass --out <path> (use --standalone for a plain token file)");
}

const target = resolve(out);
const expected = isStandalone ? standalone() : renderTokens();

if (check) {
  const current = readFileSync(target, "utf8");
  if (isStandalone) {
    if (current !== expected) {
      throw new Error(`FAIL: ${target} is stale; run build-tokens`);
    }
  } else if (!current.includes(expected)) {
    throw new Error(`FAIL: ${target} token block is stale; run build-tokens`);
  }
  console.log(`OK: tokens current in ${target}`);
} else if (isStandalone) {
  writeFileSync(target, expected);
  console.log(`wrote ${target}`);
} else {
  const { next } = replaceBlock(target);
  writeFileSync(target, next);
  console.log(`updated token block in ${target}`);
}
