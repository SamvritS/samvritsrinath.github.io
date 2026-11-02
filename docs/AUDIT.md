# Phase 1 Audit

Status: complete; Q1 corrections committed; Phase 2 C1 palette implemented; A26 fixed
Date: 2026-10-27
Branch: `restore-character`; audited app code `3d4b7c2`; Q1 fixes `9f3c698`,
`dec8b85`; ignore rule `7c63bdd`
Build under test: Next.js 16.3.6 production build, served with `next start -p 3100`
Auditor: Qoder, using the master prompt, `web-design-guidelines`,
`redesign-existing-projects`, `ui-ux-pro-max`, `ui-styling`, and
`ui-designer`.

The user authorized continuing on `restore-character`. The brief's
`redesign/v2` branch cannot be created because `refs/heads/redesign` already
exists; git cannot create `redesign/v2` under a branch named `redesign`.

The audited build was run from the working tree. At audit time,
`git diff --stat 3d4b7c2 -- app components data lib public next.config.ts
package.json` was empty. The only tracked differences were six unstaged plan
deletions under `docs/superpowers/plans/`; the untracked harness, cache, and
asset folders are not imported by the app. The audited app code therefore
matches `3d4b7c2`. The brief's screenshots came from the `redesign` branch and
are visual references only; the audit screenshots came from this working tree.

## 0. Method

- Every public route in the build was audited: 9 static routes and 14
  generated project routes, 23 total.
- Each route was loaded at 375, 768, 1280, and 1920 px in light and dark,
  giving 184 route/theme/width observations.
- Each observation captured: horizontal overflow and offending boxes, console
  errors and warnings, failed requests, `h1` count, heading order, landmarks,
  image state, unlabeled controls, meta tags, theme state, decorative-layer
  semantics, and canvas state.
- Screenshots: 122 captures in `.review/audit/screens/`, which is gitignored.
  That is 14 representative routes at all 8 theme/width combinations, four
  home Work-section captures, four home Contact-section captures, and two
  search-dialog captures. All 184 combinations were measured by DOM and
  computed style. Eighteen representative captures were visually inspected.
  Post-fix verification used DOM and computed style; no visual redesign was
  made in this pass.
- Theme was set through the site's real `localStorage` key before navigation.
  The cookie banner was dismissed for the matrix so it did not cover content.
- The production server was used, not `next dev`, to avoid the dev badge.
- Reduced-motion checks used a browser context with
  `prefers-reduced-motion: reduce`.
- First-load JS was measured from `PerformanceResourceTiming` at the load
  event in a fresh context. Next 16 no longer prints per-route JS sizes in
  `next build`, so this is the repeatable baseline for later comparisons.
- Repository gates were run on the same commit.

## 1. Screens audited

Static routes: `/`, `/work`, `/research`, `/about`, `/contact`, `/resume`,
`/playground`, `/privacy`, `/terms`.

Project routes: `/work/ip-sage`, `/work/specsplit`, `/work/optfantasy`,
`/work/lomaverse`, `/work/honeyllm`, `/work/country-in-the-middle`,
`/work/gpu-megakernels`, `/work/cs1-llm`, `/work/problem-decomposition`,
`/work/pap-inventory`, `/work/psyches-of-color`,
`/work/parkinsons-predictor`, `/work/developer-journal`,
`/work/sentiment-classifier`.

Screenshot set for all eight combinations: the 9 static routes plus
`/work/ip-sage`, `/work/specsplit`, `/work/lomaverse`, `/work/honeyllm`, and
`/work/country-in-the-middle`.

## 2. Section 2.5 status

The brief's screenshots come from the `redesign` branch. Section 2.5 describes
redesign-branch bugs, not the `restore-character` baseline. The list is
dropped from this audit. The current findings are in Section 3.

## 3. Findings

Severity: P0 site broken, P1 core flow or major accessibility failure, P2
significant usability or SEO issue, P3 polish or maintainability.

