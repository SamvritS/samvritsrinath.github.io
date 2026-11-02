import { expect, test } from "@playwright/test";

const widths = [1440, 1280, 1024, 768, 390, 320];
const themes = ["dark", "light"] as const;

test("the homepage holds its shape at every supported width and theme", async ({
  page,
}) => {
  for (const theme of themes) {
    await page.emulateMedia({ colorScheme: theme });

    for (const width of widths) {
      await test.step(`${theme} ${width}px`, async () => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto("/");
        await expect(page.getByTestId("hero-headline")).toBeVisible();
        await expect(page.getByTestId("hero-portrait")).toBeVisible();

        const overflow = await page.evaluate(
          () =>
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth,
        );
        expect(overflow).toBeLessThanOrEqual(1);

        const navOverflow = await page
          .locator("header nav")
          .evaluate((node) => node.scrollWidth - node.clientWidth);
        expect(navOverflow).toBeLessThanOrEqual(1);

        const portrait = (await page
          .getByTestId("hero-portrait")
          .boundingBox())!;
        expect(portrait.x).toBeGreaterThanOrEqual(0);
        expect(portrait.x + portrait.width).toBeLessThanOrEqual(width + 1);

        const hero = page.locator("#hero");
        await expect(
          hero.getByTestId("hero-view-work"),
        ).toBeVisible();
        await expect(hero.getByTestId("hero-contact")).toBeVisible();
        await expect(
          hero.getByRole("link", { name: /Résumé/ }),
        ).toBeVisible();
      });
    }
  }
});

test("experience keeps the date rail and readable content at tablet widths", async ({
  page,
}) => {
  for (const width of [1280, 1024, 768]) {
    await test.step(`${width}px`, async () => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto("/");
      await expect(page.locator("#experience")).toBeAttached();

      const company = page.getByTestId("experience-company").first();
      const article = (await company.boundingBox())!;
      const role = company.getByTestId("experience-role").first();
      const date = (await role.getByTestId("experience-date").boundingBox())!;
      const content = (await role
        .getByTestId("experience-content")
        .boundingBox())!;

      expect(date.width).toBeGreaterThanOrEqual(176);
      expect(date.width).toBeLessThanOrEqual(184);
      expect(content.width).toBeGreaterThan(article.width * 0.55);
    });
  }
});

test("keyboard focus shows the accent ring", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/");

  const toggle = page.getByRole("button", { name: "Toggle theme" }).first();
  await toggle.focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Shift+Tab");

  const styles = await toggle.evaluate((node) => {
    const computed = getComputedStyle(node);
    return {
      visible: node.matches(":focus-visible"),
      style: computed.outlineStyle,
      width: computed.outlineWidth,
    };
  });

  expect(styles.visible).toBe(true);
  expect(styles.style).not.toBe("none");
  expect(Number.parseFloat(styles.width)).toBeGreaterThan(0);
});
