import { test, expect, type Page } from "@playwright/test";

const ROUTES = ["/", "/work", "/work/lomaverse", "/playground"];

function hydrateMessages(page: Page) {
  const hits: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" && /hydrat/i.test(message.text()))
      hits.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => {
    if (/hydrat/i.test(error.message)) hits.push(`pageerror: ${error.message}`);
  });
  return hits;
}

test("the JSON-LD graph lives in the body, not the head", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator('head script[type="application/ld+json"]')).toHaveCount(0);

  const graph = page.locator('body script[type="application/ld+json"]');
  await expect(graph).toHaveCount(1);

  const raw = await graph.textContent();
  expect(raw).toBeTruthy();
  const parsed = JSON.parse(raw as string) as { "@type": string }[];
  const types = parsed.map((entry) => entry["@type"]);

  expect(types.filter((type) => type === "Person")).toHaveLength(1);
  expect(types.filter((type) => type === "ItemList")).toHaveLength(1);
  expect(types.filter((type) => type === "ScholarlyArticle").length).toBeGreaterThanOrEqual(10);
});

test("a clean browser console reports no hydration errors on any route", async ({ page }) => {
  for (const route of ROUTES) {
    const hits = hydrateMessages(page);
    await page.goto(route);
    await page.waitForLoadState("networkidle");
    expect(hits, `hydration messages on ${route}`).toEqual([]);
  }
});

test("the theme init script lives in the body, leaving head with no positional inline script", async ({
  page,
}) => {
  await page.goto("/");

  // An extension that prepends nodes to head shifts a positional inline script
  // by one and desynchronises hydration. With both component scripts in the
  // body, head carries nothing positional to shift.
  await expect(page.locator("head script#theme-init")).toHaveCount(0);
  await expect(page.locator("body script#theme-init")).toHaveCount(1);

  // It must still run during parse, ahead of any framework bundle, or the dark
  // class lands after first paint and the page flashes.
  const order = await page.evaluate(() => {
    const theme = document.querySelector<HTMLScriptElement>(
      "body script#theme-init",
    );
    const jsonLd = document.querySelector<HTMLScriptElement>(
      "body script#json-ld",
    );
    return {
      hasSource: Boolean(theme && theme.textContent),
      beforeJsonLd: Boolean(
        theme && jsonLd && theme.compareDocumentPosition(jsonLd) & 4,
      ),
      // Head may carry framework and vendor tags, but no inline script of ours
      // and no script whose position React has to match. The count is a set of
      // nodes, not a number, so analytics and dev-mode chunks do not make it
      // brittle.
      headInlineScripts: Array.from(
        document.querySelectorAll("head script:not([src])"),
      ).map((node) => node.id || node.getAttribute("type") || "anonymous"),
    };
  });
  expect(order.hasSource).toBe(true);
  expect(order.beforeJsonLd).toBe(true);
  expect(order.headInlineScripts).toEqual([]);
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("the homepage sections and zero canvases are attached without error", async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));

    // Lazy project covers below the fold can hold the load event open when
    // scripting is off; this check is about the server-rendered document, so
    // wait for DOMContentLoaded rather than every image.
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // The page is server-rendered markup, not something JavaScript assembles,
    // so a reader with no scripting gets the whole document with zero canvases.
    await expect(page.locator("main > section")).toHaveCount(9);
    await expect(page.locator("#hero")).toBeAttached();
    await expect(page.locator("#contact")).toBeAttached();
    await expect(page.locator("canvas")).toHaveCount(0);

    // The theme script is progressive: with scripting off the dark decision is
    // simply absent, not applied late and not an error.
    await expect(page.locator("html")).not.toHaveClass(/(^|\s)dark(\s|$)/);
    expect(errors).toEqual([]);
  });
});

test("the dark class lands during parse, not after the bundle loads", async ({
  page,
}) => {
  // The server never renders the dark class, so with the media query set to
  // dark and an empty theme store only the inline script can add it. Reading it
  // before waiting on the network is the assertion: the class has to be there
  // while chunks are still arriving, which is the property the next/script
  // version could not offer, since it only queued the source for the runtime
  // to drain later. It also catches the script being unparseable, which is the
  // state this script shipped in: its outer try had no catch, so it threw on
  // every load and the dark class never appeared at all.
  await page.emulateMedia({ colorScheme: "dark" });
  const scriptErrors: string[] = [];
  page.on("pageerror", (error) => scriptErrors.push(error.message));

  await page.goto("/", { waitUntil: "commit" });
  await expect(page.locator("html")).toHaveClass(/(^|\s)dark(\s|$)/);
  expect(scriptErrors).toEqual([]);

  await page.waitForLoadState("networkidle");
  await expect(page.locator("html")).toHaveClass(/(^|\s)dark(\s|$)/);
  await expect(page.locator("head script:not([src])")).toHaveCount(0);
});

test("the theme init script is valid JavaScript, not just present", async ({
  page,
}) => {
  await page.goto("/");
  const source = await page.evaluate(
    () =>
      document.querySelector<HTMLScriptElement>("body script#theme-init")
        ?.textContent ?? "",
  );
  expect(source.length).toBeGreaterThan(0);
  // Constructing the function compiles the body without running it, so a
  // syntax error surfaces as a throw here instead of as a silent no-op in the
  // browser. This is the check that would have caught the missing catch.
  const compiles = await page.evaluate((code) => {
    try {
      new Function(code);
      return true;
    } catch {
      return false;
    }
  }, source);
  expect(compiles).toBe(true);
});