| ID | Severity | Location | Evidence | Proposed fix | Skill tag |
| --- | --- | --- | --- | --- | --- |
| A1 | P1 | `components/site-search.tsx:83` | The class `w-[min(24rem, calc(100vw-2rem))]` contains a literal space, so the HTML class attribute splits at that space. The panel computed to 101.2 px wide on both 1280 and 375 px viewports; the input computed to 43.2 px. The screenshot shows the placeholder wrapping vertically in a narrow strip. | Remove the space: `w-[min(24rem,calc(100vw-2rem))]`, or use a static `w-96 max-w-[calc(100vw-2rem)]`. Add a Playwright assertion for panel width at 375 and 1280. | `[ui-styling: Tailwind Customization]`, `[web-design-guidelines: Navigation & State]` |
| A2 | P2 | `app/contact/page.tsx:14`, `components/work-archive.tsx:63`, `components/site-search.tsx:94` | Inputs use `focus:outline-none` and rely on a border change to `--line-strong`. Measured border contrast over surface is 1.46:1 light and 1.64:1 dark, below the 3:1 focus-indicator threshold. The global 2px wavelength outline is 6.75:1 light and 6.20:1 dark but is overridden on these inputs. The search input has no border at all and no other focus indicator. | Keep the global `:focus-visible` outline on inputs or add a 2px wavelength ring. Do not remove the outline without an equally visible replacement. | `[web-design-guidelines: Focus States]`, `[ui-ux-pro-max: 1. Accessibility]` |
| A3 | P2 | `app/contact/page.tsx:237-252` | FAQ buttons have `aria-expanded` but no `aria-controls`, no button `id`, and the answer `<p>` has no `id` or region. All six buttons measured `controls: null`, `id: ""`. | Add stable ids, `aria-controls`, and a labeled region or `role="region"` for the answer. Consider one open item at a time only if that matches the content. | `[web-design-guidelines: Accessibility]`, `[ui-ux-pro-max: 8. Forms & Feedback]` |
| A4 | P2 | `components/site-search.tsx:78-121` | Opening search focuses the input, but Tab leaves the dialog for the Projects nav link (`inDialog: false`). Escape closes it and leaves focus on the Projects link, not the trigger. The trigger has `aria-expanded` but no `aria-controls`; the dialog has `role="dialog"` but no `aria-modal`, focus trap, or return-focus logic. | Implement a proper search dialog: `aria-controls`, `aria-modal`, focus trap, Escape return to trigger, and background inert. | `[web-design-guidelines: Focus States]`, `[ui-ux-pro-max: 9. Navigation Patterns]` |
| A5 | P2 | `app/contact/page.tsx:259-296` | The confirm dialog sets `role="dialog"`, `aria-modal="true"`, and autofocuses Send, but the main element is not inert and the body is not scroll-locked. Escape closes the dialog and focus falls to `body`, not the submit button. | Add `inert` or `aria-hidden` to the background, lock scroll, and restore focus to the submit button on close. | `[web-design-guidelines: Focus States]`, `[ui-ux-pro-max: 8. Forms & Feedback]` |
| A6 | P2 | `app/contact/page.tsx:210-221` | Success and error messages are plain spans. The only live regions on the page are the two Copy buttons. A screen reader gets no announcement when a send succeeds or fails. | Add `role="status"` and `aria-live="polite"` to the success state; use `role="alert"` for the error state or an `aria-live="assertive"` region. | `[web-design-guidelines: Accessibility]`, `[ui-ux-pro-max: 8. Forms & Feedback]` |
| A7 | P2 | `app/layout.tsx:29-57` | All 23 routes measured an empty `link[rel="canonical"]`. `metadataBase` is set, but no route declares `alternates.canonical`. | Add a canonical URL per route, generated from the confirmed production domain and the route path. | `[redesign-existing-projects: Code Quality]` |
| A8 | P2 | `app/work/[slug]/page.tsx:29-32` | All 14 project routes measured no `og:image`; the 9 static routes do have one. The project `openGraph` object overrides the root metadata without an `images` field, so the default OG image is not inherited. | Add `images` to the project `openGraph` metadata, or use a shared metadata helper that inherits the branded OG image and adds a per-project title. | `[redesign-existing-projects: Code Quality]` |
| A9 | P2 | `app/globals.css`, `app/layout.tsx` | In dark mode every route measured `colorScheme: "normal"` while the `.dark` class was present. Native controls, scrollbars, and form widgets can render with the light scheme. | Set `color-scheme: light` on `:root` and `color-scheme: dark` on `.dark`, or set it from the theme toggle. | `[web-design-guidelines: Dark Mode & Theming]` |
| A10 | P2 | `components/work-archive.tsx:80`, `components/project-card.tsx:48`, `components/demos/pipeline-walkthrough.tsx:90` | `/work` goes h1 to h3 with no h2; the archive project titles are h3. `/work/ip-sage` goes h2 Pipeline to h4 Censys, Prune, Interpret, Guardrails, Cache, Operator. | Add an h2 for the archive list and make the stage labels h3, or use the same heading level as the section that owns them. | `[web-design-guidelines: Accessibility]` |
| A11 | P3 | `app/layout.tsx:29-57` | No route has `meta[name="theme-color"]`. | Add light and dark theme-color values that match `--void`, or emit a single value that matches the current theme. | `[web-design-guidelines: Dark Mode & Theming]` |
| A12 | P3 | `app/contact/page.tsx:145-181` | All form fields have labels, but the name, email, and message fields have no `name` attribute. The email field has no `spellCheck={false}`. | Add stable `name` attributes and email spellcheck off. Keep the visible labels and autocomplete values. | `[web-design-guidelines: Forms]` |
| A13 | P3 | `components/theme-toggle.tsx:21-24`, `components/nav.tsx:97`, `components/footer.tsx:17`, `components/copy-button.tsx:35`, `components/floating-contact.tsx:40` | Measured hit areas at 375: mobile menu 36x36, theme toggle 36x36, footer icons 40x40, copy button 83x30, floating contact 95x38. All meet the 24 px WCAG 2.2 minimum, but not the 44 px touch recommendation. | Expand hit areas to at least 44x44 with padding or a pseudo-element, without changing visual size. | `[web-design-guidelines: Touch & Interaction]`, `[ui-ux-pro-max: 2. Touch & Interaction]` |
| A14 | P3 | `components/nav.tsx:95`, `components/site-search.tsx:68`, `components/floating-contact.tsx:38` | The mobile menu button, search trigger, and floating contact button all set `aria-expanded` but none sets `aria-controls`; the mobile overlay has no `role` or accessible name. | Add ids and `aria-controls` to each disclosure; label the mobile overlay and the floating contact panel. | `[web-design-guidelines: Accessibility]` |
| A15 | P3 | `components/theme-toggle.tsx:17-25` | The theme button has `aria-label="Toggle theme"` and no `aria-pressed` or current-state label. A screen reader cannot tell whether dark is active. | Use `aria-label` that states the next action, or add `aria-pressed` with a visible state. | `[web-design-guidelines: Accessibility]` |
| A16 | P3 | `components/floating-contact.tsx:19` | The fixed bottom-left Mail button covers the hero portrait at 375 px (`home-dark-375.jpg`, `home-light-375.jpg`) and sits on the About page Teaching label at 1280 (`about-dark-1280.jpg`). | Move the button to a collision-aware corner, hide it while the hero or a labeled rail is under it, or give it a safe inset on small screens. | `[web-design-guidelines: Safe Areas & Layout]`, `[ui-designer: Design Review Checklist / Layout & Spacing]` |
| A17 | P3 | `components/work-archive.tsx:34` | The archive filter bar is `sticky top-16` (64 px). The fixed nav bottom is 72 px. When scrolled, the bar top measured 64 px, an 8 px overlap that hides its top border and padding. | Use a shared nav-offset token, for example `top-[4.5rem]` or `top-20`, and assert the bar clears the nav. | `[web-design-guidelines: Focus States]`, `[ui-designer: Design Review Checklist / Layout & Spacing]` |
| A18 | P3 | Headings in `components/section-heading.tsx:55,87`, `components/page-header.tsx:36`, `components/project-card.tsx:48` | No heading uses `text-wrap: balance` or `text-pretty`. The long project and section titles can leave short last lines at wide and narrow widths. | Add `text-wrap: balance` to display headings and `text-wrap: pretty` to reading prose. | `[web-design-guidelines: Typography]` |
| A19 | P3 | `app/globals.css:12-56`, z-index usages | `--surface-2` and `--field-slate` are defined but unused outside the stylesheet. `--field-warm` is used only inside the atmosphere block. Z-index is a set of one-offs: `z-0`, `z-1`, `z-10`, `z-30`, `z-40`, `z-50`, `z-[60]`, `z-[65]` (three components), `z-[70]`, `z-[80]`, `z-[90]`, `z-100`. | Remove dead tokens or use them; define a small z-index scale and use it for shell, overlay, dialog, and lightbox layers. | `[redesign-existing-projects: Color and Surfaces]`, `[ui-ux-pro-max: 5. Layout & Responsive]` |
| A20 | P3 | `components/demos/lomaverse-sim.tsx:721-732` | The LomaVerse rig is a `div` with pointer handlers and `aria-pressed`, but no role, tabIndex, or keyboard handler. The canvas is inside a labeled `ProductStage` region, but the pin/rotate interaction is pointer-only. | Use a button or a focusable control for pinning, and provide keyboard equivalents for camera rotation. Keep the canvas label on the wrapper that receives it. | `[web-design-guidelines: Touch & Interaction]`, `[ui-ux-pro-max: 1. Accessibility]` |
| A21 | P3 | `components/hero-titles.tsx` | The typewriter reset `chars` to 0 before typing the next title. A screenshot taken during the cycle shows the red cursor with no title text (`home-light-375.jpg`, `home-dark-375.jpg`). The `sr-only` text stays complete. | Implemented in Phase 3: the next title starts at its first character, so the line never blanks. The cycle also pauses when the hero is offscreen and resolves to the first title under reduced motion. | `[ui-designer: Design Review Checklist]`, `[animate: reduced-motion and timing]` |
| A22 | P3 | `components/work-archive.tsx:15-16` | Category and search state are component state only. A filtered archive cannot be linked or restored with the browser back button. | Sync the active category and query to the URL with `useSearchParams` or a small query helper. | `[web-design-guidelines: Navigation & State]` |
| A23 | P2 | `app/sitemap.ts:6-21`, `app/robots.ts` | The sitemap includes home, work, research, about, resume, contact, and all projects, but omits `/playground`, `/privacy`, and `/terms`, and sets no `lastModified`. Robots exists and points at the sitemap. | Add every public route and a real `lastModified` from the content or build. Confirm the production domain first. | `[redesign-existing-projects: Code Quality]` |
| A24 | P2 | `app/` | No `not-found.tsx`, `error.tsx`, `global-error.tsx`, `public/llms.txt`, `manifest.webmanifest`, or apple-touch-icon exists. `app/loading.tsx` is intentionally absent because it caused the measured CLS failure. | Add the missing production files in Phase 8, styled in the system. Do not reintroduce a global loading card without re-running the CLS gate. | `[redesign-existing-projects: Strategic Omissions]` |
| A25 | P3 | `package.json:32`, `public/` | `react-icons` is still a dependency but imported by nothing. `public/assets/fonts/jetbrains-mono-500-medium.ttf`, `profile.webp`, `ip-sage-plate.webp`, `specsplit/architecture.svg`, and the non-WebP duplicates of converted images are not referenced by app code. `public/blackhole/` contains only `.DS_Store`. `portfolioMain.txt` is 802 KB and is now ignored by `.gitignore`. | List removal candidates for owner approval. Do not delete in this phase. The local harness and cache folders remain untracked and unignored. | `[redesign-existing-projects: Code Quality]` |
| A26 | P2 | `app/globals.css` (`hue-text`) | The current 65 percent hue text mix is 4.08:1 on light `void` and 3.85:1 on the light hue field for IP-Sage `#14b8a6`. OptFantasy and LomaVerse are lower. The Phase 2 prototype uses 50 percent light and 65 percent dark; every project hue passes, with LomaVerse as the worst at 4.65:1 on its hue field. | Implemented: `--hue-text-weight` is 50 percent light and 65 percent dark; `verify:contrast` now gates every project hue on `void`, `surface`, and its own hue field. | `[web-design-guidelines: Accessibility]`, `[ui-ux-pro-max: 6. Typography & Color]` |

