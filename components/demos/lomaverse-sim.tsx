"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import bodiesData from "@/public/assets/projects/lomaverse/bodies.json";
import { mulberry32 } from "@/components/visuals/primitives";
import { swatch, type Swatch } from "@/lib/scene-color";
import {
  makeSim,
  reset,
  step,
  type BodyConfig,
  type Sim,
} from "@/components/demos/nbody-core";

type Colors = {
  hue: Swatch;
  accent: Swatch;
  ink: Swatch;
  faint: Swatch;
  line: Swatch;
};
type TrailState = { buf: Float32Array; head: number; count: number };

const TRAIL = 900;
const PRESTEPS = 200;

const BASE_RADIUS = 9.4;
const BASE_ELEVATION = 0.55;
const PARALLAX_RANGE = 0.12;
const PARALLAX_LERP = 0.08;
const ELEVATION_MIN = 0.15;
const ELEVATION_MAX = 1.25;
const DRAG_RATE = 0.005;
const STAR_SEED = 1889;
const STAR_COUNT = 1600;
const STAR_SHELLS = [26, 38];
const ECLIPTIC_RADIUS = 7;

function place(
  sim: Sim,
  bodies: BodyConfig[],
  meshes: React.RefObject<(THREE.Mesh | null)[]>,
) {
  for (let i = 0; i < bodies.length; i++)
    meshes.current[i]?.position.set(
      sim.pos[i * 3],
      sim.pos[i * 3 + 1],
      sim.pos[i * 3 + 2],
    );
}

function sample(sim: Sim, trails: TrailState[]) {
  for (let ti = 0; ti < trails.length; ti++) {
    const t = trails[ti];
    t.buf.set(
      [sim.pos[ti * 3], sim.pos[ti * 3 + 1], sim.pos[ti * 3 + 2]],
      t.head * 3,
    );
    t.head = (t.head + 1) % TRAIL;
    t.count = Math.min(t.count + 1, TRAIL);
  }
}

function unroll(
  trails: TrailState[],
  attr: THREE.BufferAttribute,
  geo: THREE.BufferGeometry,
) {
  const arr = attr.array as Float32Array;
  let w = 0;
  for (const t of trails) {
    if (t.count < 2) continue;
    const start = (t.head - t.count + TRAIL) % TRAIL;
    for (let s = 0; s + 1 < t.count; s++) {
      const a = ((start + s) % TRAIL) * 3;
      const b = ((start + s + 1) % TRAIL) * 3;
      arr[w++] = t.buf[a];
      arr[w++] = t.buf[a + 1];
      arr[w++] = t.buf[a + 2];
      arr[w++] = t.buf[b];
      arr[w++] = t.buf[b + 1];
      arr[w++] = t.buf[b + 2];
    }
  }
  attr.needsUpdate = true;
  geo.setDrawRange(0, w / 3);
}

function clearTrails(trails: TrailState[]) {
  for (const t of trails) {
    t.head = 0;
    t.count = 0;
  }
}

// ponytail: presentation-only scale so velocity arrows read at scene units.
// 0.05 keeps every arrow well inside its own orbital radius: the fastest body
// is |v| 20 at r 2.5, so 0.15 still drew a 3-unit arrow across a 2.5-unit
// orbit. The arrows annotate velocity, they do not cross the system.
const VECTOR_SCALE = 0.05;

function updateVectors(
  sim: Sim,
  count: number,
  attr: THREE.BufferAttribute,
  geo: THREE.BufferGeometry,
) {
  const arr = attr.array as Float32Array;
  for (let i = 0; i < count; i++) {
    arr[i * 6] = sim.pos[i * 3];
    arr[i * 6 + 1] = sim.pos[i * 3 + 1];
    arr[i * 6 + 2] = sim.pos[i * 3 + 2];
    arr[i * 6 + 3] = sim.pos[i * 3] + sim.vel[i * 3] * VECTOR_SCALE;
    arr[i * 6 + 4] = sim.pos[i * 3 + 1] + sim.vel[i * 3 + 1] * VECTOR_SCALE;
    arr[i * 6 + 5] = sim.pos[i * 3 + 2] + sim.vel[i * 3 + 2] * VECTOR_SCALE;
  }
  attr.needsUpdate = true;
  geo.setDrawRange(0, count * 2);
}

