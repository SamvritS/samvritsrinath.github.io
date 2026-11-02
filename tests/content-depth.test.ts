import assert from "node:assert/strict";
import test from "node:test";
import { existsSync, readdirSync } from "node:fs";
import { projects } from "../data/projects";
import { BANNED_COPY } from "../lib/banned-copy";

const LABEL = /^[a-z0-9][a-z0-9 .+%()\/-]*$/;
const TRACEABLE: Record<string, string> = {
  "238M": "papers/OperatorLLMs_IMC25.pdf",
  "13.7K": "papers/OperatorLLMs_IMC25.pdf",
  "87.0%": "papers/OperatorLLMs_IMC25.pdf",
  "66%": "papers/OperatorLLMs_IMC25.pdf",
  "1.73s": "papers/OperatorLLMs_IMC25.pdf",
  "74.6%": "papers/SpecSplit.pdf",
  "1.73 tok/s": "papers/SpecSplit.pdf",
  "<10 KB": "papers/SpecSplit.pdf",
  "γ=1": "papers/SpecSplit.pdf",
  "1,849": "papers/OptFantasy.pdf",
  "0.03s": "papers/OptFantasy.pdf",
  "8": "papers/OptFantasy.pdf",
  "17": "papers/OptFantasy.pdf",
  "N-body": "code",
  AD: "code",
  "3D+2D": "figures",
  "4+": "code",
  "160": "projects/interview-site/HoneyLLM.pdf",
  "77.6%": "projects/interview-site/HoneyLLM.pdf",
  "6": "projects/interview-site/HoneyLLM.pdf",
  "5": "projects/interview-site/HoneyLLM.pdf",
  "9,000+": "papers/gov_traceroutes_paper.pdf",
  "11": "papers/gov_traceroutes_paper.pdf",
  RIPE: "code",
  ERSP: "repo claim",
  "Llama-8B": "projects/gpu-kernels/Paper.pdf",
  CUDA: "code",
  shared: "projects/gpu-kernels/Paper.pdf",
  TK: "projects/gpu-kernels/Paper.pdf",
  "552": "papers/CS1_LLM_Experience_Report__ITiCSE_2024_.pdf",
  "79%": "papers/CS1_LLM_Experience_Report__ITiCSE_2024_.pdf",
  "59%": "papers/CS1_LLM_Experience_Report__ITiCSE_2024_.pdf",
  "3": "papers/CS1_LLM_Experience_Report__ITiCSE_2024_.pdf",
  QA: "repo claim",
  CS1: "repo claim",
  decomp: "repo claim",
  "2025": "repo claim",
  "501(c)(3)": "repo claim",
  RBAC: "code",
  MongoDB: "code",
  "Next.js": "code",
  RN: "code",
  "iOS+": "code",
  Firebase: "code",
  "77%": "repo claim",
  "2": "repo claim",
  ED: "repo claim",
  ML: "repo claim",
  "10": "repo claim",
  PWA: "code",
  "CI/CD": "code",
  SQLite: "code",
  "85%+": "repo claim",
  BERT: "repo claim",
  "k-fold": "repo claim",
  "ACM AI": "repo claim",
};

const words = (s: string) => s.split(/\s+/).filter(Boolean).length;

for (const project of projects) {
  test(`${project.slug} carries honest identity fields`, () => {
    assert.ok(project.problem.length > 20, "problem is one precise sentence");
    assert.ok(
      project.contribution.length >= 2 && project.contribution.length <= 4,
      "2 to 4 contributions",
    );
    assert.ok(project.role.length > 3, "role is honestly scoped");
    assert.match(
      project.status,
      /^(published|research|coursework|client)$/,
    );
  });

  test(`${project.slug} meets the section depth table`, () => {
    const types = new Set(project.sections.map((s) => s.type));
    assert.ok(types.has("prose"), "every project explains in prose");
    if (project.featured) {
      assert.ok(types.has("visual"), "featured projects show the system");
      assert.ok(
        types.has("figure") ||
          types.has("gallery") ||
          project.slug === "ip-sage",
        "featured projects show evidence figures (ip-sage carries the scrub walkthrough instead; no figure assets exist for it)",
      );
      assert.ok(
        project.metrics.length >= 4,
        "featured projects report numbers in the header",
      );
      assert.ok(
        types.has("system") ||
          types.has("implementation") ||
          types.has("evidence"),
        "featured projects carry anatomy, decisions, or measurements",
      );
    } else {
      const extra = ["figure", "gallery", "visual", "paper", "metrics"].some(
        (t) => types.has(t as (typeof project.sections)[number]["type"]),
      );
      assert.ok(
        extra ||
          types.has("system") ||
          types.has("implementation") ||
          types.has("evidence"),
        "standard projects carry at least one section beyond prose",
      );
    }
    const proseWords = project.sections
      .filter((s) => s.type === "prose")
      .flatMap((s) => (s.type === "prose" ? s.body : []))
      .reduce((n, p) => n + words(p), 0);
    assert.ok(
      proseWords >= (project.featured ? 150 : 60),
      `prose depth: ${proseWords} words`,
    );
  });

  test(`${project.slug} metrics are mono-safe and traceable`, () => {
    for (const metric of project.metrics) {
      assert.ok(metric.value.length > 0, "metric value is non-empty");
      assert.match(metric.label, LABEL, `label is lowercase mono-safe: ${metric.label}`);
      const source = TRACEABLE[metric.value];
      assert.ok(source, `metric value is traceable: ${metric.value}`);
      if (source !== "code" && source !== "repo claim" && source !== "figures") {
        assert.ok(
          existsSync(`public/assets/${source}`),
          `trace source exists: ${source}`,
        );
      }
    }
  });

  test(`${project.slug} copy is clean and assets resolve`, () => {
    const text = JSON.stringify(project);
    assert.ok(!text.includes("—"), "no em dash in copy");
    assert.ok(!BANNED_COPY.test(text), "no banned copy word");
    for (const section of project.sections) {
      const figures =
        section.type === "figure"
          ? [section.figure]
          : section.type === "gallery"
            ? section.images
            : [];
      for (const figure of figures) {
        assert.ok(
          existsSync(`public${figure.src}`),
          `figure resolves: ${figure.src}`,
        );
        assert.ok(
          figure.width && figure.height,
          `figure has dimensions: ${figure.src}`,
        );
      }
    }
    if (project.cover) assert.ok(existsSync(`public${project.cover}`), "cover resolves");
    if (project.paper?.href.startsWith("/")) {
      assert.ok(existsSync(`public${project.paper.href}`), "paper resolves");
    }
  });
}

test("papers directory holds the traced sources", () => {
  const files = readdirSync("public/assets/papers");
  for (const name of [
    "OperatorLLMs_IMC25.pdf",
    "SpecSplit.pdf",
    "OptFantasy.pdf",
    "gov_traceroutes_paper.pdf",
  ]) {
    assert.ok(files.includes(name), `paper ships: ${name}`);
  }
});