## 4. Token inventory

### Color

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--void` | `#f2ece1` | `#060a11` | page field |
| `--surface` | `#fbf7ef` | `#0a1019` | nav, panels, inputs |
| `--surface-2` | `#f7f1e7` | `#0d1622` | defined, unused |
| `--ink` | `#121821` | `#f1f4f8` | primary text |
| `--ink-soft` | `#47515f` | `#a8b3c2` | reading prose |
| `--ink-faint` | `#515b69` | `#8a95a6` | labels, coordinates |
| `--line` | `rgba(18,24,33,0.10)` | `rgba(241,244,248,0.09)` | hairlines |
| `--line-strong` | `rgba(18,24,33,0.18)` | `rgba(241,244,248,0.18)` | active rules |
| `--wavelength` | `#ad1526` | `#ff5a4d` | accent, focus, one state at a time |
| `--field-blue` | `#5b7fa6` | `#17324f` | atmosphere and signal trace |
| `--field-teal` | `#2f7a72` | `#123c3a` | atmosphere and harmonic register |
| `--field-warm` | `#c98a3b` | `#c98a3b` | portrait glow and atmosphere wash |
| `--field-slate` | `#8a94aa` | `#2a3444` | defined, unused |

Project hues live in `data/projects.ts` and flow through `--hue`. They are
used at 7 percent for field tints and 45 to 65 percent for lines and text.

