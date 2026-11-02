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

test("the site atmosphere is a fixed, decorative CSS stage", async ({
  page,
}) => {
  await page.goto("/");
  const site = page.getByTestId("site-atmosphere");
  await expect(site).toHaveCount(1);
  await expect(site).toHaveAttribute("aria-hidden", "true");
  await expect(site.locator('[data-variant="ambient"]')).toHaveCount(1);
  await expect(
    site.locator('[data-testid="atmosphere-particles"]'),
  ).toHaveCount(1);
  await expect(site.locator('[data-testid="atmosphere-dots"]')).toHaveCount(1);
  await expect(site.locator('[data-testid="atmosphere-frame"]')).toHaveCount(0);
  await expect(page.locator("canvas")).toHaveCount(0);

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

test("no streak or margin frame decorations remain on the homepage", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("/");
  await expect(
    page.locator(
      '[data-testid="atmosphere-contour"], [data-testid="harmonic-register"], [data-testid="atmosphere-frame"], .harmonic-line, .signal-trace-path, .ds-frame, .ds-atmosphere-grid',
    ),
  ).toHaveCount(0);
});

test("reduced motion stops the ambient wash and particles", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const state = await page.evaluate(() => {
    const mesh = document.querySelector(".ds-atmosphere-mesh");
    const field = document.querySelector(
      ".ds-atmosphere-article .ds-atmosphere-field",
    );
    const particles = document.querySelector(".ds-atmosphere-particle-layer");
    return {
      mesh: mesh ? getComputedStyle(mesh, "::before").animationName : null,
      field: field ? getComputedStyle(field, "::before").animationName : null,
      particles: particles ? getComputedStyle(particles).animationName : null,
    };
  });
  expect(state.mesh).toBe("none");
  expect(state.field).toBe("none");
  expect(state.particles).toBe("none");
});

test("the ambient wash pauses while the document is hidden", async ({
  page,
}) => {
  await page.goto("/");
  const playState = await page.evaluate(() => {
    const ambient = document.querySelector('[data-variant="ambient"]');
    if (!ambient) return null;
    (ambient as HTMLElement).dataset.hidden = "true";
    const mesh = document.querySelector(".ds-atmosphere-mesh");
    return mesh ? getComputedStyle(mesh, "::before").animationPlayState : null;
  });
  expect(playState).toBe("paused");
});
