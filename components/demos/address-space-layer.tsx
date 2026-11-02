"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { mulberry32 } from "@/components/visuals/primitives";
import { OWNERSHIP_STAGES } from "@/components/visuals/compositions/ownership-pipeline";

// ponytail: no canvas without the walkthrough on the page. The ray is driven
// by the walkthrough's active step, so without it the layer has no state to
// show. This also keeps the homepage at exactly one canvas.

const BANDS = [
  { seed: 7, z: 0, count: 420 },
  { seed: 71, z: -2, count: 320 },
  { seed: 711, z: -4, count: 240 },
];

const BOXES = [
  { x: -1.6, y: 0.5, w: 1.5, h: 1.1 },
  { x: 0.1, y: -0.5, w: 1.3, h: 1.3 },
  { x: -1.2, y: -1.3, w: 1.7, h: 0.8 },
];

const RAY_ORIGIN: [number, number, number] = [-3, -2, 0.6];

function slotX(i: number) {
  return -2.5 + i * 1.0;
}

function indexFromWalkthrough(root: Element | null): number {
  if (!root) return -1;
  const title = (
    root.querySelector('[data-testid="walkthrough-step-active"] h4')
      ?.textContent ?? ""
  )
    .trim()
    .toUpperCase();
  return OWNERSHIP_STAGES.findIndex((s) => s.label === title);
}

function DriftGroup({
  wrap,
  visible,
  children,
}: {
  wrap: HTMLDivElement | null;
  visible: React.RefObject<boolean>;
  children: React.ReactNode;
}) {
  const group = useRef<THREE.Group | null>(null);
  const invalidate = useThree((s) => s.invalidate);
  const drift = useRef(0);
  useFrame(() => {
    if (group.current) group.current.position.z = drift.current;
  });
  useEffect(() => {
    const onScroll = () => {
      if (!wrap) return;
      const r = wrap.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, 1 - r.top / window.innerHeight));
      drift.current = p * 0.3;
      if (visible.current) invalidate();
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [wrap, invalidate, visible]);
  return (
    <group
      ref={(g) => {
        group.current = g;
      }}
    >
      {children}
    </group>
  );
}

function Scene({
  wrap,
  hue,
  accent,
  faint,
  index,
  visible,
}: {
  wrap: HTMLDivElement | null;
  hue: string;
  accent: string;
  faint: string;
  index: number;
  visible: React.RefObject<boolean>;
}) {
  const bands = useMemo(
    () =>
      BANDS.map((b) => {
        const rand = mulberry32(b.seed);
        const arr = new Float32Array(b.count * 3);
        for (let i = 0; i < b.count; i++) {
          arr[i * 3] = -3 + rand() * 6;
          arr[i * 3 + 1] = -2 + rand() * 4;
          arr[i * 3 + 2] = b.z + (rand() - 0.5) * 0.6;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
        return geo;
      }),
    [],
  );
  const hulls = useMemo(
    () =>
      BOXES.map((b) => {
        const geo = new THREE.EdgesGeometry(
          new THREE.BoxGeometry(b.w, b.h, 0.2),
        );
        return { geo, x: b.x, y: b.y };
      }),
    [],
  );
  const ray = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(6), 3),
    );
    return geo;
  }, []);
  const invalidate = useThree((s) => s.invalidate);

  useEffect(() => {
    const attr = ray.getAttribute("position") as THREE.BufferAttribute;
    attr.setXYZ(0, ...RAY_ORIGIN);
    attr.setXYZ(1, slotX(Math.max(0, index)), 0.6, 0);
    attr.needsUpdate = true;
    invalidate();
  }, [ray, index, invalidate]);

  return (
    <DriftGroup wrap={wrap} visible={visible}>
      {bands.map((geo, i) => (
        <points key={i} geometry={geo} frustumCulled={false}>
          <pointsMaterial
            color={hue}
            size={0.035}
            sizeAttenuation
            transparent
            opacity={0.5}
          />
        </points>
      ))}
      {hulls.map((h, i) => (
        <lineSegments
          key={i}
          geometry={h.geo}
          position={[h.x, h.y, -1]}
          frustumCulled={false}
        >
          <lineBasicMaterial color={faint} transparent opacity={0.5} />
        </lineSegments>
      ))}
      <lineSegments geometry={ray} frustumCulled={false}>
        <lineBasicMaterial color={accent} transparent opacity={0.8} />
      </lineSegments>
    </DriftGroup>
  );
}

export function AddressSpaceLayer() {
  const [wrap, setWrap] = useState<HTMLDivElement | null>(null);
  const [glOK] = useState(() => {
    try {
      const c = document.createElement("canvas");
      return !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      return false;
    }
  });
  const [reduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [hasWalkthrough] = useState(
    () => typeof document !== "undefined" && !!document.querySelector('[data-testid="walkthrough"]'),
  );
  const [index, setIndex] = useState(0);
  const visible = useRef(true);

  const colors = useMemo(() => {
    if (!wrap) return null;
    const cs = getComputedStyle(wrap);
    return {
      hue: cs.getPropertyValue("--hue").trim() || "gray",
      accent: cs.getPropertyValue("--accent").trim() || "gray",
      faint: cs.getPropertyValue("--ink-faint").trim() || "gray",
    };
  }, [wrap]);

  useEffect(() => {
    if (reduced || !hasWalkthrough) return;
    const root = document.querySelector('[data-testid="walkthrough"]');
    const read = () => {
      const i = indexFromWalkthrough(root);
      if (i >= 0) setIndex((prev) => (prev === i ? prev : i));
    };
    read();
    const mo = new MutationObserver(read);
    if (root) mo.observe(root, { attributes: true, childList: true, subtree: true });
    return () => mo.disconnect();
  }, [reduced, hasWalkthrough]);

  useEffect(() => {
    if (!wrap || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry?.isIntersecting ?? true;
      },
      { threshold: 0 },
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, [wrap]);

  const live = glOK && !reduced && hasWalkthrough && !!colors;

  return (
    <div
      ref={setWrap}
      data-testid="address-space-layer"
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10"
    >
      {live && colors && (
        <>
          <Canvas
            dpr={[1, 1.5]}
            gl={{ antialias: false, powerPreference: "low-power" }}
            camera={{ position: [0, 0, 6], fov: 40 }}
            frameloop="demand"
          >
            <Scene
              wrap={wrap}
              hue={colors.hue}
              accent={colors.accent}
              faint={colors.faint}
              index={index}
              visible={visible}
            />
          </Canvas>
          <div data-testid="ip-sage-scene-marker" className="sr-only" />
        </>
      )}
    </div>
  );
}