One-off literals outside the token system: OG image `#050505`, `#f5f7fa`,
`#ff2a2a`, `#687386`, `#a7afbf` (`app/opengraph-image.tsx:19-56`); favicon
`#050505`, `#f5f7fa`, `#ff2a2a` (`app/icon.svg`); resume print sheet
`#fbfaf6` (`app/resume/page.tsx:72`); playground fallback
`rgba(120,130,150)` if token parsing fails (`components/playground.tsx:93`).
The OG and print literals are deliberate constraints, but they are drift from
the current palette.

### Type

- Outfit for display and body, JetBrains Mono for labels, coordinates,
  metrics, and code. Fonts are loaded through `next/font/google`.
- Hero: `text-6xl md:text-8xl` in `components/hero.tsx:27`.
- Section titles: `text-3xl md:text-5xl` in `components/section-heading.tsx:55,87`.
- Reading prose: `.read` at 17 px mobile and 18 px desktop with a 68ch cap
  (`app/globals.css:163-173`).
- Labels: mono, 11 px, uppercase, 0.18 to 0.28em tracking.
- Numbers: `tabular-nums` on body and metric components.
- No `text-wrap: balance` or `text-pretty` anywhere.

### Spacing, radius, elevation, blur

- Container: `mx-auto max-w-6xl px-6`.
- Section padding: `py-20 md:py-28`; section separators are
  `border-t border-line`.
