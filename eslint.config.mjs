import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  {
    // test-results/ and playwright-report/ are Playwright's output directories.
    // They are gitignored but ESLint globs the working tree, not the index, so
    // without this the linter reads trace screenshots and .last-run.json while
    // a suite is mid-write. Observed as an intermittent glob error when lint
    // ran alongside a suite; it is a race, not a code problem, and ignoring
    // the directory removes it at the source.
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "next-env.d.ts",
      "test-results/**",
      "playwright-report/**",
      "graphify-out/**",
      ".agents/**",
      ".opencode/**",
    ],
  },
  ...nextVitals,
  ...nextTypescript,
];

export default eslintConfig;