import { test, expect } from "@playwright/test";

test("IP-Sage case-study stage renders a live scene or static fallback", async ({ page }) => {
  await page.goto("/work/ip-sage");
  await expect(
    page.getByTestId("product-stage").first().getByTestId("product-stage-fallback"),
  ).toBeVisible();
});

test("reduced motion renders a static demo frame", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/work/ip-sage");
  await expect(
    page.getByTestId("product-stage").first().getByTestId("product-stage-fallback"),
  ).toBeVisible();
  await expect(page.getByTestId("ip-sage-scene-marker")).toHaveCount(0);
});

test("specsplit slider changes readout and keeps tabular alignment", async ({
  page,
}) => {
  await page.goto("/work/specsplit");
  const sim = page.getByTestId("specsplit-simulator");
  await expect(sim).toBeVisible();
  const readout = page.getByTestId("specsplit-readout");
  const before = await readout.innerText();
  const branchesBefore = await page.getByTestId("specsplit-branch").count();
  await page.getByTestId("specsplit-gamma").fill("4");
  const after = await readout.innerText();
  const branchesAfter = await page.getByTestId("specsplit-branch").count();
  expect(after).not.toBe(before);
  expect(branchesAfter).not.toBe(branchesBefore);
  const cls = await readout.evaluate((el) =>
    getComputedStyle(el).fontVariantNumeric,
  );
  expect(cls).toMatch(/tabular-nums/);
});

test("IP-Sage product stage stays available without WebGL", async ({ page }) => {
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, kind: string, ...args: unknown[]) {
      if (kind === "webgl" || kind === "webgl2") return null;
      return Reflect.apply(getContext, this, [kind, ...args]) as ReturnType<typeof getContext>;
    } as typeof HTMLCanvasElement.prototype.getContext;
  });
  await page.goto("/work/ip-sage");
  const stage = page.getByTestId("product-stage").first();
  await expect(stage.getByTestId("product-stage-fallback")).toBeVisible();
  await expect(stage.locator("canvas")).toHaveCount(0);
});

test("LomaVerse provides a static view for reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/work/lomaverse");
  await expect(page.getByTestId("lomaverse-fallback")).toBeVisible();
  await expect(page.getByTestId("lomaverse-status")).toContainText("reduced motion");
});

test("LomaVerse provides a static view when WebGL is unavailable", async ({ page }) => {
  await page.addInitScript(() => {
    const getContext = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, kind: string, ...args: unknown[]) {
      if (kind === "webgl" || kind === "webgl2") return null;
      return Reflect.apply(getContext, this, [kind, ...args]) as ReturnType<typeof getContext>;
    } as typeof HTMLCanvasElement.prototype.getContext;
  });
  await page.goto("/work/lomaverse");
  await expect(page.getByTestId("lomaverse-fallback")).toBeVisible();
  await expect(page.getByTestId("lomaverse-status")).toContainText("WebGL unavailable");
});

test("LomaVerse simulation controls update their state", async ({ page }) => {
  await page.goto("/work/lomaverse");
  const webgl = await page.evaluate(
    () => !!(document.createElement("canvas").getContext("webgl2") || document.createElement("canvas").getContext("webgl")),
  );
  test.skip(!webgl, "WebGL unavailable");
  await expect(page.getByTestId("lomaverse-pause")).toBeVisible();
  await page.getByTestId("lomaverse-pause").click();
  await expect(page.getByTestId("lomaverse-status")).toHaveText("Simulation paused");
  await page.getByTestId("lomaverse-speed").fill("1.5");
  await expect(page.getByLabel("Simulation step rate")).toHaveValue("1.5");
  await page.getByTestId("lomaverse-reset").click();
});

test("topology hover highlights the connected path", async ({ page }) => {
  await page.goto("/work/specsplit");
  await page.getByTestId("topology-node").first().hover();
  const lit = page.locator(
    '[data-testid="topology-edge"][stroke="var(--accent)"]',
  );
  await expect(lit.first()).toBeAttached();
});

test("topology hotspots can be selected by keyboard", async ({ page }) => {
  await page.goto("/work/specsplit");
  const node = page.getByTestId("topology-node").first();
  await node.focus();
  await node.press("Enter");
  await expect(node).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("topology-selection")).toBeVisible();
});

test("Country-in-the-Middle exposes the selected transit stop", async ({ page }) => {
  await page.goto("/work/country-in-the-middle");
  const stop = page.getByRole("button", { name: "COUNTRY X" }).first();
  await stop.focus();
  await stop.press("Enter");
  await expect(stop).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("citm-selection")).toContainText("COUNTRY X");
});

test("HoneyLLM exposes the selected detection channel", async ({ page }) => {
  await page.goto("/work/honeyllm");
  const channel = page.getByRole("button", { name: "VISIT" }).first();
  await channel.focus();
  await channel.press("Enter");
  await expect(channel).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("honeyllm-selection")).toContainText("VISIT");
});

test("GPU memory diagram exposes inspectable SM state", async ({ page }) => {
  await page.goto("/work/gpu-megakernels");
  const sm = page.getByRole("button", { name: "SM 1" }).first();
  await sm.focus();
  await sm.press("Enter");
  await expect(sm).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("megakernel-selection")).toContainText("SM 1");
});
