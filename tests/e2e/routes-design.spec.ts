import { expect, test } from "@playwright/test";

for (const route of ["/work", "/research", "/about", "/contact"]) {
  test(`${route} has one header and no overflow`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.getByTestId("page-header")).toBeVisible();
    await page.setViewportSize({ width: 320, height: 700 });
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    expect(overflow).toBeLessThanOrEqual(1);
  });
}

test("research is an archive with citable papers", async ({ page }) => {
  await page.goto("/research");
  await expect(page.getByTestId("research-entry")).toHaveCount(2);
  await expect(page.getByTestId("copy-button").first()).toBeVisible();
});
