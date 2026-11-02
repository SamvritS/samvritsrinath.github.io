import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { projects } from "../../data/projects";
import { sharedTokens, themeTokens } from "../../design/tokens";

const css = readFileSync("app/globals.css", "utf8");
const layout = readFileSync("app/layout.tsx", "utf8");

test("light and shared tokens are generated into the CSS", () => {
  const tokens = { ...themeTokens.light, ...sharedTokens };
  for (const [name, value] of Object.entries(tokens)) {
    const token = name.startsWith("--") ? name : `--${name}`;
    assert.ok(
      css.includes(`${token}: ${value};`),
      `missing generated token ${token}`,
    );
  }
});

test("dark tokens override every light colour token", () => {
  for (const [name, value] of Object.entries(themeTokens.dark)) {
    assert.ok(
      css.includes(`--${name}: ${value};`),
      `missing dark token --${name}`,
    );
  }
});

test("the six curated project accents generate light and dark classes", () => {
  const accented = projects.filter((project) => project.projectAccent);
  assert.equal(accented.length, 6, "six projects carry curated accents");
  for (const project of accented) {
    const className = `project-accent-${project.slug}`;
    assert.ok(
      css.includes(
        `.${className} { --project-accent: ${project.projectAccent?.light}; }`,
      ),
      `missing light class ${className}`,
    );
    assert.ok(
      css.includes(
        `.dark .${className} { --project-accent: ${project.projectAccent?.dark}; }`,
      ),
      `missing dark class ${className}`,
    );
  }
});

test("the legacy wavelength token is gone", () => {
  assert.ok(!css.includes("wavelength"), "no legacy token in the CSS");
  assert.ok(!layout.includes("wavelength"), "no legacy token in the layout");
});

test("the reading role stays on Outfit", () => {
  assert.ok(!layout.includes("Source_Serif_4"), "no serif font is loaded");
  assert.ok(!css.includes("--font-serif"), "no serif token is emitted");
  assert.ok(!css.includes("font-source-serif"), "no serif runtime variable");
  assert.match(css, /\.read\s*\{[^}]*font-size:/);
});

test("the ambient particle layer is token-driven and reduced-motion aware", () => {
  assert.ok(css.includes(".ds-atmosphere-particle-layer"));
  assert.ok(css.includes("var(--site-particle-alpha"));
  assert.match(
    css,
    /@media \(prefers-reduced-motion: reduce\)[\s\S]*ds-atmosphere-particle-layer/,
  );
});
