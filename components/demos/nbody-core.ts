// Pure N-body physics, extracted verbatim from components/demos/lomaverse-sim.tsx
// so the unit tests can run the shipped integrator without a React tree or a
// WebGL context.
//
// Nothing here touches the DOM, three, or React. The sim imports from here, so
// there is exactly one integrator in the repo. If this file and the sim ever
// disagree, the case study's claim is void, so the sim imports rather than
// re-declares.

export type BodyConfig = {
  name: string;
  mass: number;
  position: [number, number, number];
  velocity: [number, number, number];
  radius: number;
  trailColor: string;
};

export type Sim = {
  G: number;
  masses: Float64Array;
  pos: Float64Array;
  vel: Float64Array;
  acc: Float64Array;
  next: Float64Array;
  init: Float64Array;
};

// Softening length. The shipped value, carried across unchanged: an unsoftened
// integrator diverges on close approaches, and the committed presets must be the
// same system the case study describes, not a numerically different one.
export const EPS2 = 0.05 * 0.05;

export function computeAccel(sim: Sim, pos: Float64Array, out: Float64Array) {
  out.fill(0);
  for (let i = 0; i < sim.masses.length; i++) {
    for (let j = 0; j < sim.masses.length; j++) {
      if (i === j) continue;
      const dx = pos[j * 3] - pos[i * 3];
      const dy = pos[j * 3 + 1] - pos[i * 3 + 1];
      const dz = pos[j * 3 + 2] - pos[i * 3 + 2];
      const r2 = dx * dx + dy * dy + dz * dz + EPS2;
      const s = (sim.G * sim.masses[j]) / (r2 * Math.sqrt(r2));
      out[i * 3] += dx * s;
      out[i * 3 + 1] += dy * s;
      out[i * 3 + 2] += dz * s;
    }
  }
}

export function makeSim(bodies: BodyConfig[], G: number): Sim {
  const n = bodies.length;
  const sim: Sim = {
    G,
    masses: new Float64Array(n),
    pos: new Float64Array(n * 3),
    vel: new Float64Array(n * 3),
    acc: new Float64Array(n * 3),
    next: new Float64Array(n * 3),
    init: new Float64Array(n * 6),
  };
  bodies.forEach((b, i) => {
    sim.pos.set(b.position, i * 3);
    sim.vel.set(b.velocity, i * 3);
    sim.init.set([...b.position, ...b.velocity], i * 6);
    sim.masses[i] = b.mass;
  });
  computeAccel(sim, sim.pos, sim.acc);
  return sim;
}

// Velocity Verlet. Position uses the current acceleration, velocity averages the
// old and freshly computed accelerations, so the scheme is time-reversible and
// second order, which is what lets energy drift be used as a correctness bound
// in tests/nbody-core.test.ts.
export function step(sim: Sim, dt: number) {
  const { pos, vel, acc, next } = sim;
  for (let i = 0; i < pos.length; i++)
    pos[i] += vel[i] * dt + 0.5 * acc[i] * dt * dt;
  computeAccel(sim, pos, next);
  for (let i = 0; i < pos.length; i++)
    vel[i] += 0.5 * (acc[i] + next[i]) * dt;
  acc.set(next);
}

export function reset(sim: Sim) {
  for (let i = 0; i < sim.masses.length; i++) {
    sim.pos.set(sim.init.subarray(i * 6, i * 6 + 3), i * 3);
    sim.vel.set(sim.init.subarray(i * 6 + 3, i * 6 + 6), i * 3);
  }
  computeAccel(sim, sim.pos, sim.acc);
}

export function advance(sim: Sim, dt: number, steps: number) {
  for (let i = 0; i < steps; i++) step(sim, dt);
}

// Total mechanical energy per unit: kinetic plus the softened potential that
// computeAccel actually integrates. The test bound is only meaningful if this
// uses the same EPS2 as the force law, which is why it lives beside it.
export function energy(sim: Sim): number {
  let kinetic = 0;
  for (let i = 0; i < sim.masses.length; i++) {
    const vx = sim.vel[i * 3];
    const vy = sim.vel[i * 3 + 1];
    const vz = sim.vel[i * 3 + 2];
    kinetic += 0.5 * sim.masses[i] * (vx * vx + vy * vy + vz * vz);
  }
  let potential = 0;
  for (let i = 0; i < sim.masses.length; i++) {
    for (let j = i + 1; j < sim.masses.length; j++) {
      const dx = sim.pos[j * 3] - sim.pos[i * 3];
      const dy = sim.pos[j * 3 + 1] - sim.pos[i * 3 + 1];
      const dz = sim.pos[j * 3 + 2] - sim.pos[i * 3 + 2];
      const r = Math.sqrt(dx * dx + dy * dy + dz * dz + EPS2);
      potential -= (sim.G * sim.masses[i] * sim.masses[j]) / r;
    }
  }
  return kinetic + potential;
}

export function positions(sim: Sim): number[] {
  return Array.from(sim.pos);
}

export function velocities(sim: Sim): number[] {
  return Array.from(sim.vel);
}