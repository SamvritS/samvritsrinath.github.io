import { expect, test } from "@playwright/test";

const SRC = /assets(?:\/|%2F)profile(?:\/|%2F)profile-circle\.webp/;

test("the hero restores the portrait beside the copy", async ({
  page,
}) => {
  await page.goto("/");

  const portrait = page.getByTestId("hero-portrait").locator("img");
  await expect(portrait).toBeVisible();
  await expect(portrait).toHaveAttribute("src", SRC);
  await expect(portrait).toHaveAttribute("alt", "Portrait of Samvrit Srinath");

  const box = (await portrait.boundingBox())!;
  expect(Math.abs(box.width - box.height)).toBeLessThan(2);
  expect(box.width).toBeGreaterThan(240);

  await expect(page.getByTestId("network-constellation")).toHaveCount(0);
});

test("the portrait stays visible and usable on narrow screens", async ({
  page,
}) => {
  for (const width of [768, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");

    const portrait = page.getByTestId("hero-portrait").locator("img");
    await expect(portrait).toBeVisible();

    const box = (await portrait.boundingBox())!;
    expect(box.width).toBeGreaterThan(width === 320 ? 160 : 200);
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width + 1);
  }
});

test("about keeps its portrait and the homepage portrait has no layout shift", async ({
  page,
}) => {
  await page.goto("/");
  const layoutShift = await page.evaluate(async () => {
    let total = 0;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as PerformanceEntry[]) {
        const shift = entry as PerformanceEntry & {
          value: number;
          hadRecentInput: boolean;
        };
        if (!shift.hadRecentInput) total += shift.value;
      }
    });
    observer.observe({ type: "layout-shift", buffered: true });
    await new Promise((resolve) => setTimeout(resolve, 800));
    observer.disconnect();
    return total;
  });
  expect(layoutShift).toBeLessThan(0.1);

  await page.goto("/about");
  await expect(page.getByTestId("portrait").locator("img")).toBeVisible();
});
