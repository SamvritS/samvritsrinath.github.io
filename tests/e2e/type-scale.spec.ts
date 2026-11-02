import { test, expect } from "@playwright/test";

async function proseSizes(
  page: import("@playwright/test").Page,
  selector: string,
) {
  return page.locator(selector).evaluateAll((els) =>
    els.map((el) => {
      const cs = getComputedStyle(el);
      const r = (el as HTMLElement).getBoundingClientRect();
      return {
        size: parseFloat(cs.fontSize),
        width: r.width,
      };
    }),
  );
}

test("reading prose is 17px or larger on mobile with capped measure", async ({
  page,
}) => {
  // Generous only in the waiting: the whole test exceeded 30s under
  // full-suite load while navigating, never on a comparison. No assertion
  // changed.
  test.slow();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/work/ip-sage");
  const story = await proseSizes(page, ".read");
  expect(story.length).toBeGreaterThan(0);
  for (const s of story) {
    expect(s.size).toBeGreaterThanOrEqual(17);
    expect(s.width).toBeLessThanOrEqual(68 * s.size);
  }

  await page.goto("/");
  // Wait for the streamed sections to attach before measuring type. Reading at
  // the load event can catch an empty <main> while the client runtime reveals
  // the document, which reports zero prose rows as a type failure.
  await expect(page.locator("#experience li.read").first()).toBeAttached();
  for (const sel of ["#experience li.read", "#teaching li.read", "#research .read"]) {
    const rows = await proseSizes(page, sel);
    expect(rows.length).toBeGreaterThan(0);
    for (const s of rows) {
      expect(s.size).toBeGreaterThanOrEqual(17);
      expect(s.width).toBeLessThanOrEqual(68 * s.size);
    }
  }
});

test("reading prose is 18px or larger on desktop with capped measure", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/work/ip-sage");
  const story = await proseSizes(page, ".read");
  expect(story.length).toBeGreaterThan(0);
  for (const s of story) {
    expect(s.size).toBeGreaterThanOrEqual(18);
    expect(s.width).toBeLessThanOrEqual(68 * s.size);
  }

  await page.goto("/");
  // Wait for the streamed sections to attach before measuring type. Reading at
  // the load event can catch an empty <main> while the client runtime reveals
  // the document, which reports zero prose rows as a type failure.
  await expect(page.locator("#experience li.read").first()).toBeAttached();
  for (const sel of ["#experience li.read", "#teaching li.read", "#research .read"]) {
    const rows = await proseSizes(page, sel);
    expect(rows.length).toBeGreaterThan(0);
    for (const s of rows) {
      expect(s.size).toBeGreaterThanOrEqual(18);
      expect(s.width).toBeLessThanOrEqual(68 * s.size);
    }
  }
});
