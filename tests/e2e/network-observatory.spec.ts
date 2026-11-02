import { expect, test } from "@playwright/test";

test("homepage reads as evidence, not a card grid", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#experience")).toBeAttached();

  const ids = await page.locator("main > section").evaluateAll((nodes) =>
    nodes.map((n) => n.id),
  );
  expect(ids).toEqual([
    "hero",
    "experience",
    "skills",
    "work",
    "research",
    "education",
    "teaching",
    "clubs",
    "contact",
  ]);

  await expect(page.getByTestId("hero-portrait").locator("img")).toBeVisible();
  await expect(page.getByTestId("network-constellation")).toHaveCount(0);
  await expect(page.getByTestId("work-lead")).toBeVisible();
  await expect(page.getByTestId("work-lead")).toContainText("IP-Sage");
  await expect(page.getByTestId("work-lead")).toContainText("87.0%");
  await expect(page.getByTestId("work-ledger").locator("article")).toHaveCount(4);
  await expect(page.getByTestId("research-entry")).toHaveCount(2);
  await expect(page.getByTestId("skill-group")).toHaveCount(4);

  await expect(page.getByTestId("transit-track")).toHaveCount(0);
  await expect(page.getByTestId("observatory-band")).toHaveCount(0);
  await expect(page.locator("canvas")).toHaveCount(0);
});

test("homepage has no overflow at 320px", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});

test("homepage uses three signal dividers", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("section-divider")).toHaveCount(3);
});

test("contact closes the path and the portrait anchors hero and about", async ({
  page,
}) => {
  await page.goto("/");
  const contact = page.locator("#contact");
  await expect(contact).toContainText("Open to industry work");
  await expect(
    contact.getByRole("link", { name: /email|say hello/i }),
  ).toBeVisible();
  await expect(page.getByTestId("hero-portrait").locator("img")).toBeVisible();

  await page.goto("/about");
  const portrait = page.getByTestId("portrait").locator("img");
  await expect(portrait).toBeVisible();
  const box = (await portrait.boundingBox())!;
  expect(Math.abs(box.width - box.height)).toBeLessThan(2);
});