function placeOnOrbit(
  radius: number,
  elevation: number,
  azimuth: number,
  out: THREE.Vector3,
) {
  const cosEl = Math.cos(elevation);
  out.set(
    radius * cosEl * Math.sin(azimuth),
    radius * Math.sin(elevation),
    radius * cosEl * Math.cos(azimuth),
  );
}

type RigPose = { azimuth: number; elevation: number };

type RigInput = {
  pointerX: number;
  pointerY: number;
  baseAzimuth: number;
  baseElevation: number;
  dragging: boolean;
};

function Rig({
  read,
  reduced,
  onFrame,
  onReady,
}: {
  read: () => RigInput;
  reduced: boolean;
  onFrame: (pose: RigPose) => void;
  onReady: (invalidate: () => void) => void;
}) {
  const camera = useThree((s) => s.camera);
  const invalidate = useThree((s) => s.invalidate);
  const pose = useRef<RigPose>({ azimuth: 0, elevation: BASE_ELEVATION });

  useEffect(() => {
    onReady(invalidate);
  }, [invalidate, onReady]);

  useFrame((_, delta) => {
    const state = pose.current;
    if (!reduced) {
      const input = read();
      const targetAzimuth = input.baseAzimuth + input.pointerX * PARALLAX_RANGE;
      const targetElevation = Math.min(
        Math.max(
          input.baseElevation - input.pointerY * PARALLAX_RANGE,
          ELEVATION_MIN,
        ),
        ELEVATION_MAX,
      );
      // Frame-rate independent exponential smoothing, so the rig settles at the
      // same rate on a 120Hz panel as on a 60Hz one. A drag is direct
      // manipulation and tracks the hand 1:1; only the ambient parallax is
      // smoothed, because smoothing a drag reads as a rubber band.
      const k = input.dragging
        ? 1
        : 1 - Math.pow(1 - PARALLAX_LERP, Math.min(delta, 0.1) * 60);
      state.azimuth += (targetAzimuth - state.azimuth) * k;
      state.elevation += (targetElevation - state.elevation) * k;
    }
    const view = camera as THREE.PerspectiveCamera;
    placeOnOrbit(
      framing(view, state.elevation),
      state.elevation,
      state.azimuth,
      view.position,
    );
    view.lookAt(0, 0, 0);
    onFrame(state);
  });

  return null;
}

// The outer orbit plus the ecliptic reference ring have to fit the frame at
// any canvas aspect, otherwise a short wide band crops the system. Framing is
// a floor, never closer than the base pose.
function framing(view: THREE.PerspectiveCamera, elevation: number) {
  const halfFov = Math.tan(((view.fov ?? 42) / 2) * (Math.PI / 180));
  const aspect = view.aspect || 1;
  const needVertical = ECLIPTIC_RADIUS * Math.sin(elevation) * 1.12;
  const needHorizontal = ECLIPTIC_RADIUS * 1.04;
  return Math.max(
    BASE_RADIUS,
    needVertical / halfFov,
    needHorizontal / (halfFov * aspect),
  );
}

function Starfield({ color, opacity }: { color: string; opacity: number }) {
  const geometry = useMemo(() => {
    const random = mulberry32(STAR_SEED);
    const positions = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      const shell = STAR_SHELLS[i % STAR_SHELLS.length];
      const z = random() * 2 - 1;
      const theta = random() * Math.PI * 2;
      const planar = Math.sqrt(1 - z * z);
      positions[i * 3] = shell * planar * Math.cos(theta);
      positions[i * 3 + 1] = shell * z;
      positions[i * 3 + 2] = shell * planar * Math.sin(theta);
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    return geo;
  }, []);

  return (
    <points geometry={geometry} frustumCulled={false}>
      <pointsMaterial
        color={color}
        size={0.05}
        sizeAttenuation
        transparent
        opacity={opacity}
        depthWrite={false}
      />
    </points>
  );
}

