import { test, expect } from "@playwright/test";

test("lomaverse case study still has the full simulator", async ({ page }) => {
  await page.goto("/work/lomaverse");
  await expect(page.getByTestId("lomaverse-sim")).toBeVisible();
  await expect(page.getByTestId("lomaverse-integrator")).toContainText("VELOCITY-VERLET");
  await expect(page.getByTestId("lomaverse-sim")).toHaveCount(1);
});

test("the homepage mounts zero canvases", async ({ page }) => {
  await page.goto("/");
  await page.waitForLoadState("load");
  await expect(page.locator("main > section")).toHaveCount(9);
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.getByTestId("hero-portrait").locator("img")).toBeVisible();
  await expect(page.getByTestId("network-constellation")).toHaveCount(0);
  await expect(page.getByTestId("lomaverse-sim")).toHaveCount(0);
  await expect(page.getByTestId("planetary-journey")).toHaveCount(0);
});