import { test, expect } from "@playwright/test";

test("playground demo renders and stays performant", async ({ page }) => {
  await page.goto("/playground");
  const demo = page.getByTestId("playground");
  await expect(demo).toBeVisible();

  const canvasCount = await demo.locator("canvas, svg").count();
  expect(canvasCount).toBeGreaterThanOrEqual(1);

  const fps = await page.evaluate(
    () =>
      new Promise<number>((resolve) => {
        let frames = 0;
        const start = performance.now();
        const tick = () => {
          frames += 1;
          if (performance.now() - start < 1000) requestAnimationFrame(tick);
          else resolve(frames);
        };
        requestAnimationFrame(tick);
      }),
  );
  expect(fps).toBeGreaterThan(24);
});

test("playground remains discoverable from the footer", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("footer-playground")).toHaveAttribute(
    "href",
    "/playground",
  );
});
