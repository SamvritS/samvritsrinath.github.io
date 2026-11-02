import { test, expect } from "@playwright/test";

test("homepage shows identity with no product stage or canvas", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page.getByTestId("hero-headline")).toBeVisible();
  await expect(page.getByTestId("hero-portrait").locator("img")).toBeVisible();
  await expect(page.getByTestId("network-constellation")).toHaveCount(0);
  await expect(page.getByTestId("product-stage")).toHaveCount(0);
  await expect(page.locator("canvas")).toHaveCount(0);
});

test("case study opens with a product stage before its narrative", async ({
  page,
}) => {
  await page.goto("/work/ip-sage");

  const stage = page.getByTestId("product-stage").first();
  await expect(stage).toHaveAttribute("data-mode", "case-study");
  await expect(stage.getByTestId("product-stage-fallback")).toBeVisible();

  const stageTop = (await stage.boundingBox())?.y ?? Infinity;
  const proseTop =
    (await page.locator("[data-testid='visual-story'] p").first().boundingBox())
      ?.y ?? -Infinity;
  expect(stageTop).toBeLessThan(proseTop);
});

test("product stage fits a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["/work/specsplit", "/work/lomaverse"]) {
    await page.goto(route);
    await expect(page.getByTestId("product-stage").first()).toBeVisible();
    const dimensions = await page.evaluate(() => ({
      documentWidth: document.documentElement.scrollWidth,
      viewportWidth: document.documentElement.clientWidth,
    }));
    expect(dimensions.documentWidth).toBeLessThanOrEqual(dimensions.viewportWidth);
  }
});

test("archive leads with a double-width card", async ({ page }) => {
  await page.goto("/work");
  await expect(
    page.getByTestId("work-archive").getByTestId("reveal").first(),
  ).toHaveClass(/sm:col-span-2/);
});
