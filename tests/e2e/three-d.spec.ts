import { test, expect, type Page } from "@playwright/test";

function blockWebGL(page: Page) {
  return page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (
      this: HTMLCanvasElement,
      kind: string,
      ...args: unknown[]
    ) {
      if (kind === "webgl" || kind === "webgl2") return null;
      return Reflect.apply(getContext, this, [kind, ...args]) as ReturnType<
        typeof getContext
      >;
    } as typeof HTMLCanvasElement.prototype.getContext;
  });
}

test("lomaverse renders a WebGL canvas when available", async ({ page }) => {
  await page.goto("/work/lomaverse");
  const sim = page.getByTestId("lomaverse-sim");
  await expect(sim).toBeVisible();
  await expect(sim.locator("canvas")).toHaveCount(1);
  await expect(page.getByTestId("lomaverse-status")).toContainText(
    "Simulation running",
  );
});

test("lomaverse falls back to a real figure without WebGL", async ({
  page,
}) => {
  await blockWebGL(page);
  await page.goto("/work/lomaverse");
  await expect(page.getByTestId("lomaverse-fallback")).toBeVisible();
  await expect(
    page.getByTestId("lomaverse-sim").locator("canvas"),
  ).toHaveCount(0);
  await expect(page.getByTestId("lomaverse-status")).toContainText(
    "WebGL unavailable",
  );
});

test("lomaverse renders static with the correct status under reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/work/lomaverse");
  await expect(page.getByTestId("lomaverse-fallback")).toBeVisible();
  await expect(page.getByTestId("lomaverse-status")).toContainText(
    "reduced motion",
  );
  await expect(page.locator("animateMotion")).toHaveCount(0);
});

test("trails sample every frame, so the draw range fills fast", async ({
  page,
}) => {
  await page.goto("/work/lomaverse");
  const rig = page.getByTestId("lomaverse-rig");
  await expect(rig).toBeVisible();

  const samples = () =>
    rig.evaluate((node) => Number(node.getAttribute("data-trail-samples")));

  await page.waitForTimeout(3000);
  expect(await samples()).toBeGreaterThan(1200);
});

test("playground renders its canvas scene", async ({ page }) => {
  await page.goto("/playground");
  await expect(page.getByTestId("playground").locator("canvas")).toHaveCount(
    1,
  );
});

test("ip-sage renders the address-space layer with a live scene marker", async ({
  page,
}) => {
  await page.goto("/work/ip-sage");
  const stage = page.getByTestId("product-stage").first();
  await expect(stage.getByTestId("product-stage-fallback")).toBeVisible();
  await expect(stage.getByTestId("address-space-layer")).toBeAttached();
  await expect(page.getByTestId("ip-sage-scene-marker")).toHaveCount(1);
  await expect(stage.locator("canvas")).toHaveCount(1);
});

test("ip-sage layer renders no canvas without WebGL", async ({ page }) => {
  await blockWebGL(page);
  await page.goto("/work/ip-sage");
  const stage = page.getByTestId("product-stage").first();
  await expect(stage.getByTestId("product-stage-fallback")).toBeVisible();
  await expect(stage.locator("canvas")).toHaveCount(0);
  await expect(page.getByTestId("ip-sage-scene-marker")).toHaveCount(0);
});

test("ip-sage layer renders no scene under reduced motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/work/ip-sage");
  // expect.poll, not a bare toBeAttached(): the layer is an ssr:false island, so
  // under full-suite load the 5s default can expire before the chunk resolves.
  // Observed once at 6.4s while the same test passed 3/3 in isolation and in two
  // consecutive full runs, so this is mount latency under load, not a contract
  // break. Poll to 15s. Assertion strength is unchanged: still requires the
  // layer to be attached, and the three zero-count assertions below are
  // untouched.
  await expect
    .poll(() => page.getByTestId("address-space-layer").count(), {
      timeout: 15000,
    })
    .toBeGreaterThan(0);
  await expect(page.getByTestId("ip-sage-scene-marker")).toHaveCount(0);
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator("animateMotion")).toHaveCount(0);
});

test("alpha-bearing brand tokens reach the scene without a THREE.Color warning", async ({
  page,
}) => {
  const warnings: string[] = [];
  page.on("console", (message) => {
    if (/THREE\.Color/.test(message.text())) warnings.push(message.text());
  });

  await page.goto("/work/lomaverse");
  await expect(
    page.getByTestId("lomaverse-sim").locator("canvas"),
  ).toHaveCount(1, { timeout: 20000 });

  // The guard only bites while the token still carries alpha: the optimizer
  // emits rgba() as 8-digit hex, which THREE.Color cannot parse. The LomaVerse
  // scene reads this token through swatch(), so an unparsed value leaves its
  // line material white and logs once.
  const token = await page.evaluate(() =>
    getComputedStyle(document.documentElement)
      .getPropertyValue("--line-strong")
      .trim(),
  );
  expect(/^(#[0-9a-f]{8}|rgba?\()/i.test(token)).toBe(true);

  await page.goto("/work/ip-sage");
  await expect(
    page.getByTestId("product-stage").first().locator("canvas"),
  ).toHaveCount(1, { timeout: 20000 });

  expect(warnings).toEqual([]);
});

