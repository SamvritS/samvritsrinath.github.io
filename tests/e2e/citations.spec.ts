import { expect, test } from "@playwright/test";

test("every research paper exposes a readable citation and BibTeX", async ({
  page,
}) => {
  await page.goto("/research");

  const controls = page.getByTestId("citation-control");
  await expect(controls).toHaveCount(5);

  const first = controls.first();
  await expect(first.getByTestId("citation-summary")).toContainText("Cite");
  await first.getByTestId("citation-summary").click();

  const bibtex = first.getByTestId("bibtex-entry");
  await expect(bibtex).toBeVisible();

  const text = await bibtex.innerText();
  expect(text).toMatch(/^@misc\{operatorsage2025,/);
  expect(text).toContain("title = {");
  expect(text.trim().endsWith("}")).toBe(true);
});

test("the citation control is keyboard operable", async ({ page }) => {
  await page.goto("/research");

  const control = page.getByTestId("citation-control").first();
  const summary = control.getByTestId("citation-summary");
  await summary.focus();
  await page.keyboard.press("Enter");

  await expect(control).toHaveAttribute("open", "");
  await expect(control.getByTestId("bibtex-entry")).toBeVisible();
});

test("copying BibTeX puts a valid entry on the clipboard", async ({ page }) => {
  await page.goto("/research");

  const control = page.getByTestId("citation-control").first();
  await control.getByTestId("citation-summary").click();
  await control.getByTestId("copy-bibtex").click();

  const clip = await page.evaluate(() => navigator.clipboard.readText());
  expect(clip).toMatch(/^@misc\{operatorsage2025,/);
  expect(clip).toContain("howpublished = {IMC 2025 lab paper}");
  expect(clip.trim().endsWith("}")).toBe(true);
});

test("the citation panel stays inside a 320px viewport", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/research");

  const control = page.getByTestId("citation-control").first();
  await control.getByTestId("citation-summary").click();
  await expect(control.getByTestId("bibtex-entry")).toBeVisible();

  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(1);
});
