// Unit tests for the extracted integrator. These are the correctness floor for
// the LomaVerse simulation and its four committed presets: the case study's
// claims rest on this code, so a physics regression here would silently make
// the demo misrepresent the system it documents.
//
// node:test and node:assert rather than bun:test, matching
// tests/content-depth.test.ts: the bun globals have no type declarations in
// this tsconfig, so a bun:test import makes `bun run typecheck` fail on a file
// that has no type error. The runner is still `bun test`, which executes
// node:test specs.
import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import {
  advance,
  energy,
  makeSim,
  reset,
  step,
} from "../components/demos/nbody-core";
import presets from "../public/assets/projects/lomaverse/presets.json";

type Preset = (typeof presets.presets)[number];
const { dt, stepsPerFrame, warmup } = presets;

function build(preset: Preset) {
  return makeSim(
    preset.bodies.map((b) => ({
      name: b.name,
      mass: b.mass,
      position: b.position as [number, number, number],
      velocity: b.velocity as [number, number, number],
      radius: b.radius,
      trailColor: b.trailColor,
    })),
    presets.G,
  );
}

test("presets carry the four validated classes in case-study order", () => {
  assert.deepEqual(
    presets.presets.map((p) => p.id),
    ["solar", "binary", "chaos", "lagrange"],
  );
});

test("every preset body carries a non-empty provenance", () => {
  for (const preset of presets.presets) {
    assert.ok(preset.bodies.length > 0, `${preset.id} has bodies`);
    for (const body of preset.bodies) {
      assert.ok(body.provenance.length > 0, `${preset.id}/${body.name}`);
      assert.ok(
        body.provenance.includes("circular-orbit rule"),
        `${preset.id}/${body.name} names the seeding rule`,
      );
    }
  }
});

test("solar is verbatim from bodies.json", () => {
  const bodies = JSON.parse(
    readFileSync(
      `${new URL("..", import.meta.url).pathname}public/assets/projects/lomaverse/bodies.json`,
      "utf8",
    ),
  ) as { bodies: { name: string; mass: number; position: number[]; velocity: number[] }[] };
  const solar = presets.presets[0];
  assert.equal(solar.id, "solar");
  for (const [i, body] of bodies.bodies.entries()) {
    assert.equal(solar.bodies[i].name, body.name);
    assert.equal(solar.bodies[i].mass, body.mass);
    assert.deepEqual(solar.bodies[i].position, body.position);
    assert.deepEqual(solar.bodies[i].velocity, body.velocity);
  }
});

// Velocity Verlet at fixed dt has no secular energy drift in the softened
// potential, which is what makes a fixed-step run reproducible. A drift above
// this bound means the integrator or dt changed, so the presets no longer
// describe the system the case study documents.
//
// The bound is on ABSOLUTE drift, not relative, and that distinction was
// measured rather than guessed. The binary preset first failed a 1e-6 relative
// bound at 1.85e-6, which looked like integrator error. It is not: the drift is
// already 5.3e-10 after a single step and then flat, and the binary's total
// energy is 5.04e5 against the solar preset's -3.36e2. In absolute terms the
// binary has the SMALLEST drift of the four; only the ratio makes it look
// worst, because a large denominator shrinks a relative error.
//
// Relative bounds are the wrong instrument for a family of presets with
// energies spanning three orders of magnitude: they silently demand tighter
// absolute accuracy from the high-energy configuration than from the low-energy
// one. Absolute drift per step is also the quantity that decides whether a long
// run stays readable, so it is the one worth bounding.
const MAX_ABSOLUTE_ENERGY_DRIFT = 1e-4;

for (const preset of presets.presets) {
  test(`${preset.id}: absolute energy drift stays bounded over 10k steps`, () => {
    const sim = build(preset);
    const e0 = energy(sim);
    advance(sim, dt, 10000);
    const drift = Math.abs(energy(sim) - e0);
    assert.ok(
      drift < MAX_ABSOLUTE_ENERGY_DRIFT,
      `${preset.id} absolute energy drift ${drift.toExponential(3)} exceeds ${MAX_ABSOLUTE_ENERGY_DRIFT.toExponential(0)}`,
    );
  });
}

