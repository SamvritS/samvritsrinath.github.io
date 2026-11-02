import { test, expect } from "@playwright/test";

test("archive cards stack in single-column cells", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto("/work");

  const cards = page.locator('a[href^="/work/"]');
  const count = await cards.count();
  expect(count).toBeGreaterThan(2);

  for (let i = 1; i < count; i++) {
    const card = cards.nth(i);
    const cover = card.locator("div").first();
    const textBox = await card.locator("div.flex.min-w-0.flex-col").boundingBox();
    const coverBox = await cover.boundingBox();
    expect(textBox?.width ?? 0).toBeGreaterThanOrEqual(300);
    if (textBox && coverBox) {
      expect(Math.abs(coverBox.width - textBox.width)).toBeLessThanOrEqual(4);
    }
  }

  const lead = cards.first();
  const leadCover = await lead.locator("div").first().boundingBox();
  const leadText = await lead.locator("div.flex.min-w-0.flex-col").boundingBox();
  expect(leadCover?.width ?? 0).toBeGreaterThanOrEqual(260);
  expect(leadCover?.width ?? 0).toBeLessThanOrEqual(480);
  expect(leadText?.width ?? 0).toBeGreaterThanOrEqual(320);

  const archiveSection = page.locator("div.grid.grid-cols-1");
  expect(await archiveSection.innerHTML()).not.toMatch(/truncate/);

  for (let i = 0; i < count; i++) {
    const tagline = cards.nth(i).locator("p").first();
    if (await tagline.count()) {
      const height = await tagline.evaluate((el) => {
        const cs = getComputedStyle(el);
        const line = parseFloat(cs.lineHeight);
        const h = (el as HTMLElement).getBoundingClientRect().height;
        return h / line;
      });
      expect(height).toBeLessThanOrEqual(4.5);
    }
  }
});

test("archive at mobile width is single column without overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/work");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
