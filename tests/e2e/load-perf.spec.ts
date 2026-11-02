// L4 and L5 live here and only here. L1 structural checks are in
// verify-tropes.sh because they need the built HTML; these need a running
// browser, a clock, and a network log, so they belong in a spec rather than a
// shell script. measure:bundle stays advisory.
//
// Every threshold is a commitment with a measured baseline behind it. The LCP
// constant could silently rot, so it carries its measurement date and the
// machine class, and a regression is reported against that baseline rather than
// a round number.
import { expect, test, type Page } from "@playwright/test";

// Measured 2026-09-27 at 1280x720 on the dev server, three consecutive cold
// loads: 940ms, 192ms, 168ms. The first load pays the Turbopack compile and is
// the honest cold figure, so 1200 is the baseline rather than the median.
// LCP_MAX is therefore 1400ms. This is a REGRESSION bound, not a target.
const LCP_BASELINE_MS = Number(process.env.LCP_BASELINE_MS ?? 1200);
const LCP_MAX_MS = LCP_BASELINE_MS + 200;

const LONG_TASK_MS = 250;
const CLS_MAX = 0.1;

// The LCP paint area, measured 2026-10-26 at 1280x900: the hero h1 won at
// 67,731 px, and the portrait is the other legitimate owner. A full-viewport
// canvas would report 1,152,000, so the bound is above every element the hero
// owns and far below anything that covers the page.
const MAX_LCP_PAINT_AREA = 400_000;

// Every test here starts at the top of the document.
async function openTop(page: Page) {
  await page.goto("/", { waitUntil: "load" });
  // scroll-behavior: smooth is set on the document, so a programmatic scrollTo
  // animates. Turning it off makes the jump atomic.
  await page.addStyleTag({ content: "html{scroll-behavior:auto !important}" });
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(250);
}

test.describe("L4: runtime cost on /", () => {
  test("the hero's LCP does not move", async ({ page }) => {
    await openTop(page);
    const lcp = await page.evaluate(
      () =>
        new Promise<{
          time: number;
          tag: string;
          owner: string;
          size: number;
        }>((resolve) => {
          // A PerformanceObserver with buffered:true, NOT
          // performance.getEntriesByType. LCP is not retrievable through
          // getEntriesByType at all, so the first version of this test read 0
          // on a perfectly healthy page and would have failed for a reason that
          // had nothing to do with the hero.
          let worst = 0;
          let tag = "none";
          let owner = "none";
          let area = 0;
          const po = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.startTime <= worst) continue;
              worst = entry.startTime;
              const lcp = entry as PerformanceEntry & {
                element?: Element | null;
                size?: number;
              };
              area = lcp.size ?? 0;
              tag = lcp.element?.tagName ?? "none";
              let labelled: Element | null | undefined = lcp.element;
              while (labelled && !labelled.hasAttribute("data-testid")) {
                labelled = labelled.parentElement;
              }
              owner = labelled?.getAttribute("data-testid") ?? "none";
            }
          });
          po.observe({ type: "largest-contentful-paint", buffered: true });
          // LCP is finalized on first input or on hide; the observer's last
          // buffered entry after load is the real value. Give the observer a
          // frame to drain before reading.
          requestAnimationFrame(() => {
            setTimeout(() => {
              po.disconnect();
              resolve({ time: worst, tag, owner, size: area });
            }, 250);
          });
        }),
    );
    expect(lcp.time).toBeGreaterThan(0);
    expect(lcp.time).toBeLessThanOrEqual(LCP_MAX_MS);
    // By element, not only by number: a full-viewport canvas that paints ahead of
    // the hero can win LCP and still report a healthy time, which would make the
    // threshold above a measurement of the wrong thing. entry.element is null on
    // some runs, measured, so the paint area carries the weight and the tag only
    // says something when the browser deigns to name the element.
    expect(lcp.tag).not.toBe("CANVAS");
    expect(lcp.size).toBeLessThan(MAX_LCP_PAINT_AREA);
    if (lcp.owner !== "none") {
      // The portrait is the intended LCP now; the headline remains a valid
      // owner when the browser paints it first.
      expect(["hero-portrait", "hero-headline"]).toContain(lcp.owner);
    }
  });

  test("CLS stays under 0.1 on /", async ({ page }) => {
    await openTop(page);
    const cls = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          let total = 0;
          const po = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              const e = entry as PerformanceEntry & {
                hadRecentInput?: boolean;
                value?: number;
              };
              if (!e.hadRecentInput) total += e.value ?? 0;
            }
          });
          po.observe({ type: "layout-shift", buffered: true });
          setTimeout(() => {
            po.disconnect();
            resolve(total);
          }, 1200);
        }),
    );
    expect(cls).toBeLessThan(CLS_MAX);
  });

  test("no long task over 250ms in the first five seconds", async ({ page }) => {
    await page.goto("/");
    const longest = await page.evaluate(
      () =>
        new Promise<number>((resolve) => {
          let worst = 0;
          const po = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              worst = Math.max(worst, entry.duration);
            }
          });
          po.observe({ type: "longtask", buffered: true });
          setTimeout(() => {
            po.disconnect();
            resolve(worst);
          }, 5000);
        }),
    );
    expect(longest).toBeLessThan(LONG_TASK_MS);
  });
});
