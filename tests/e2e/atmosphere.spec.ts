import { expect, test } from "@playwright/test";

const variants = ["hero", "experience", "work", "research", "contact"];

test("atmospheric fields are decorative and never take a pointer", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByTestId("ambient-field")).toHaveCount(variants.length);

  for (const variant of variants) {
    const field = page.locator(
      `[data-testid="ambient-field"][data-variant="${variant}"]`,
    );
    await expect(field).toHaveCount(1);
    await expect(field).toHaveAttribute("aria-hidden", "true");

    const styles = await field.evaluate((node) => {
      const computed = getComputedStyle(node);
      return {
        pointerEvents: computed.pointerEvents,
        position: computed.position,
        top: computed.top,
      };
    });

    expect(styles.pointerEvents).toBe("none");
    expect(styles.position).toBe("absolute");
    expect(styles.top).toBe("0px");
  }
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

test("reduced motion removes the atmosphere drift and register draw", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  const animation = await page
    .locator(".atmosphere-hero .atmosphere-field")
    .evaluate((node) => getComputedStyle(node).animationName);
  expect(animation).toBe("none");

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
