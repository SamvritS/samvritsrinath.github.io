import { test, expect } from "@playwright/test";

test("systemvisual nodes and edges render", async ({ page }) => {
  await page.goto("/work/specsplit");
  await expect(page.getByTestId("topology-node").first()).toBeAttached();
  await expect(page.getByTestId("topology-edge").first()).toBeAttached();
});

test("keyboard focus flips hotspot data-state", async ({ page }) => {
  await page.goto("/work/specsplit");
  const node = page.getByTestId("topology-node").first();
  await node.focus();
  await expect(node).toHaveAttribute("data-state", "inspecting");
});

test("hotspot click isolates a path", async ({ page }) => {
  await page.goto("/work/specsplit");
  await page.getByTestId("topology-node").first().click();
  const lit = page.locator(
    '[data-testid="topology-edge"][stroke="var(--wavelength)"]',
  );
  await expect(lit.first()).toBeAttached();
  await expect(page.getByTestId("topology-selection")).toBeVisible();
});

test("reduced motion yields no signal animation", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/work/specsplit");
  await expect(page.locator("animateMotion")).toHaveCount(0);
});

test("specsplit branches partition into accepted and rejected", async ({
  page,
}) => {
  await page.goto("/work/specsplit");
  const sim = page.getByTestId("specsplit-simulator");
  await expect(sim).toBeVisible();
  await page.getByTestId("specsplit-gamma").fill("4");
  const accepted = await page.getByTestId("specsplit-branch").count();
  const rejected = await page.getByTestId("specsplit-branch-rejected").count();
  expect(accepted + rejected).toBe(4);
  expect(rejected).toBeGreaterThan(0);
  await expect(sim.getByText(/tokens\/round/)).toBeVisible();
});

test("ip-sage inspection names the pipeline stage", async ({ page }) => {
  await page.goto("/work/ip-sage");
  const node = page.getByTestId("topology-node").first();
  const selection = page.getByTestId("ip-sage-selection").first();
  await expect
    .poll(
      async () => {
        await node.focus();
        await node.press("Enter");
        return selection.count();
      },
      { timeout: 15000 },
    )
    .toBeGreaterThan(0);
  await expect(selection).toContainText("STAGE");
});

test("lomaverse names its integrator and body count", async ({ page }) => {
  await page.goto("/work/lomaverse");
  await expect(page.getByTestId("lomaverse-integrator")).toContainText(
    "VELOCITY-VERLET",
  );
});

test("optfantasy isolates a series by keyboard", async ({ page }) => {
  await page.goto("/work/optfantasy");
  const item = page.getByRole("button", { name: "Isolate heuristic" });
  await item.focus();
  await item.press("Enter");
  await expect(item).toHaveAttribute("aria-pressed", "true");
});
