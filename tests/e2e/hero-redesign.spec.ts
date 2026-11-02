import { test, expect } from "@playwright/test";

test("hero is an observatory header with real CTAs", async ({
  page,
}) => {
  await page.goto("/");

  const headline = page.getByTestId("hero-headline");
  await expect(headline).toBeVisible();

  await expect(page.getByTestId("hero-portrait").locator("img")).toBeVisible();
  await expect(page.getByTestId("network-constellation")).toHaveCount(0);

  await expect(page.getByTestId("hero-view-work")).toContainText(
    "View work",
  );
  await expect(page.getByTestId("hero-contact")).toContainText("Get in touch");

  await page.getByTestId("hero-view-work").click();
  await expect(page).toHaveURL(/\/work/);

  await page.goto("/");
  const bodyText = await page.locator("main").innerText();
  expect(bodyText).not.toContain("view_payloads.sh");
  expect(bodyText).not.toContain("fetch_resume.pdf");
  expect(bodyText).not.toContain("SYS.STATUS");
  expect(bodyText).not.toContain("MISSION LOG");
});

test("homepage presents experience above the work showcase and keeps the playground separate", async ({
  page,
}) => {
  await page.goto("/");
  // Wait for the homepage sections to be attached before reading their order.
  await expect(page.locator("main > section").first()).toBeAttached();

  const sectionIds = await page.locator("main > section").evaluateAll((nodes) =>
    nodes.map((node) => node.id),
  );
  const order = [
    "experience",
    "skills",
    "work",
    "research",
    "education",
    "teaching",
    "clubs",
    "contact",
  ].map((id) => sectionIds.indexOf(id));

  expect(order.every((index) => index >= 0)).toBe(true);
  expect(order).toEqual([...order].sort((a, b) => a - b));
  await expect(page.getByTestId("playground")).toHaveCount(0);
  await expect(page.getByTestId("hero-headline")).toBeVisible();
  await expect(page.getByTestId("hero-view-work")).toBeVisible();
  await expect(page.getByTestId("hero-contact")).toBeVisible();
});
