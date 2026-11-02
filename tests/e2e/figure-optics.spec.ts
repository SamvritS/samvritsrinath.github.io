import { test, expect } from "@playwright/test";

const INTRINSIC = { w: 885, h: 768 };

test("figure thumbnail frame matches intrinsic aspect ratio", async ({
  page,
}) => {
  await page.goto("/work/specsplit");
  const thumb = page.getByTestId("figure-thumb").first();
  await expect(thumb).toBeVisible();
  const box = (await thumb.boundingBox())!;
  const rendered = box.width / box.height;
  const intrinsic = INTRINSIC.w / INTRINSIC.h;
  expect(Math.abs(rendered - intrinsic) / intrinsic).toBeLessThan(0.02);
});

test("figure lightbox is contained, proportioned, and dismissible", async ({
  page,
}) => {
  await page.goto("/work/specsplit");
  const trigger = page.getByTestId("figure-thumb").first();
  const thumbImg = trigger.locator("img");
  const thumbBox = (await thumbImg.boundingBox())!;
  await expect(trigger).toBeVisible();
  await trigger.click();

  const dialog = page.getByTestId("figure-lightbox");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute("role", "dialog");
  await expect(dialog).toHaveAttribute("aria-modal", "true");

  const img = dialog.locator("img");
  await expect(img).toBeVisible();
  const box = (await img.boundingBox())!;
  const vp = page.viewportSize()!;
  const rendered = box.width / box.height;
  const intrinsic = INTRINSIC.w / INTRINSIC.h;
  expect(Math.abs(rendered - intrinsic) / intrinsic).toBeLessThan(0.02);
  expect(box.width).toBeLessThanOrEqual(vp.width * 0.94);
  expect(box.width).toBeGreaterThanOrEqual(thumbBox.width);

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("chart figures never use object-fit cover", async ({ page }) => {
  await page.goto("/work/specsplit");
  const thumbImg = page.getByTestId("figure-thumb").first().locator("img");
  const fit = await thumbImg.evaluate((el) =>
    getComputedStyle(el).getPropertyValue("object-fit"),
  );
  expect(fit.trim()).not.toBe("cover");
});
