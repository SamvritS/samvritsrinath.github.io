import { expect, test } from "@playwright/test";

test("experience uses a 180px date rail and the full content width", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator("#experience")).toBeAttached();

  const company = page.getByTestId("experience-company").first();
  const article = (await company.boundingBox())!;
  const roles = company.getByTestId("experience-role");
  const count = await roles.count();
  expect(count).toBeGreaterThan(0);

  const contentLefts: number[] = [];

  for (let i = 0; i < count; i += 1) {
    const role = roles.nth(i);
    const date = (await role.getByTestId("experience-date").boundingBox())!;
    const content = (await role
      .getByTestId("experience-content")
      .boundingBox())!;

    expect(date.width).toBeGreaterThanOrEqual(176);
    expect(date.width).toBeLessThanOrEqual(184);
    expect(content.x - date.x).toBeGreaterThanOrEqual(190);
    expect(content.width).toBeGreaterThan(article.width * 0.6);
    contentLefts.push(content.x);
  }

  expect(Math.max(...contentLefts) - Math.min(...contentLefts)).toBeLessThan(2);
});

test("experience stacks cleanly on mobile without clipping", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.goto("/");
  await expect(page.locator("#experience")).toBeAttached();

  const company = page.getByTestId("experience-company").first();
  const article = (await company.boundingBox())!;
  const role = company.getByTestId("experience-role").first();
  const date = (await role.getByTestId("experience-date").boundingBox())!;
  const content = (await role.getByTestId("experience-content").boundingBox())!;

  expect(date.y).toBeLessThan(content.y);
  expect(content.x).toBeGreaterThanOrEqual(article.x - 1);
  expect(content.width).toBeGreaterThan(article.width * 0.9);

  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