test("drift does not grow secularly: 10k steps stay within 10x of 1k steps", () => {
  // A bounded-but-growing drift is a different failure from a bounded constant
  // one, and only the first invalidates a long capture. The softened potential
  // contributes a near-constant offset, so a correct integrator flattens out.
  for (const preset of presets.presets) {
    const a = build(preset);
    const e0 = energy(a);
    advance(a, dt, 1000);
    const early = Math.abs(energy(a) - e0);
    advance(a, dt, 9000);
    const late = Math.abs(energy(a) - e0);
    assert.ok(
      late < early * 10 + MAX_ABSOLUTE_ENERGY_DRIFT,
      `${preset.id} drift grew from ${early.toExponential(3)} to ${late.toExponential(3)}, which is secular`,
    );
  }
});

test("the same preset and dt produce identical state twice", () => {
  const a = build(presets.presets[2]);
  const b = build(presets.presets[2]);
  advance(a, dt, 500);
  advance(b, dt, 500);
  assert.deepEqual(Array.from(a.pos), Array.from(b.pos));
  assert.deepEqual(Array.from(a.vel), Array.from(b.vel));
});

test("step sampling is a pure function of step count, not wall clock", () => {
  // Fixed step counts mean a run never depends on how long the browser took to
  // render the previous frame.
  const run = (steps: number) => {
    const sim = build(presets.presets[3]);
    advance(sim, dt, warmup + steps * stepsPerFrame);
    return Array.from(sim.pos);
  };
  assert.deepEqual(run(0), run(0));
  assert.deepEqual(run(7), run(7));
  assert.notDeepEqual(run(7), run(8));
});

test("reset restores the exact initial conditions", () => {
  const sim = build(presets.presets[0]);
  const initial = Array.from(sim.pos);
  advance(sim, dt, 2000);
  assert.notDeepEqual(Array.from(sim.pos), initial);
  reset(sim);
  assert.deepEqual(Array.from(sim.pos), initial);
});

test("step accelerates a body toward the primary", () => {
  const sim = makeSim(
    [
      {
        name: "a",
        mass: 1,
        position: [10, 0, 0],
        velocity: [0, 0, 0],
        radius: 0.1,
        trailColor: "#fff",
      },
      {
        name: "b",
        mass: 1000,
        position: [0, 0, 0],
        velocity: [0, 0, 0],
        radius: 0.2,
        trailColor: "#fff",
      },
    ],
    presets.G,
  );
  const before = sim.pos[0];
  step(sim, dt);
  // Pulled toward the primary at x=0, so a body at +x must move in -x.
  assert.ok(sim.pos[0] < before, "body at +x accelerates in -x");
});
// Boundedness: bodies must stay near the system they orbit for a long run.
//
// This is the check the energy bound could not make. Three small masses with no
// central body conserve energy perfectly while flying apart, so the drift tests
// passed on a configuration that rendered three empty starfields. The Phase A
// spike caught it by eye, and this test is the machine version of that review.
//
// The horizon is deliberately longer than a single browser session: a preset
// that escapes only after a few minutes would pass a short test and then ship a
// demo that empties out while a reader is watching it.
const BOUNDED_STEPS = 60_000;

for (const preset of presets.presets) {
  test(`${preset.id}: bodies stay bound across a long run`, () => {
    const sim = build(preset);
    const count = preset.bodies.length;
    const initialOuter = Math.max(
      ...preset.bodies
        .slice(1)
        .map((b) => Math.hypot(b.position[0], b.position[1], b.position[2])),
    );
    let worst = 0;
    for (let i = 0; i < BOUNDED_STEPS; i++) {
      step(sim, dt);
      for (let b = 1; b < count; b++) {
        const r = Math.hypot(
          sim.pos[b * 3],
          sim.pos[b * 3 + 1],
          sim.pos[b * 3 + 2],
        );
        if (r > worst) worst = r;
      }
    }
    assert.ok(
      worst < initialOuter * 2.5,
      `${preset.id} bodies reach r ${worst.toFixed(2)} against an initial ${initialOuter.toFixed(2)}; the configuration is escaping and the demo would empty out`,
    );
  });
}
