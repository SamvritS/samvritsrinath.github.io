import { expect, test } from "@playwright/test";

test("section atmospheres are decorative and never take a pointer", async ({
  page,
}) => {
  await page.goto("/");
  const fields = page.locator(
    '[data-testid="atmosphere"][data-variant]:not([data-variant="ambient"])',
  );
  await expect(fields).toHaveCount(5);

  const rows = await fields.evaluateAll((nodes) =>
    nodes.map((node) => {
      const computed = getComputedStyle(node);
      return {
        variant: node.getAttribute("data-variant"),
        hidden: node.getAttribute("aria-hidden"),
        pointerEvents: computed.pointerEvents,
        position: computed.position,
        top: computed.top,
      };
    }),
  );

  expect(rows.map((row) => row.variant).sort()).toEqual([
    "article",
    "article",
    "article",
    "footer",
    "hero",
  ]);
  expect(
    rows.every(
      (row) =>
        row.hidden === "true" &&
        row.pointerEvents === "none" &&
        row.position === "absolute" &&
        row.top === "0px",
    ),
  ).toBe(true);
});

test("the site atmosphere is a fixed, decorative particle field", async ({
  page,
}) => {
  await page.goto("/");
  const site = page.getByTestId("site-atmosphere");
  await expect(site).toHaveCount(1);
  await expect(site).toHaveAttribute("aria-hidden", "true");
  await expect(site.locator('[data-variant="ambient"]')).toHaveCount(1);
  await expect(site.locator('[data-testid="atmosphere-particles"]')).toHaveCount(1);

  const styles = await site.evaluate((node) => {
    const computed = getComputedStyle(node);
    return {
      pointerEvents: computed.pointerEvents,
      position: computed.position,
      zIndex: computed.zIndex,
    };
  });
  expect(styles.pointerEvents).toBe("none");
  expect(styles.position).toBe("fixed");
  expect(styles.zIndex).toBe("0");
});

test("section headings remain the topmost hit target", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("main > section")).toHaveCount(9);

  for (const id of ["experience", "work", "research", "contact"]) {
    const heading = page.locator(`#${id} h2`).first();
    await heading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(120);
    const box = (await heading.boundingBox())!;
    const tag = await page.evaluate(
      ({ x, y }) => document.elementFromPoint(x, y)?.tagName ?? null,
      { x: box.x + box.width / 2, y: box.y + box.height / 2 },
    );
    expect(tag).not.toBeNull();
  }
});

test("harmonic registers are decorative and share one vocabulary", async ({
  page,
}) => {
  await page.goto("/");

  const rows = await page.getByTestId("harmonic-register").evaluateAll(
    (nodes) =>
      nodes.map((node) => ({
        variant: node.getAttribute("data-variant"),
        hidden: node.getAttribute("aria-hidden"),
        pointerEvents: getComputedStyle(node).pointerEvents,
      })),
  );

  expect(rows).toHaveLength(5);
  expect(rows.map((row) => row.variant).sort()).toEqual([
    "converge",
    "seam",
    "seam",
    "spectral",
    "spectral",
  ]);
  expect(
    rows.every(
      (row) => row.hidden === "true" && row.pointerEvents === "none",
    ),
  ).toBe(true);
});

test("reduced motion stops the atmosphere drift and particle layer", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const animations = await page.evaluate(() => {
    const contour = document.querySelector(
      ".ds-atmosphere-hero .ds-atmosphere-contour-layer--a",
    );
    const field = document.querySelector(
      ".ds-atmosphere-article .ds-atmosphere-field",
    );
    const particles = document.querySelector(".ds-atmosphere-particle-layer");
    return {
      contour: contour ? getComputedStyle(contour).animationName : null,
      field: field ? getComputedStyle(field, "::before").animationName : null,
      particles: particles ? getComputedStyle(particles).animationName : null,
    };
  });
  expect(animations.contour).toBe("none");
  expect(animations.field).toBe("none");
  expect(animations.particles).toBe("none");

  const line = await page
    .locator(".harmonic-line")
    .first()
    .evaluate((node) => getComputedStyle(node).animationName);
  expect(line).toBe("none");
});

test("contact closes with a decorative signal path", async ({ page }) => {
  await page.goto("/");
  const trace = page.locator("#contact path.signal-trace-path").first();
  await expect(trace).toHaveCount(1);
  const svg = trace.locator("xpath=..");
  await expect(svg).toHaveAttribute("aria-hidden", "true");
});
