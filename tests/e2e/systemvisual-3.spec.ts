import { test, expect } from "@playwright/test";

test("ip-sage exposes structure, flow, state, evidence, and interaction layers", async ({
  page,
}) => {
  await page.goto("/work/ip-sage");

  await expect(
    page.getByTestId("system-boundary").first(),
  ).toBeAttached();
  await expect(page.getByTestId("system-bus").first()).toBeAttached();
  await expect(page.getByTestId("system-field").first()).toBeAttached();
  await expect(page.getByTestId("system-rail").first()).toBeAttached();

  const node = page.getByTestId("topology-node").first();
  await expect
    .poll(
      async () => {
        await node.focus();
        return node.getAttribute("data-state");
      },
      { timeout: 15000 },
    )
    .toBe("inspecting");

  await node.hover();
  await expect(page.getByTestId("ip-sage-selection")).toContainText("STAGE");
});

test("specsplit exposes machines, tunnel, tree, and branch state", async ({
  page,
}) => {
  await page.goto("/work/specsplit");

  await expect(page.getByTestId("system-die").first()).toBeAttached();
  await expect(page.getByTestId("system-bus").first()).toBeAttached();
  const tree = page.getByTestId("specsplit-tree");
  await expect(tree).toBeAttached();

  const node = page.getByTestId("topology-node").first();
  await node.focus();
  await expect(node).toHaveAttribute("data-state", "inspecting");

  const branch = page.getByTestId("specsplit-branch").first();
  await branch.focus();
  await branch.press("Enter");
  await expect(page.getByTestId("topology-selection")).toContainText(
    /BRANCH \d+\/\d+ · ACCEPTED/,
  );
});

test("megakernel exposes die, SMs, allocator bus, and bottleneck state", async ({
  page,
}) => {
  await page.goto("/work/gpu-megakernels");

  await expect(page.getByTestId("system-die").first()).toBeAttached();
  await expect(page.getByTestId("system-bus").first()).toBeAttached();
  await expect(page.getByTestId("system-rail").first()).toBeAttached();
  expect(await page.getByTestId("topology-node").count()).toBeGreaterThanOrEqual(6);

  const sm = page.getByRole("button", { name: "SM 1" }).first();
  await sm.focus();
  await sm.press("Enter");
  await expect(page.getByTestId("megakernel-selection")).toContainText("SM 1");

  await page.getByRole("button", { name: "MEMORY" }).click();
  await expect(page.getByTestId("megakernel-bottleneck")).toBeVisible();
});

test("honeyllm exposes lanes, ocr band, verdict matrix, and rail", async ({
  page,
}) => {
  await page.goto("/work/honeyllm");

  await expect(page.getByTestId("system-boundary").first()).toBeAttached();
  await expect(page.getByTestId("system-matrix").first()).toBeAttached();
  await expect(page.getByTestId("system-rail").first()).toBeAttached();

  const channel = page.getByRole("button", { name: "VISIT" }).first();
  await channel.focus();
  await channel.press("Enter");
  await expect(page.getByTestId("honeyllm-selection")).toContainText("VISIT");

  await page.getByTestId("system-matrix-cell").first().hover();
  await expect(page.getByTestId("honeyllm-selection")).toContainText(
    /SMUGGLE|VISIT|WATERMARK/,
  );
});

test("citm exposes sources, transit slab, bundles, and rail", async ({
  page,
}) => {
  await page.goto("/work/country-in-the-middle");

  await expect(page.getByTestId("system-boundary").first()).toBeAttached();
  await expect(page.getByTestId("system-bus").first()).toBeAttached();
  await expect(page.getByTestId("system-rail").first()).toBeAttached();
  const packet = page.getByTestId("traceroute-packet");
  await expect(packet).toHaveCount(1);
  await expect(packet.locator("animateMotion").first()).toHaveAttribute(
    "repeatCount",
    "1",
  );
  expect(
    await page.getByTestId("topology-node").count(),
  ).toBeGreaterThanOrEqual(11);

  const stop = page.getByRole("button", { name: "COUNTRY X" }).first();
  await stop.focus();
  await stop.press("Enter");
  await expect(stop).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByTestId("citm-selection")).toContainText("COUNTRY X");
});

test("optfantasy plots measured methods with gap and rail", async ({
  page,
}) => {
  await page.goto("/work/optfantasy");

  await expect(page.getByTestId("system-plane").first()).toBeAttached();
  await expect(page.getByTestId("system-rail").first()).toBeAttached();
  await expect(
    page.getByTestId("system-rail").first().getByText("1,849.36"),
  ).toBeVisible();

  const item = page.getByRole("button", { name: "Isolate heuristic" });
  await item.focus();
  await item.press("Enter");
  await expect(item).toHaveAttribute("aria-pressed", "true");
});

test("lomaverse pairs the simulator with an instrument panel", async ({
  page,
}) => {
  await page.goto("/work/lomaverse");

  await expect(page.getByTestId("lomaverse-sim")).toBeVisible();
  await expect(page.getByTestId("system-rail").first()).toBeAttached();
  await expect(page.getByTestId("lomaverse-integrator")).toContainText(
    "VELOCITY-VERLET",
  );
});