- Experience date rail: `180px minmax(0,1fr)`.
- No custom spacing scale; Tailwind's default scale is used directly.
- Zero border radius except the portrait (`rounded-full` in
  `components/portrait.tsx:13` and `components/hero-portrait.tsx`). The
  pipeline walkthrough explicitly uses `rounded-none`.
- No shadows or blur anywhere in app code. The only `shadow` is
  `box-shadow: none` in print (`app/globals.css:598`).
- Gradients exist only inside the `atmosphere:allow-begin` and
  `atmosphere:allow-end` block (`app/globals.css:288-444`).

### Z-index

| Layer | Value | Where |
| --- | --- | --- |
| Section content | 10 | hero, experience, section heading, contact, product stage |
| Decorative field | 0 | hero register and constellation |
| Main | 1 | `app/layout.tsx:129` |
| Sticky archive bar | 30 | `components/work-archive.tsx:34` |
| Mobile menu overlay | 40 | `components/nav.tsx:106` |
| Nav | 50 | `components/nav.tsx:44,47` |
| Scroll progress | 60 | `components/scroll-progress.tsx:17` |
| Shell actions | 65 | cookie banner, floating contact, go-top |
| Search | 70 | `components/site-search.tsx:83` |
| Confirm dialog | 80 | `app/contact/page.tsx:260` |
| Figure lightbox | 90 | `components/figure.tsx:131` |
| Skip link | 100 | `app/globals.css:140` |

This works, but it is a set of one-offs, not a scale. The repeated `z-[65]`
is the clearest sign that the shell needs a named layer token.

## 5. Accessibility

### Contrast

`bun run verify:contrast` measured 32 token pairs. All pass 4.5:1 in both
modes on `void`, `surface`, and the worst atmosphere composite.

| Mode | Pair | Range |
| --- | --- | --- |
| Light | ink | 15.16 to 16.68 |
| Light | ink-soft | 6.84 to 7.53 |
| Light | ink-faint | 5.86 to 6.44 |
| Light | wavelength | 6.13 to 6.75 |
| Light | atmosphere, ink-faint | 4.57 to 4.63 (tightest) |
| Light | atmosphere, wavelength | 4.78 to 4.85 |
| Dark | ink | 17.29 to 17.97 |
| Dark | ink-soft | 8.98 to 9.34 |
| Dark | ink-faint | 6.29 to 6.54 |
| Dark | wavelength | 6.20 to 6.44 |
| Dark | atmosphere, ink-faint | 4.78 to 5.15 |
| Dark | atmosphere, wavelength | 4.70 to 5.07 |

Focus-indicator contrast is separate and fails: `--line-strong` over
`--surface` is 1.46:1 light and 1.64:1 dark; `--line` is 1.22:1 and 1.24:1.
Text contrast is healthy; the input focus ring is not.

### Keyboard and focus

- Skip link works: first Tab focuses it, Enter sets `#main-content`, and the
  next Tab lands on "View work" inside `main`.
- Global `:focus-visible` is a 2px wavelength outline at 6.75:1 light and
  6.20:1 dark. Buttons and links keep it.
- Contact, work-archive, and site-search inputs remove it with
  `focus:outline-none` and rely on the low-contrast border change.
- Search and confirm dialogs both lose focus to the page when closed.
- The mobile menu, search, and floating contact expose `aria-expanded` without
  `aria-controls`.

### Landmarks and headings

- Every route has `header`, `nav`, `main` (`#main-content`), and `footer`.
  Routes with `PageHeader` have two `header` elements: the nav banner and the
  in-main page header. That is allowed, but the duplication is worth knowing.
- Every route has exactly one `h1`.
- `/work` skips h2 and goes h1 to h3.
- `/work/ip-sage` skips h3 and goes h2 to h4 in the pipeline stage.
- No unlabeled buttons or links were found in 184 observations.

