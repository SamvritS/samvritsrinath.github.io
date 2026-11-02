import { existsSync, readFileSync } from "node:fs";
import { projects } from "../data/projects";
import { researchAreas } from "../data/research";

const root = new URL("..", import.meta.url).pathname;
const errors: string[] = [];
const local = (p: string) => p.startsWith("/") && !p.startsWith("//");

function checkFile(path: string, context: string) {
  if (!local(path)) return;
  const file = `${root}public${path}`;
  if (!existsSync(file)) errors.push(`missing file: ${path} (${context})`);
}

function imageSize(file: string): { w: number; h: number } | null {
  try {
    const buf = readFileSync(file);
    if (buf[0] === 0x89 && buf[1] === 0x50) {
      const w = buf.readUInt32BE(16);
      const h = buf.readUInt32BE(20);
      return { w, h };
    }
    if (buf[0] === 0xff && buf[1] === 0xd8) {
      let i = 2;
      while (i < buf.length) {
        if (buf[i] !== 0xff) break;
        const marker = buf[i + 1];
        const len = buf.readUInt16BE(i + 2);
        if (marker >= 0xc0 && marker <= 0xc3) {
          return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
        }
        i += 2 + len;
      }
      return null;
    }
    if (buf[0] === 0x52 && buf[1] === 0x49 && buf[8] === 0x57 && buf[9] === 0x45) {
      if (buf[12] === 0x56 && buf[13] === 0x50 && buf[14] === 0x38 && buf[15] === 0x20) {
        const w = buf.readUInt16LE(26) & 0x3fff;
        const h = buf.readUInt16LE(28) & 0x3fff;
        return { w, h };
      }
      return null;
    }
    return null;
  } catch {
    return null;
  }
}

for (const project of projects) {
  const where = `project ${project.slug}`;
  if (project.cover) {
    checkFile(project.cover, `${where} cover`);
    if (local(project.cover) && !project.coverFit) {
      const size = imageSize(`${root}public${project.cover}`);
      if (size && size.w / size.h > 2.4) {
        errors.push(
          `wide cover missing coverFit: ${project.cover} (${size.w}x${size.h}, ${where})`,
        );
      }
    }
  }
  if (project.paper?.href) checkFile(project.paper.href, `${where} paper`);
  for (const section of project.sections) {
    const figures =
      section.type === "figure"
        ? [section.figure]
        : section.type === "gallery"
          ? section.images
          : [];
    for (const figure of figures) {
      checkFile(figure.src, `${where} figure`);
      if (!figure.width || !figure.height) {
        errors.push(`missing intrinsic dimensions: ${figure.src} (${where})`);
      }
    }
    if (section.type === "paper") checkFile(section.paper.href, where);
  }
}

for (const area of researchAreas) {
  for (const paper of area.papers) {
    checkFile(paper.href, `research "${area.title}" paper "${paper.title}"`);
  }
}

// N-body simulation presets, the four validated configurations the LomaVerse case
// study documents. They seed the live simulation's own parameter set and are
// checked here for the same reason as any other committed data: a body missing
// mass or provenance would describe a run the case study does not make.
type PresetFile = {
  G: number;
  dt: number;
  stepsPerFrame: number;
  warmup: number;
  presets: {
    id: string;
    title: string;
    bodies: {
      name: string;
      mass: number;
      position: number[];
      velocity: number[];
      radius: number;
      trailColor: string;
      provenance: string;
    }[];
  }[];
};

const PRESET_IDS = ["solar", "binary", "chaos", "lagrange"];

try {
  const presetPath = `${root}public/assets/projects/lomaverse/presets.json`;
  const presets = JSON.parse(readFileSync(presetPath, "utf8")) as PresetFile;

  if (presets.presets.length !== PRESET_IDS.length) {
    errors.push(
      `LomaVerse presets: expected ${PRESET_IDS.length} entries, found ${presets.presets.length}`,
    );
  }
  for (const [i, id] of PRESET_IDS.entries()) {
    const preset = presets.presets[i];
    if (!preset) {
      errors.push(`LomaVerse presets: missing entry "${id}" at index ${i}`);
      continue;
    }
    if (preset.id !== id) {
      errors.push(
        `LomaVerse presets: index ${i} is "${preset.id}", expected "${id}" (the presets follow the case-study order)`,
      );
    }
    if (!preset.title) errors.push(`LomaVerse preset ${id}: empty title`);
    if (preset.bodies.length === 0) {
      errors.push(`LomaVerse preset ${id}: no bodies`);
    }
    for (const body of preset.bodies) {
      const where = `LomaVerse preset ${id}/${body.name ?? "unnamed"}`;
      if (typeof body.mass !== "number" || !Number.isFinite(body.mass)) {
        errors.push(`missing or non-finite mass: ${where}`);
      }
      if (!Array.isArray(body.position) || body.position.length !== 3) {
        errors.push(`position must be 3 numbers: ${where}`);
      }
      if (!Array.isArray(body.velocity) || body.velocity.length !== 3) {
        errors.push(`velocity must be 3 numbers: ${where}`);
      }
      for (const value of [...(body.position ?? []), ...(body.velocity ?? [])]) {
        if (!Number.isFinite(value)) {
          // NaN serialises to null in JSON, so this is the check that catches a
          // seed that was computed from a bad formula and quietly written out.
          errors.push(`non-finite seed component in ${where}`);
        }
      }
      if (!body.provenance || body.provenance.trim().length === 0) {
        errors.push(`missing provenance: ${where}`);
      }
    }
  }
  for (const [key, value] of [
    ["G", presets.G],
    ["dt", presets.dt],
    ["stepsPerFrame", presets.stepsPerFrame],
    ["warmup", presets.warmup],
  ] as const) {
    if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
      errors.push(`LomaVerse presets: ${key} must be a positive finite number`);
    }
  }
} catch {
  errors.push("unreadable LomaVerse presets: presets.json");
}

if (errors.length > 0) {
  for (const error of errors) console.error(`FAIL: ${error}`);
  process.exit(1);
}
console.log("OK: assets resolve");
