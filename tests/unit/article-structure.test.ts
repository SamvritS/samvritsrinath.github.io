import assert from "node:assert/strict";
import test from "node:test";
import { projects } from "../../data/projects";

const MEDIA = new Set(["figure", "gallery", "visual"]);
const NUMERIC = /^[<>=~γ]?[\d.,]+[%+]?$/;

const words = (value: string) =>
  value.split(/\s+/).filter(Boolean).length;

for (const project of projects) {
  const prose = project.sections.filter((section) => section.type === "prose");
  const proseText = prose
    .flatMap((section) => (section.type === "prose" ? section.body : []))
    .join(" ");
  const proseWords = words(proseText);
  const media = project.sections.filter((section) => MEDIA.has(section.type));
  const galleries = project.sections.filter(
    (section) => section.type === "gallery",
  );
  const last = project.sections[project.sections.length - 1];

  test(`${project.slug} carries a full article`, () => {
    const minimum = project.featured
      ? 500
      : project.status === "client" || project.status === "coursework"
        ? 200
        : 300;
    assert.ok(
      proseWords >= minimum,
      `prose depth: ${proseWords} words, expected at least ${minimum}`,
    );
    assert.ok(prose.length >= 3, "at least three prose sections");
    assert.ok(
      !/Fig\.\s*\d/.test(proseText),
      "prose does not enumerate figure numbers",
    );
  });

  test(`${project.slug} interleaves evidence with the argument`, () => {
    assert.ok(
      galleries.every((section) => section.type !== "gallery" || section.images.length <= 2),
      "no gallery dumps more than two images",
    );
    assert.notEqual(last.type, "gallery", "the article does not end on an image dump");
    let run = 0;
    let longestRun = 0;
    for (const section of project.sections) {
      if (MEDIA.has(section.type)) {
        run += 1;
        longestRun = Math.max(longestRun, run);
      } else {
        run = 0;
      }
    }
    assert.ok(
      longestRun <= 2,
      `at most two consecutive media sections, found ${longestRun}`,
    );
    if (media.length >= 2) {
      const hasProseAfterMedia = project.sections.some(
        (section, index) =>
          MEDIA.has(section.type) &&
          project.sections[index + 1]?.type === "prose",
      );
      assert.ok(hasProseAfterMedia, "at least one figure is followed by prose");
    }
  });

  test(`${project.slug} does not repeat its headline metric in the narrative`, () => {
    const headline = project.metrics[0]?.value;
    if (!headline || !NUMERIC.test(headline)) return;
    const narrative = [
      proseText,
      ...project.sections.flatMap((section) =>
        section.type === "figure"
          ? [section.figure.caption]
          : section.type === "gallery"
            ? section.images.map((figure) => figure.caption)
            : [],
      ),
      ...project.sections.flatMap((section) =>
        section.type === "evidence"
          ? section.items.map((item) => item.result)
          : [],
      ),
    ].join(" ");
    const hits = narrative.match(
      new RegExp(headline.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"),
    );
    assert.ok(
      (hits?.length ?? 0) <= 1,
      `${headline} appears ${hits?.length ?? 0} times in prose, captions, and evidence`,
    );
  });
}
