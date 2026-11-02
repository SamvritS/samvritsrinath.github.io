import { test, expect } from "@playwright/test";

const ROUTES = [
  "/work/ip-sage",
  "/work/specsplit",
  "/work/honeyllm",
  "/work/lomaverse",
];

for (const route of ROUTES) {
  test(`visual-story on ${route} renders no empty sections`, async ({
    page,
  }) => {
    await page.goto(route);
    const story = page.getByTestId("visual-story");
    await expect(story).toBeVisible();
    const children = story.locator(":scope > *");
    expect(await children.count()).toBeGreaterThan(0);
    for (let i = 0; i < (await children.count()); i++) {
      await expect(children.nth(i)).toBeVisible();
    }
  });

  test(`visual-story on ${route} never repeats a section heading`, async ({
    page,
  }) => {
    await page.goto(route);
    const headings = await page
      .getByTestId("visual-story")
      .locator("h1, h2, h3")
      .evaluateAll((nodes) => nodes.map((n) => n.textContent?.trim()));
    expect(headings.length).toBeGreaterThan(0);
    expect(new Set(headings).size).toBe(headings.length);
  });
}

test("figure numbers run sequentially without duplicates", async ({
  page,
}) => {
  await page.goto("/work/lomaverse");
  const labels = await page
    .getByTestId("visual-story")
    .locator("text=/^Fig\\. \\d+$/")
    .evaluateAll((nodes) => nodes.map((n) => n.textContent?.trim()));
  expect(labels.length).toBeGreaterThan(1);
  const numbers = labels.map((l) => Number(l?.replace("Fig. ", "")));
  expect([...numbers].sort((a, b) => a - b)).toEqual(numbers);
  expect(new Set(numbers).size).toBe(numbers.length);
  expect(numbers[0]).toBe(1);
});

test("visual-story headings sit directly under the page title", async ({
  page,
}) => {
  await page.goto("/work/specsplit");
  const first = page.getByTestId("visual-story").locator("h1, h2, h3").first();
  await expect(first).toBeVisible();
  expect(await first.evaluate((el) => el.tagName)).toBe("H2");
});