### Forms and live state

- All visible fields have labels and appropriate autocomplete for name and
  email.
- Name, email, and message fields have no `name` attribute; the honeypot has
  `name="company"`.
- Success and error messages are not live regions.
- The FAQ uses `aria-expanded` but not `aria-controls`.
- The confirm dialog has `aria-modal` but does not inert the background.

### Motion and canvases

- Under reduced motion, atmosphere drift, constellation draw and signal,
  harmonic lines, and reveals all resolve to a static state. The Playground
  canvas is static (identical checksum after 800 ms). LomaVerse and IP-Sage
  render no canvas under reduced motion and show static fallbacks.
- The Playground canvas has an accessible name. The IP-Sage address-space
  canvas is inside an `aria-hidden`, pointer-events-none wrapper, so it is
  decorative by design. The LomaVerse canvas is inside a labeled
  `ProductStage` region; the canvas element itself measured no label.
- The LomaVerse rig's pointer interaction has no keyboard equivalent.

## 6. Performance baseline

Production build, fresh browser context, 1280 px, light theme, first load.
JS is the sum of encoded script bytes at the load event.

| Route | First-load JS | LCP | CLS | Long tasks |
| --- | --- | --- | --- | --- |
| `/` | 258.9 KB | 196 ms | 0.0009 (0.0010 after a scroll pass) | 0 |
| `/work` | 284.5 KB | 436 ms | 0.0000 | 0 |
| `/research` | 258.9 KB | 92 ms | 0.0000 | 0 |
| `/about` | 258.9 KB | 32 ms | 0.0000 | 0 |
| `/contact` | 260.7 KB | 100 ms | 0.0000 | 0 |
| `/work/ip-sage` | 518.2 KB | 76 ms | 0.0000 | 1 at 138 ms |
| `/playground` | 260.7 KB | 100 ms | 0.0053 | 0 |

- `/work/ip-sage` loads the 237 KB three/r3f chunk. `/work/lomaverse` does
  too (521.4 KB first load). The homepage does not load three. This matches
  the zero-canvas homepage invariant.
- A theme-toggle click produced a maximum event duration of 104 ms. This is a
  single-interaction baseline, not a full INP measurement.
- `bun run measure:bundle`: 27 chunks, 566.3 KB total gzip, 237.4 KB
  three/r3f.
- Next 16 does not print per-route JS sizes. The table above is the baseline
  to compare against the 15 percent growth budget.
- Known local-only failures: `/_vercel/insights/script.js` and
  `/_vercel/speed-insights/script.js` return 404 from `next start` and log
  three console errors per route. They resolve only on the Vercel platform.
  QA must whitelist these or serve stubs before asserting zero failed
  requests.
- Known upstream warning: `THREE.Clock` is emitted by `@react-three/fiber` on
  IP-Sage and LomaVerse (16 occurrences in the matrix). `AGENTS.md` records
  this as not ours to fix. QA must record it as an accepted exception, not
  filter it silently.
- WebGL driver warnings from headless Chromium on IP-Sage are environment
  noise, not site code.

### Repository gates

- `bun run build`: exit 0. 30 static pages generated. Routes: `/`,
  `/_not-found`, `/about`, `/api/contact`, `/contact`, `/icon.svg`,
  `/opengraph-image`, `/playground`, `/privacy`, `/research`, `/resume`,
  `/robots.txt`, `/sitemap.xml`, `/terms`, `/work`, `/work/[slug]` with 14
  project paths.
- `bun run lint`: 0 errors, 1 warning in `.opencode/plugins/graphify.js`, an
  untracked harness file. App code is clean.
- `bun run typecheck`: exit 0.
- `bun test`: 93 pass, 0 fail.
- `bun test tests/content-depth.test.ts`: 57 pass, 0 fail.
- `bun run verify:trope`: OK, 25 rendered routes and 7 data modules.
- `bun run verify:assets`: OK.
- `bun run verify:contrast`: OK, every gated text pair at or above 4.5:1.

## 7. Content discrepancies (do not fix)

These are restated for the owner. No data was changed.

1. Country-in-the-Middle is `year: "2024"` in `data/projects.ts:714`, while
   its paper block is `IMC '25` at `data/projects.ts:727` and
   `data/research.ts:36` says `IMC 2025 · lab paper`. The project year and the
   paper venue may be intentionally different, but the mismatch is visible.
2. `data/experience.ts:10-12` still says `Incoming Software Engineer` for
   `Jun 2026 - Present`; the current date is October 2026. The label may be
   stale.
