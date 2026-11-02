import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const gone = [
  "components/planetary-journey",
  "components/transit-band.tsx",
  "components/transit-player.tsx",
  "components/observatory-band.tsx",
  "components/telemetry-ticker.tsx",
  "components/capture-gate.tsx",
  "components/demos/capture-rig.tsx",
  "app/transit-capture",
  "data/transit.ts",
  "data/orbit.ts",
  "lib/orbit",
  "public/assets/projects/transit",
  "scripts/capture-transit-frames.ts",
  "scripts/build-transit-plates.ts",
  "tests/e2e/planetary-journey.spec.ts",
  "tests/e2e/observatory-2.spec.ts",
  "tests/e2e/telemetry-ticker.spec.ts",
];

const soundGone = [
  "lib/sound.ts",
  "lib/sound-score.ts",
  "lib/sound-preference.ts",
  "components/sound-provider.tsx",
  "components/sound-toggle.tsx",
  "components/atmosphere/piano-strip.tsx",
  "tests/e2e/sound.spec.ts",
  "tests/unit/sound-score.test.ts",
];

function sourceFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return sourceFiles(path);
    return /\.(ts|tsx|css)$/.test(entry.name) ? [path] : [];
  });
}

test("planetary and transit machinery stays removed", () => {
  for (const path of gone) assert.equal(existsSync(path), false, path);
});

test("the sound runtime stays removed", () => {
  for (const path of soundGone) assert.equal(existsSync(path), false, path);
});

test("shipped source references no audio runtime", () => {
  const banned = [
    "AudioContext",
    "createOscillator",
    "sound-toggle",
    "piano-strip",
    "lib/sound",
  ];
  for (const file of ["app", "components", "lib"].flatMap(sourceFiles)) {
    const source = readFileSync(file, "utf8");
    for (const token of banned) {
      assert.equal(source.includes(token), false, `${file} references ${token}`);
    }
  }
});

test("exclusive dependencies stay removed", () => {
  const pkg = JSON.parse(readFileSync("package.json", "utf8")) as {
    dependencies: Record<string, string>;
  };
  for (const name of ["number-flow", "troika-three-text"]) {
    assert.equal(pkg.dependencies[name], undefined, name);
  }
});

test("the capture rig is not re-exported", () => {
  const lazy = readFileSync("components/demos/lazy.tsx", "utf8");
  assert.equal(lazy.includes("CaptureRig"), false);
});
