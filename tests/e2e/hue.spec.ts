import { test, expect } from "@playwright/test";

function relativeLuminance(cssColor: string): number {
  // Chromium serializes color-mix results as `color(srgb r g b)` (0..1 floats);
  // plain colors come back as `rgb(r, g, b)` (0..255 ints). Accept both.
  let r = 0, g = 0, b = 0;
  const rgbMatch = cssColor.match(/rgba?\((\d+)[, ]\s*(\d+)[, ]\s*(\d+)/);
  const srgbMatch = cssColor.match(/color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)/);
  if (rgbMatch) {
    r = Number(rgbMatch[1]) / 255;
    g = Number(rgbMatch[2]) / 255;
    b = Number(rgbMatch[3]) / 255;
  } else if (srgbMatch) {
    r = Number(srgbMatch[1]);
    g = Number(srgbMatch[2]);
    b = Number(srgbMatch[3]);
  } else {
    throw new Error(`unparseable color: ${cssColor}`);
  }
  const channel = (c: number) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

const CASES = [
  ["ip-sage", "#14b8a6"],
  ["specsplit", "#f59e0b"],
] as const;

for (const [slug, hex] of CASES) {
  test(`case study /work/${slug} is hue-scoped`, async ({ page }) => {
    await page.goto(`/work/${slug}`);
    const scope = page.locator(`[data-hue="${hex}"]`).first();
    await expect(scope).toBeAttached();
    await expect(scope.locator("h1")).toBeVisible();
  });
}

test("work lead carries the spotlight project's hue", async ({ page }) => {
  await page.goto("/");
  const lead = page.getByTestId("work-lead");
  await expect(lead).toHaveAttribute("data-hue", "#14b8a6");
  await expect(lead.locator(".project-accent-text").first()).toBeVisible();
  await expect(lead).toContainText("IP-Sage");
});

test("about portrait is square, circular, and in colour", async ({ page }) => {
  await page.goto("/about");
  const portrait = page.getByTestId("portrait").locator("img");
  await expect(portrait).toBeVisible();
  const box = (await portrait.boundingBox())!;
  expect(Math.abs(box.width - box.height)).toBeLessThan(2);

  const style = await portrait.evaluate((node) => {
    const computed = getComputedStyle(node);
    return {
      filter: computed.filter,
      borderRadius: computed.borderRadius,
    };
  });
  expect(style.filter === "none" || style.filter === "").toBe(true);
  expect(style.borderRadius).not.toBe("0px");
});

test("project accent large type meets 3:1 contrast on specsplit", async ({
  page,
}) => {
  await page.goto("/work/specsplit");
  const el = page.locator("[data-hue] .project-accent-text").first();
  await expect(el).toBeAttached();
  const [fg, bg] = await el.evaluate((node) => {
    const fgColor = getComputedStyle(node).color;
    let p: HTMLElement | null = node as HTMLElement;
    let bgColor = "rgb(255, 255, 255)";
    while (p) {
      const c = getComputedStyle(p).backgroundColor;
      if (c && c !== "rgba(0, 0, 0, 0)" && c !== "transparent") {
        bgColor = c;
        break;
      }
      p = p.parentElement;
    }
    return [fgColor, bgColor];
  });
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  expect(ratio).toBeGreaterThanOrEqual(3);
});