3. `components/contact-section.tsx:64` says `Open to industry work.` while
   `data/site.ts:7` says `Ethernet switch software at Arista.` and
   `app/contact/page.tsx:18-19` says `Are you open to work? Yes.` The
   intended current status needs one answer.
4. The education course count is not a discrepancy in the current code.
   `data/education.ts` has 11 courses; `components/education-section.tsx:34`
   renders `education.courses.length`; `/about` maps all 11. The brief's
   "About shows 10 chips" is stale.
5. IP-Sage metrics (`238M`, `13.7K`, `87.0%`, `66%`) and the OperatorSage
   paper blurb (`46x faster`, `16% more accurate`, `150K+ IPv4`) use
   different bases. `data/projects.ts:11` already mentions 46x and 87.0%, and
   `data/research.ts:17` keeps the paper's own numbers. Do not merge or
   reconcile them.

## 8. Brief versus current code

The brief describes an earlier version of the site. These are the material
differences that affect Phase 2 and later.

- Stack and commands: the repo uses Bun, Next.js 16 App Router, React 19,
  Tailwind v4 CSS-first, Motion, and Lenis. There is no npm lockfile and no
  `tailwind.config.js`.
- Routes: the project archive is `/work`, not `/projects`. The nav label is
  "Projects", but every URL and the sitemap use `/work`. `/resume` exists.
- Nav: the current nav is a centered rectangular bar with zero radius, not a
  floating pill. The design spec makes zero radius a binding rule.
- Section 2.5 is dropped. It describes the `redesign` branch, not this
  baseline. The current findings are in Section 3.
- The current site already ships the observatory hero, constellation,
  atmosphere, harmonic register, optional piano sound, BibTeX citations,
  robots, sitemap, security headers, JSON-LD, and a static 1200x630 OG image.
  Phase 2 should not rebuild these from scratch.
- The current sound is a small five-note additive piano prototype, not the
  brief's leitmotif system. It has no declared tonic, no page map, no voice
  leading, no persistence, and no pitch-set tests. The current design spec
  explicitly says sound starts off in every session so no saved preference
  can autoplay. The brief's "state remembered" conflicts with that.
- The current design spec bans `app/loading.tsx` because it caused the
  measured homepage CLS failure. The brief's Phase 8 asks for a loading
  state. A global loading card must not be reintroduced without re-running
  the CLS gate.
- The current design spec bans gradients outside the marked atmosphere block,
  bans glass and shadows, and keeps zero radius. The brief's Phase 2 asks for
  a nebula mesh, grain, hover gradient borders, and a pill-like nav material.
  These need an explicit decision, not a silent override.
- The brief's palette A (violet, teal, gold) conflicts with the just-restored
  warm-paper and wavelength-red palette, and with
  `redesign-existing-projects`' warning against purple/blue AI gradients.
  Gate 2 resolved this: C1 Warm keeps the warm paper and blue-black base with
  a stronger wavelength red. Violet/teal/gold A is not shipped.
- The brief's four accents conflict with `redesign-existing-projects`'
  "pick one accent" rule. The current site keeps one accent plus project
  hues. C1 ships that model. C2 and C3 remain reference prototypes only.
- The brief's placeholder-cover item is stale: projects without a cover
  already render a designed `MetricPlate` from their own metrics, not a gray
  bar with a monogram (`components/project-cover.tsx:15-57`).
- "Observation archive" is not present in the current code. The homepage
  rail is `03 / PAPERS` (`components/research-section.tsx:8`).
- The canvas policy is current and tested: the homepage has no canvas; the
  only canvases are the Playground 2D field, the LomaVerse WebGL stage, and
  the IP-Sage address-space layer. The brief's Phase 4 constellation-as-
  network hero backdrop must not add a homepage canvas.

## 9. Passes and known exceptions

Passes:

- No horizontal overflow in 184 observations.
- One `h1` per route.
- No unlabeled buttons or links.
- No dev badge in production.
- No uncaught page errors or hydration errors.
- Reduced motion resolves all checked motion to a static state.
- Skip link transfers the next Tab into `main`.
- Anchor `#work` lands 8.25 px below the nav bottom.
- All 32 contrast pairs in `verify:contrast` pass.
- Homepage CLS remains under 0.05, including after a scroll pass.
- The homepage first-load bundle does not include the three/r3f chunk.
- Covers are loaded in both themes; no skeletons remain in the Work section.

Known exceptions:

- `THREE.Clock` deprecation from `@react-three/fiber` on IP-Sage and
  LomaVerse. Recorded in `AGENTS.md`. Not filtered.
- Vercel Analytics and Speed Insights scripts 404 under local `next start`.
  Platform-only. QA must account for them.