function EclipticRing({ color, alpha }: { color: string; alpha: number }) {
  const geometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i < 128; i++) {
      const angle = (i / 128) * Math.PI * 2;
      points.push(
        new THREE.Vector3(
          Math.cos(angle) * ECLIPTIC_RADIUS,
          0,
          Math.sin(angle) * ECLIPTIC_RADIUS,
        ),
      );
    }
    return new THREE.BufferGeometry().setFromPoints(points);
  }, []);

  return (
    <lineLoop geometry={geometry} frustumCulled={false}>
      <lineBasicMaterial color={color} transparent opacity={alpha} />
    </lineLoop>
  );
}

function System({
  bodies,
  G,
  colors,
  reduced,
  paused,
  speed,
  resetKey,
  onTrail,
  onSpeed,
  onInspect,
}: {
  bodies: BodyConfig[];
  G: number;
  colors: Colors;
  reduced: boolean;
  paused: boolean;
  speed: number;
  resetKey: number;
  onTrail: (count: number) => void;
  onSpeed: (text: string) => void;
  onInspect: (index: number | null) => void;
}) {
  const meshes = useRef<(THREE.Mesh | null)[]>([]);
  const sim = useMemo(() => makeSim(bodies, G), [bodies, G]);
  const trails = useMemo(
    () =>
      bodies.map(() => ({ buf: new Float32Array(TRAIL * 3), head: 0, count: 0 })),
    [bodies],
  );
  const trailGeo = useMemo(() => {
    const attr = new THREE.BufferAttribute(
      new Float32Array(bodies.length * (TRAIL - 1) * 2 * 3),
      3,
    );
    attr.setUsage(THREE.DynamicDrawUsage);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", attr);
    geo.setDrawRange(0, 0);
    return { geo, attr };
  }, [bodies]);
  const vecGeo = useMemo(() => {
    const attr = new THREE.BufferAttribute(new Float32Array(bodies.length * 2 * 3), 3);
    attr.setUsage(THREE.DynamicDrawUsage);
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", attr);
    geo.setDrawRange(0, 0);
    return { geo, attr };
  }, [bodies]);
  const invalidate = useThree((s) => s.invalidate);
  const lastTrail = useRef(0);
  const speedAt = useRef(0);
  const speedIndex = useRef<number | null>(null);
  const elapsedTimeRef = useRef(0);

  useEffect(() => {
    if (resetKey === 0) return;
    reset(sim);
    clearTrails(trails);
    place(sim, bodies, meshes);
    unroll(trails, trailGeo.attr, trailGeo.geo);
    updateVectors(sim, bodies.length, vecGeo.attr, vecGeo.geo);
    invalidate();
  }, [resetKey, sim, trails, bodies, meshes, trailGeo, vecGeo, invalidate]);

  useEffect(() => {
    if (!reduced) return;
    for (let i = 0; i < PRESTEPS; i++) {
      step(sim, 1 / 60);
      sample(sim, trails);
    }
    place(sim, bodies, meshes);
    unroll(trails, trailGeo.attr, trailGeo.geo);
    updateVectors(sim, bodies.length, vecGeo.attr, vecGeo.geo);
    lastTrail.current = trails.reduce(
      (total, t) => total + (t.count < 2 ? 0 : (t.count - 1) * 2),
      0,
    );
    onTrail(lastTrail.current);
    invalidate();
  }, [reduced, sim, trails, trailGeo, vecGeo, bodies, meshes, invalidate, onTrail]);

  useFrame((state, delta) => {
    if (reduced) return;
    elapsedTimeRef.current += delta;
    if (!paused) {
      const dt = Math.min(delta, 0.05) * speed;
      step(sim, dt);
      if (![...sim.pos].every(Number.isFinite)) {
        reset(sim);
        clearTrails(trails);
      }
      place(sim, bodies, meshes);
      sample(sim, trails);
      unroll(trails, trailGeo.attr, trailGeo.geo);
      updateVectors(sim, bodies.length, vecGeo.attr, vecGeo.geo);
      lastTrail.current = trails.reduce(
        (total, t) => total + (t.count < 2 ? 0 : (t.count - 1) * 2),
        0,
      );
      onTrail(lastTrail.current);
    }
    const i = speedIndex.current;
    if (i !== null && elapsedTimeRef.current - speedAt.current > 0.2) {
      speedAt.current = elapsedTimeRef.current;
      onSpeed(
        Math.hypot(sim.vel[i * 3], sim.vel[i * 3 + 1], sim.vel[i * 3 + 2]).toFixed(1),
      );
    }
  });

  const setHover = useCallback(
    (index: number | null) => {
      speedIndex.current = index;
      onInspect(index);
    },
    [onInspect],
  );
  return (
    <group>
      <ambientLight intensity={0.22} color={colors.faint.hex} />
      <pointLight
        position={[bodies[0]?.position[0] ?? 0, bodies[0]?.position[1] ?? 0, bodies[0]?.position[2] ?? 0]}
        intensity={2.4}
        decay={0.8}
        color={colors.ink.hex}
      />
      <Starfield color={colors.faint.hex} opacity={0.5 * colors.faint.alpha} />
      <EclipticRing color={colors.line.hex} alpha={colors.line.alpha} />
      {bodies.map((b, i) => (
        <mesh
          key={b.name}
          ref={(el) => {
            meshes.current[i] = el;
          }}
          position={b.position}
          onPointerOver={(event) => {
            event.stopPropagation();
            setHover(i);
          }}
          onPointerOut={() => setHover(null)}
        >
          <sphereGeometry args={[b.radius, i === 0 ? 24 : 20, i === 0 ? 24 : 20]} />
          <meshStandardMaterial
            color={(i === 0 ? colors.accent : colors.hue).hex}
            roughness={0.55}
            metalness={0}
            emissive={(i === 0 ? colors.accent : colors.hue).hex}
            emissiveIntensity={i === 0 ? 0.55 : 0}
          />
        </mesh>
      ))}
      <lineSegments geometry={trailGeo.geo} frustumCulled={false}>
        <lineBasicMaterial color={colors.hue.hex} transparent opacity={0.55 * colors.hue.alpha} />
      </lineSegments>
      <lineSegments geometry={vecGeo.geo} frustumCulled={false}>
        <lineBasicMaterial color={colors.accent.hex} transparent opacity={0.55 * colors.accent.alpha} />
      </lineSegments>
    </group>
  );
}

