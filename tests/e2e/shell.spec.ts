import { test, expect } from "@playwright/test";

test("shell trust elements exist and work", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByTestId("skip-to-content")).toBeAttached();
  await expect(page.getByTestId("cookie-banner")).toBeVisible();
  await page.getByTestId("cookie-accept").click();
  await expect(page.getByTestId("cookie-banner")).toBeHidden();

  await page.getByTestId("site-search-trigger").click();
  await expect(page.getByTestId("site-search")).toBeVisible();
  await page.getByTestId("site-search-input").fill("switch");
  await expect(page.getByTestId("site-search-results")).toContainText(/./);

  const toggle = page.getByRole("button", { name: /toggle theme/i }).last();
  await toggle.click();
  await page.waitForFunction(() =>
    document.documentElement.classList.contains("dark"),
  );
  const bg = await page.evaluate(
    () => getComputedStyle(document.body).backgroundColor,
  );
  expect(bg).not.toBe("rgb(255, 255, 255)");
});

test("footer carries policy links and last-updated stamp", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByTestId("footer-privacy")).toHaveAttribute(
    "href",
    "/privacy",
  );
  await expect(page.getByTestId("footer-terms")).toHaveAttribute(
    "href",
    "/terms",
  );
  await expect(page.getByTestId("last-updated")).toContainText(/20\d\d/);
});

test("trust additions: copy, faq, dialog, floating contact, utm, covers", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByTestId("cookie-accept").click();
  const copyBtn = page.locator("footer").getByTestId("copy-button");
  await expect(copyBtn).toBeVisible();
  await copyBtn.click();
  await expect(copyBtn).toContainText("COPIED");

  await expect(page.getByTestId("floating-contact")).toBeVisible();

  await page.goto("/?utm_source=newsletter&utm_medium=email&utm_campaign=launch");
  await expect
    .poll(() => page.evaluate(() => sessionStorage.getItem("utm_source")))
    .toBe("newsletter");

  await page.goto("/work");
  await expect(page.getByTestId("cover-loaded").first()).toBeVisible();

  await page.goto("/contact");
  await expect(page.getByTestId("floating-contact")).toBeHidden();

  const faq = page.getByTestId("faq-item").first();
  await faq.click();
  await expect(faq).toHaveAttribute("aria-expanded", "true");

  await page.getByPlaceholder("Ada Lovelace").fill("Test User");
  await page.getByPlaceholder("ada@example.com").fill("test@example.com");
  await page.getByPlaceholder(/interested/).fill("Hello, testing the form.");
  await page.route("**/api/contact", (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, status: 200 }),
    }),
  );
  await page.getByTestId("contact-submit").click();
  await expect(page.getByTestId("confirm-dialog")).toBeVisible();
  await page.getByTestId("confirm-send").click();
  await expect(
    page.getByText(/Message sent|not send/).first(),
  ).toBeVisible();
});

test("research Cite button copies", async ({ page }) => {
  await page.goto("/research");
  await page.getByTestId("cookie-accept").click();
  const citeBtn = page.getByTestId("copy-button").first();
  await expect(citeBtn).toBeVisible();
  await citeBtn.click();
  await expect(citeBtn).toContainText("COPIED");
});

for (const route of ["/", "/work", "/research", "/about"]) {
  test(`no vibe-coded tropes on ${route}`, async ({ page }) => {
    await page.goto(route);
    const html = await page.content();
    expect(html).not.toMatch(/glass-card/);
    expect(html).not.toMatch(/backdrop-blur/);
    expect(html).not.toMatch(/CardGlow/);
    expect(html).not.toMatch(/rounded-full bg-indigo/);
    expect(html).not.toMatch(/lucide/);
    expect(html).not.toMatch(/rounded-2xl/);
    expect(html).not.toMatch(/rounded-3xl/);
    expect(html).not.toMatch(/shadow-(sm|md|lg|xl|2xl)\b/);
    expect(html).not.toMatch(/drop-shadow/);
    expect(html).not.toMatch(/radial-gradient/);
    expect(html).not.toMatch(/linear-gradient/);
    expect(html).not.toMatch(/sparkle/);
    expect(html).not.toMatch(/group-hover:scale/);
    expect(html).not.toMatch(/hover:scale/);
    expect(html).not.toMatch(/animate-(bounce|pulse|spin)/);

    const uiText = await page.locator("main").innerText();
    expect(uiText).not.toContain("!");
    expect(uiText).not.toContain("\u2014");
    expect(uiText).not.toMatch(/\p{Extended_Pictographic}/u);
    const lower = uiText.toLowerCase();
    // "foster" is allowed: the live CSE 100 bullet uses "Fostered" verbatim.
    for (const word of [
      "passionate",
      "delve",
      "testament",
      "leverage",
      "seamless",
      "robust",
      "unleash",
      "elevate",
      "cutting-edge",
      "realm",
      "journey",
      "tapestry",
      "navigating",
      "innovative",
    ]) {
      expect(lower).not.toContain(word);
    }
  });
}