- Headless Chromium WebGL driver warnings on IP-Sage. Environment noise.
- The `home-work-*` screenshots were captured after
  `scrollIntoViewIfNeeded`, which does not honor `scroll-margin-top`; the
  apparent nav clipping in those images is an artifact. The real anchor test
  leaves 8.25 px of clearance.

## 10. Q1 corrections

A1 was fixed in `9f3c698`; A2 through A10 were fixed in `dec8b85`.

Verification against a fresh production build:

- Search panel: 384 px at 1280 and 343 px at 375, fully on-screen. The panel
  traps Tab, Escape returns focus to the trigger, and the trigger exposes
  `aria-expanded`, `aria-controls`, and a state-accurate label.
- Inputs: 2 px wavelength focus outline, 6.75:1 light and 6.20:1 dark. The
  contact name field, archive search, and site search all measured the ring.
- FAQ: button id and `aria-controls`; answer id, `role="region"`,
  `aria-labelledby`, and `hidden` when closed. Open and closed states both
  verified.
- Form status: persistent polite status and assertive alert regions. Mocked
  500 and 200 responses populated the correct region and returned focus to
  the submit button.
- Confirm dialog: the main content wrapper is inert and body scroll is
  locked; Tab stays in the dialog; Escape and send both return focus to the
  submit button; inert and scroll are restored. The shell nav and footer
  remain outside the inert wrapper; the focus trap prevents keyboard escape.
  This is a residual P3 for a future portal-based dialog.
- Canonical: all 23 routes have an absolute canonical URL on
  `https://samvrit.vercel.app`.
- OG image: all 23 routes have an `og:image`. Project details use the root
  `/opengraph-image` route explicitly.
- `color-scheme`: `light` and `dark` compute correctly, with no body-color
  change. Native controls and scrollbars now follow the theme.
- Heading order: `/work` is h1, h2, h3; `/work/ip-sage` is h1, h2, h3. No
  skipped levels.
- Overflow: none at 375 or 1280 on `/`, `/contact`, `/work`, or
  `/work/ip-sage`.
- Lint: 0 errors, 1 pre-existing warning in untracked
  `.opencode/plugins/graphify.js`. Typecheck: 0. Build: 0. Tests: 93 pass.
- `NEXT_PUBLIC_SITE_URL` is read with the confirmed fallback. The local
  `.env.example` edit is ignored by the repo's `.env.*` rule and was not
  committed. Decide whether to unignore it and track it.
- `portfolioMain.txt` is ignored by the dedicated `.gitignore` rule in
  `7c63bdd`, as requested. The file itself was not touched.

## 11. Gate 1 decisions received

1. Improve the working tree in place. Fix A1 first, then the P2 correctness
   items before visual work. Done.
2. Palette base C. Phase 2 builds C1, C2, and C3 prototypes for a gate
   choice. Outcome: C1 Warm selected and implemented; C2 and C3 are
   reference prototypes.
3. Sound off until clicked, remember the choice, never autoplay. Show the
   section 13.3 diff before committing it.
4. Motion 6, meaning-bearing only: traceroute packet, constellation twinkle,
   page transitions, scroll reveals, and key highlights tied to sound.
   Everything pauses offscreen and has a reduced-motion fallback.
5. Production domain `https://samvrit.vercel.app` via an environment variable.
6. Allow AI crawlers, keep the scroll-progress line, use the existing résumé
   PDF.
7. Keep no homepage canvas, no `app/loading.tsx`, and zero radius except the
   portrait. Gradients stay in the marked atmosphere block; placements are
   proposed in the Phase 2 prototype. No gradients behind body text.
8. Leave the content discrepancies unchanged and keep them in the report.

Phase 2 must load `brandkit`, `design-taste-frontend`, `apple-design`,
`pick-ui-library`, and `prototype`, and update the Skill Load Log. Loaded; see
`docs/SKILL_LOAD_LOG.md`.

## 12. Phase 2 implementation

C1 Warm is implemented in `app/globals.css`. The C1 dark atmosphere alphas
are 19, 10, 30, and 21 percent so the worst field composite stays at 4.70:1
for wavelength and 5.46:1 for ink-faint.

A26 is fixed with `--hue-text-weight` at 50 percent light and 65 percent dark.
`verify:contrast` now gates every project hue on `void`, `surface`, and its
own hue field. All pass; the worst is LomaVerse at 4.65:1 on its hue field.

The favicon and OG image use C1 colors and the `SS` mark. `.env.example` is
tracked with `NEXT_PUBLIC_SITE_URL`. No new UI library was added.

Numbering is implemented: the homepage rail is `03 / OBSERVATION` with the
title `Observation archive`, and About uses `03.1 Teaching` and
`03.2 Community`.
