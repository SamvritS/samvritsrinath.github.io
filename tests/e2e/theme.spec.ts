import { expect, test } from "@playwright/test";

test("stored theme outranks the system preference", async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem("theme", "light"));
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/", { waitUntil: "commit" });
  await expect(page.locator("html")).not.toHaveClass(/(^|\s)dark(\s|$)/);
});

test("system preference applies with no stored theme", async ({ page }) => {
  await page.addInitScript(() => localStorage.removeItem("theme"));
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/", { waitUntil: "commit" });
  await expect(page.locator("html")).toHaveClass(/(^|\s)dark(\s|$)/);
});

test("light system preference gives the warm paper surface", async ({
  page,
}) => {
  await page.addInitScript(() => localStorage.removeItem("theme"));
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  await expect(page.locator("html")).not.toHaveClass(/(^|\s)dark(\s|$)/);
  const bg = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor,
  );
  expect(bg).not.toBe("rgb(255, 255, 255)");
});

test("the theme toggle persists without a density control", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: /density|minimal mode|full mode/i }),
  ).toHaveCount(0);

  const toggle = page.getByRole("button", { name: /toggle theme/i }).first();
  await toggle.click();
  const stored = await page.evaluate(() => localStorage.getItem("theme"));
  expect(["dark", "light"]).toContain(stored);
});
