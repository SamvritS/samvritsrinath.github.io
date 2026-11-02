import { test, expect } from "@playwright/test";

test("scroll system: lenis, progress, reveals, go-to-top", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("html.lenis, html.lenis-smooth").first()).toBeAttached();
  // Wait for the streamed sections before measuring the document height.
  // Reading at the load event can catch the document mid-reveal, where a jump
  // to the bottom lands nowhere and go-to-top never appears.
  await expect(page.locator("#contact")).toBeAttached();

  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.getByTestId("scroll-progress")).toBeVisible();
  await expect(page.getByTestId("go-to-top")).toBeVisible();

  const revealed = await page
    .getByTestId("reveal")
    .first()
    .evaluate((el) => getComputedStyle(el).opacity);
  expect(Number(revealed)).toBeGreaterThan(0.9);

  await page.getByTestId("go-to-top").click();
  // 15s, and poll rather than waitForFunction, for the same reason the
  // walkthrough test below does: go-to-top runs a smooth scroll through Lenis,
  // and a 5s budget was a race that failed once under full-suite load while
  // passing 3/3 in isolation. The assertion is unchanged, only how long it is
  // willing to wait for the scroll to finish.
  await expect
    .poll(() => page.evaluate(() => window.scrollY), { timeout: 15000 })
    .toBeLessThan(100);
});

test("pipeline walkthrough advances active step on scrub", async ({
  page,
}) => {
  await page.goto("/work/ip-sage");
  const walkthrough = page.getByTestId("walkthrough");
  await expect(walkthrough).toBeVisible();
  await walkthrough.scrollIntoViewIfNeeded();
  const first = await walkthrough
    .getByTestId("walkthrough-step-active")
    .innerText();
  await page.evaluate(() => window.scrollBy(0, 900));
  // Poll for the change instead of waiting a fixed span: Lenis animates the
  // scroll, so a fixed wait was a race that failed under full-suite load. The
  // assertion is unchanged, only how long it is willing to wait for it.
  await expect
    .poll(
      () => walkthrough.getByTestId("walkthrough-step-active").innerText(),
      { timeout: 5000 },
    )
    .not.toBe(first);
});

test("reduced motion leaves no constellation twinkle and settles the route fade", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".constellation-twinkle")).toHaveCount(0);

  await page.locator('header nav a[href="/work"]').first().click();
  const transition = page.getByTestId("route-transition");
  await expect(transition).toBeVisible();
  await expect
    .poll(() => transition.evaluate((node) => getComputedStyle(node).opacity))
    .toBe("1");
});

test("route transition settles at full opacity", async ({ page }) => {
  await page.goto("/");
  await page.locator('header nav a[href="/work"]').first().click();
  const transition = page.getByTestId("route-transition");
  await expect(transition).toBeVisible();
  await expect
    .poll(() => transition.evaluate((node) => getComputedStyle(node).opacity))
    .toBe("1");
});

test("hero title cycle pauses offscreen", async ({ page }) => {
  await page.goto("/");
  const line = page
    .getByTestId("hero-titles")
    .locator("span[aria-hidden]")
    .first();
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(600);
  const first = await line.innerText();
  await page.waitForTimeout(2400);
  expect(await line.innerText()).toBe(first);
});

test("reduced motion leaves the scroll progress unforced", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));
  await page.waitForTimeout(400);
  const scaleX = await page
    .getByTestId("scroll-progress")
    .evaluate((node) => {
      const transform = getComputedStyle(node).transform;
      const matrix = /^matrix\(([^,]+)/.exec(transform);
      return matrix ? Number(matrix[1]) : 1;
    });
  expect(scaleX).toBeGreaterThan(0);
  expect(scaleX).toBeLessThan(1);
});
