import { test, expect } from "@playwright/test";
import { projects } from "../../data/projects";
import { site } from "../../data/site";

test("the Google Search Console verification file is served at the root", async ({
  request,
}) => {
  const response = await request.get("/googlee446961e5344d188.html");

  expect(response.status()).toBe(200);
  expect((await response.text()).trim()).toBe(
    "google-site-verification: googlee446961e5344d188.html",
  );
});

test("the sitemap lists every public route and project", async ({ request }) => {
  const response = await request.get("/sitemap.xml");

  expect(response.status()).toBe(200);
  const xml = await response.text();
  const paths = Array.from(
    xml.matchAll(/<loc>([^<]+)<\/loc>/g),
    ([, url]) => new URL(url).pathname,
  );

  expect(new Set(paths).size).toBe(paths.length);
  expect(paths).toEqual(
    expect.arrayContaining([
      "/",
      "/work",
      "/research",
      "/about",
      "/resume",
      "/playground",
      "/contact",
      ...projects.map((project) => `/work/${project.slug}`),
    ]),
  );
  expect(paths).not.toContain("/privacy");
  expect(paths).not.toContain("/terms");
});

test("public pages expose canonical and social metadata", async ({ page }) => {
  await page.goto("/about");

  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    /\/about$/,
  );
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
    "content",
    `About · ${site.name}`,
  );
  await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
    "content",
    `About · ${site.name}`,
  );
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
    "content",
    "index, follow",
  );
});

test("legal pages stay out of the index", async ({ page }) => {
  for (const path of ["/privacy", "/terms"]) {
    await page.goto(path);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, follow",
    );
  }
});
