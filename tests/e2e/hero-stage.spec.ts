import { test, expect } from "@playwright/test";

const VIEWPORTS = [
  { width: 1440, height: 900 },
  { width: 1280, height: 720 },
  { width: 1024, height: 768 },
  { width: 768, height: 1024 },
  { width: 390, height: 844 },
  { width: 320, height: 700 },
];

for (const viewport of VIEWPORTS) {
  test(`hero fits ${viewport.width}x${viewport.height} without overflow`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await page.goto("/");

    for (const testid of ["hero-headline", "hero-support", "hero-proof"]) {
      await expect(page.getByTestId(testid)).toBeVisible();
    }
    await expect(page.getByTestId("hero-portrait").locator("img")).toBeVisible();
    await expect(page.getByTestId("network-constellation")).toHaveCount(0);

    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });

  if (viewport.width >= 1024) {
    test(`hero copy and the portrait stay clear of each other at ${viewport.width}px`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");

      const portrait = (await page
        .getByTestId("hero-portrait")
        .boundingBox())!;
      for (const testid of ["hero-headline", "hero-support", "hero-proof"]) {
        const box = (await page.getByTestId(testid).boundingBox())!;
        const intersects =
          box.x < portrait.x + portrait.width &&
          portrait.x < box.x + box.width &&
          box.y < portrait.y + portrait.height &&
          portrait.y < box.y + box.height;
        expect(intersects).toBe(false);
      }
    });
  }
}

test("hero exposes identity, proof, and the portrait", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("hero-eyebrow")).toBeVisible();
  await expect(page.getByTestId("hero-support")).toBeVisible();
  await expect(page.getByTestId("hero-proof")).toBeVisible();
  await expect(page.getByTestId("hero-portrait").locator("img")).toBeVisible();
  const hero = page.locator("section", {
    has: page.getByTestId("hero-headline"),
  });
  await expect(hero.getByTestId("product-stage")).toHaveCount(0);
  await expect(hero.getByTestId("network-constellation")).toHaveCount(0);
});