export function LomaVerseSim({
  className,
  reduced: reducedProp,
}: {
  className?: string;
  reduced?: boolean;
}) {
  const [wrap, setWrap] = useState<HTMLDivElement | null>(null);
  const [glOK] = useState(() => {
    try {
      const c = document.createElement("canvas");
      return !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      return false;
    }
  });
  const [visible, setVisible] = useState(true);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [resetKey, setResetKey] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [pinned, setPinned] = useState<number | null>(null);
  const [grabbing, setGrabbing] = useState(false);
  const [reduced] = useState(
    () =>
      typeof window !== "undefined" &&
      (reducedProp ??
        window.matchMedia("(prefers-reduced-motion: reduce)").matches),
  );
  const [data] = useState<{ bodies: BodyConfig[]; G: number }>(() => ({
    bodies: bodiesData.bodies.map((b) => ({
      ...b,
      position: b.position as [number, number, number],
      velocity: b.velocity as [number, number, number],
    })),
    G: bodiesData.G ?? 1,
  }));

  const staticMode = !glOK || reduced;
  const input = useRef<RigInput>({
    pointerX: 0,
    pointerY: 0,
    baseAzimuth: 0,
    baseElevation: BASE_ELEVATION,
    dragging: false,
  });
  const rigEl = useRef<HTMLDivElement | null>(null);
  const wake = useRef<(() => void) | null>(null);
  const speedNode = useRef<HTMLSpanElement | null>(null);
  const drag = useRef<{ x: number; y: number; moved: boolean } | null>(null);
  const hoverRef = useRef<number | null>(null);
  const shown = hovered ?? pinned;

  const readInput = useCallback(() => input.current, []);

  // The frameloop drops to demand when the sim is paused or the band scrolls
  // out of view, so pointer input has to wake it explicitly.
  const onRigReady = useCallback((invalidate: () => void) => {
    wake.current = invalidate;
  }, []);

  const onRigFrame = useCallback((state: RigPose) => {
    const node = rigEl.current;
    if (!node) return;
    node.setAttribute("data-az", state.azimuth.toFixed(2));
    node.setAttribute("data-el", state.elevation.toFixed(2));
  }, []);

  const onTrail = useCallback((count: number) => {
    const node = rigEl.current;
    if (node) node.setAttribute("data-trail-samples", String(count));
  }, []);

  const onSpeed = useCallback((text: string) => {
    const node = speedNode.current;
    if (node) node.textContent = text;
  }, []);

  const onInspect = useCallback((index: number | null) => {
    hoverRef.current = index;
    setHovered(index);
  }, []);

  useEffect(() => {
    if (staticMode) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setPinned(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [staticMode]);

  const colors = useMemo(() => {
    if (!wrap) return null;
    const cs = getComputedStyle(wrap);
    const base = swatch(
      cs.getPropertyValue("--ink-faint").trim() || "rgb(138, 148, 170)",
    );
    const read = (token: string) => {
      const value = cs.getPropertyValue(token).trim();
      return value ? swatch(value) : base;
    };
    return {
      hue: read("--hue"),
      accent: read("--wavelength"),
      ink: read("--ink"),
      faint: base,
      line: read("--line-strong"),
    };
  }, [wrap]);

  useEffect(() => {
    if (!wrap || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry?.isIntersecting ?? true),
      { threshold: 0 },
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, [wrap]);

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (staticMode) return;
      const node = event.currentTarget;
      const rect = node.getBoundingClientRect();
      const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
      const state = input.current;
      state.pointerX = nx;
      state.pointerY = ny;
      const active = drag.current;
      if (active) {
        const dx = event.clientX - active.x;
        const dy = event.clientY - active.y;
        if (!active.moved && (Math.abs(dx) > 2 || Math.abs(dy) > 2)) {
          active.moved = true;
          node.setPointerCapture(event.pointerId);
        }
        state.baseAzimuth += dx * DRAG_RATE;
        state.baseElevation = Math.min(
          Math.max(state.baseElevation + dy * DRAG_RATE, ELEVATION_MIN),
          ELEVATION_MAX,
        );
        active.x = event.clientX;
        active.y = event.clientY;
      }
      wake.current?.();
    },
    [staticMode],
  );

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (staticMode) return;
      drag.current = { x: event.clientX, y: event.clientY, moved: false };
      input.current.dragging = true;
      setGrabbing(true);
      wake.current?.();
    },
    [staticMode],
  );

  const onPointerUp = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      const active = drag.current;
      drag.current = null;
      input.current.dragging = false;
      setGrabbing(false);
      if (event.currentTarget.hasPointerCapture(event.pointerId))
        event.currentTarget.releasePointerCapture(event.pointerId);
      if (staticMode || !active || active.moved) return;
      const index = hoverRef.current;
      if (index === null) return;
      setPinned((current) => (current === index ? null : index));
    },
    [staticMode],
  );

  const body = shown === null ? null : data.bodies[shown];
  const initialSpeed = body
    ? Math.hypot(body.velocity[0], body.velocity[1], body.velocity[2])
    : 0;
  const inspectable = glOK && reduced;

  return (
    <div
      ref={setWrap}
      data-testid="lomaverse-sim"
      className={`flex flex-col ${className ?? ""}`}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-4 border-b border-line pb-3 font-mono text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <span data-testid="lomaverse-status" aria-live="polite" className="text-ink-soft">
            {staticMode ? (reduced ? "Static view · reduced motion" : "Static view · WebGL unavailable") : paused ? "Simulation paused" : "Simulation running"}
          </span>
          <span data-testid="lomaverse-integrator" className="text-ink-faint">
            VELOCITY-VERLET · {data.bodies.length} BODIES
          </span>
          {body && (
            <span
              data-testid="lomaverse-hover"
              className="tabular-nums text-ink"
            >
              {body.name.toUpperCase()} · M {body.mass} · |V|{" "}
              <span ref={speedNode}>{initialSpeed.toFixed(1)}</span>
            </span>
          )}
          {!staticMode && (
            <label className="flex items-center gap-2 text-ink-faint">
              Step rate ×{speed.toFixed(2)}
              <input
                data-testid="lomaverse-speed"
                type="range"
                min="0.25"
                max="2"
                step="0.25"
                value={speed}
                onChange={(event) => setSpeed(Number(event.currentTarget.value))}
                aria-label="Simulation step rate"
                className="w-24 accent-wavelength"
              />
            </label>
          )}
        </div>
        {!staticMode && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              data-testid="lomaverse-pause"
              onClick={() => setPaused((value) => !value)}
              className="border border-line-strong px-3 py-2 text-ink-soft transition-colors hover:border-wavelength hover:text-ink"
            >
              {paused ? "Resume" : "Pause"}
            </button>
            <button
              type="button"
              data-testid="lomaverse-reset"
              onClick={() => setResetKey((value) => value + 1)}
              className="border border-line-strong px-3 py-2 text-ink-soft transition-colors hover:border-wavelength hover:text-ink"
            >
              Reset
            </button>
          </div>
        )}
      </div>
      {staticMode || !colors ? (
        <div data-testid="lomaverse-fallback" className="w-full">
          <svg
            role="img"
            aria-label="Static LomaVerse initial conditions with orbital paths"
            viewBox="0 0 640 360"
            className="h-auto w-full"
          >
            {[130, 210, 290].map((radius) => (
              <ellipse
                key={radius}
                cx="88"
                cy="180"
                rx={radius}
                ry={radius * 0.38}
                fill="none"
                stroke="var(--line-strong)"
                strokeDasharray="4 7"
              />
            ))}
            {data.bodies.map((body, i) => (
              <g key={body.name}>
                <circle
                  data-body={body.name}
                  cx={88 + body.position[0] * 48}
                  cy={180 - body.position[2] * 48}
                  r={Math.max(4, body.radius * 32)}
                  fill={body.name === "Sun" ? "var(--wavelength)" : "var(--hue)"}
                  onPointerEnter={inspectable ? () => onInspect(i) : undefined}
                  onPointerLeave={inspectable ? () => onInspect(null) : undefined}
                />
                <title>{body.name} initial position</title>
              </g>
            ))}
            <text x="320" y="336" textAnchor="middle" fill="var(--ink-faint)" fontSize="11" fontFamily="var(--font-jetbrains-mono)">
              INITIAL CONDITIONS · {data.bodies.length} BODIES
            </text>
          </svg>
        </div>
      ) : (
        <div
          ref={rigEl}
          data-testid="lomaverse-rig"
          data-az="0.00"
          data-el={BASE_ELEVATION.toFixed(2)}
          data-trail-samples="0"
          aria-pressed={pinned !== null}
          onPointerMove={onPointerMove}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
          onPointerLeave={() => setHovered(null)}
          className={`relative min-h-[300px] flex-1 touch-pan-y ${grabbing ? "cursor-grabbing" : "cursor-grab"}`}
        >
          <div className="absolute inset-0">
            <Canvas
              dpr={[1, 1.5]}
              gl={{ antialias: false, powerPreference: "low-power" }}
              camera={{ position: [0, 5, 8], fov: 42 }}
              frameloop={visible && !paused ? "always" : "demand"}
              aria-label="N-body simulation of the LomaVerse system"
            >
              <Rig
                read={readInput}
                reduced={reduced}
                onFrame={onRigFrame}
                onReady={onRigReady}
              />

              <System
                bodies={data.bodies}
                G={data.G}
                colors={colors}
                reduced={reduced}
                paused={paused}
                speed={speed}
                resetKey={resetKey}
                onTrail={onTrail}
                onSpeed={onSpeed}
                onInspect={onInspect}
              />
            </Canvas>
          </div>
        </div>
      )}
    </div>
  );
}
