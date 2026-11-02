import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { glyphFor } from "../../components/tech-icon";
import { GLYPHS } from "../../components/tech-icon-glyphs";
import { skills } from "../../data/education";

// react-icons served a 5.2 MB index module to the dev server for 33 marks, and the
// parse was the largest single long task on the homepage. The glyphs are local now,
// so this owns the two ways the swap could quietly lose something: a name that no
// longer resolves, and a path that was truncated in the extraction.
const PREVIOUSLY_ICONED = [
  "React", "Next.js", "TypeScript", "JavaScript", "Firebase", "MongoDB", "Go",
  "Python", "C++", "C", "Linux", "Docker", "gRPC", "Java", "JSP", "SQL",
  "Playwright", "GCP", "BigQuery", "PyTorch", "TensorFlow", "Scikit-learn",
  "Pandas", "NumPy", "Electron", "SQLite", "OpenAI", "Claude", "Hugging Face",
  "ARM", "NVIDIA", "PostgreSQL", "Supabase", "Vercel", "Threejs", "Flask",
  "CUDA", "Llama", "gdb", "GDB", "Valgrind", "Gurobi", "RIPE Atlas API", "Prisma",
  "Git", "Postman",
];

// These have no licensed brand mark in the local set. The Skills rail renders
// their labels without an icon rather than substituting another brand.
const TEXT_ONLY = new Set<string>(["LLMs", "ThunderKittens"]);

test("every skill the icon map used to answer still resolves", () => {
  for (const name of PREVIOUSLY_ICONED) {
    const glyph = glyphFor(name);
    assert.ok(glyph, `${name} lost its glyph in the swap`);
    assert.match(
      glyph.path,
      /^[Mm] ?-?[\d.]/,
      `${name} does not start with a move command, so the extraction was truncated`,
    );
    assert.ok(
      /^-?\d+(\.\d+)? -?\d+(\.\d+)? \d+(\.\d+)? \d+(\.\d+)?$/.test(glyph.viewBox),
      `${name} has a malformed viewBox`,
    );
  }
});

test("an unknown skill renders nothing rather than a placeholder", () => {
  assert.equal(glyphFor("Not A Technology"), undefined);
});

test("every skill is iconed or explicitly text-only", () => {
  const items = skills.flatMap((group) => group.items);
  assert.ok(items.length > 20, "the skills rail is empty, so this test means nothing");
  for (const item of items) {
    if (TEXT_ONLY.has(item)) {
      assert.equal(
        glyphFor(item),
        undefined,
        `${item} is text-only but resolves a glyph`,
      );
    } else {
      assert.ok(
        glyphFor(item),
        `${item} has no glyph and is not in the text-only allowlist`,
      );
    }
  }
  const known = new Set<string>(items);
  const extras = [...TEXT_ONLY].filter((item) => !known.has(item));
  assert.deepEqual(
    extras,
    [],
    `text-only allowlist has unknown skills: ${extras.join(", ")}`,
  );
});

test("no glyph is dead weight in the sheet", () => {
  const source = readFileSync("components/tech-icon.tsx", "utf8");
  const orphans = Object.keys(GLYPHS).filter((key) => !source.includes(`"${key}"`));
  assert.deepEqual(orphans, [], `glyphs no name maps to: ${orphans.join(", ")}`);
});
