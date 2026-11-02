# Design System - Color Pop

Status: DS-4 applied; DS-5 verification in progress
Date: 2026-11-01
Branch: `feat/ui/color-pop`
Scope: tokens, typography, layout, atmosphere, motion, article structure, evidence placement, and verification.
Source of truth: `design/tokens.ts`
Generator: `scripts/build-tokens.ts`
Prototype: `prototypes/design-system.html`
Contrast gate: `scripts/verify-contrast.ts`
Skill policy: Project Taste v2 only. The global taste copy is read but not used. `docs/MOTION.md` has been removed; motion rules live in this document.

## 0. Design read and decisions

Reading this as: an editorial-observatory portfolio design system for hiring managers, research collaborators, and systems engineers, with a warm-paper and blue-night language, leaning toward CSS-first tokens, Outfit and JetBrains Mono, and a token-bounded SVG atmosphere with a slow particle field.

Dials:

| Dial | Value | Reason |
| --- | --- | --- |
| `DESIGN_VARIANCE` | 7 | Keep the 6/6 hero, 3/9 rail, and full-width Experience section. |
| `MOTION_INTENSITY` | 6 | Dynamic is allowed. The ambient field drifts slowly; section variants add one local animated layer. |
| `VISUAL_DENSITY` | 4 | Editorial density. Evidence is not a dashboard. |

Round 1 decisions:

| # | Decision | Result |
| --- | --- | --- |
| 1 | Token naming | Rename `--wavelength` to `--accent` globally in DS-4. No alias. |
| 2 | Project accents | Add optional `projectAccent: { light, dark }`. Keep existing `hue` unchanged. Scope `--project-accent` to `/work/[slug]`. |
| 3 | Atmosphere | Use ultramarine as the primary field, keep teal and warm as low-alpha echoes, and add the warm counter-glow. |
| 4 | Reading face | Option A selected: Outfit throughout. Source Serif 4 was evaluated at 121,412 B initial (+48,704 B) and rejected by the owner after review. |
| 5 | Contrast scope | Meaningful graphics and focus at 3:1. Decorative hairlines stay exempt. Image aspects must be measured, not guessed. |
| 6 | Existing ornaments | Keep `HarmonicRegister`, `SignalTrace`, `SectionDivider`, and `CoordinateMarks` in the catalogue, two per page maximum. |
| 7 | Token architecture | Single TypeScript source, generated CSS, and the OG route imports the same source. No drift test, no duplicated literal sheet. |

## 1. Color

### 1.1 Three layers

Color is split into three layers. A layer may not borrow another layer's role.

| Layer | Token family | Use |
| --- | --- | --- |
| Neutrals | `--void`, `--surface`, `--surface-2`, `--ink`, `--ink-soft`, `--ink-faint`, `--line`, `--line-strong` | Page ground, plates, type, hairlines |
| Accent | `--accent`, `--accent-contrast` | Links, focus ring, scroll line, active nav, one key number per view |
| Atmosphere | `--atmosphere`, `--atmosphere-echo`, `--atmosphere-warm` | Hero and decorative artifacts only. Never text. |
| Project | `--project-accent` | `/work/[slug]` only. Not global. |
| Data ink | `--data-slate`, `--data-ochre`, `--data-sage` | Figure strokes, chart series, measurement marks |

### 1.2 Neutrals

| Token | Light | Dark |
| --- | --- | --- |
| `--void` | `#F4ECDF` | `#040A12` |
| `--surface` | `#FDF9F1` | `#08111D` |
| `--surface-2` | `#F7EFE2` | `#0B1623` |
| `--ink` | `#0F1722` | `#F5F8FC` |
| `--ink-soft` | `#3F4B5A` | `#B0BCCB` |
| `--ink-faint` | `#4B5766` | `#8C98AA` |
| `--line` | `rgba(15, 23, 34, 0.10)` | `rgba(245, 248, 252, 0.09)` |
| `--line-strong` | `rgba(15, 23, 34, 0.18)` | `rgba(245, 248, 252, 0.18)` |

The neutrals are today's values. They already pass. `--line` and `--line-strong` are decorative separators; they are not gated at 3:1 because they carry no information. Focus and meaningful graphics are gated.

### 1.3 Accent

| Token | Light | Dark |
| --- | --- | --- |
| `--accent` | `#B00F24` | `#FF4638` |
| `--accent-contrast` | `#F4ECDF` | `#040A12` |

Vermilion is the only global accent. It is used for:

- inline links and link underlines on hover;
- the focus ring;
- the scroll progress line;
- the active nav item;
- one key number or one key label per view.

It is not used for every heading, every metric, or every border. `--accent-contrast` is the text colour on a filled accent surface.

### 1.4 Atmosphere

| Token | Light | Dark |
| --- | --- | --- |
| `--atmosphere` | `#5B72D6` | `#2B3A9E` |
| `--atmosphere-echo` | `#6FB3A8` | `#0D4A44` |
| `--atmosphere-warm` | `#E0A45A` | `#D89A3F` |
| `--atmo-field-alpha` | 17% | 26% |
| `--atmo-echo-alpha` | 6% | 8% |
| `--atmo-warm-alpha` | 3% | 3% |
| `--atmo-contour-alpha` | 20% | 35% |
| `--atmo-halftone-alpha` | 4% | 6% |
| `--atmo-grain-alpha` | 4% | 2% |
| `--atmo-grid-alpha` | 3% | 4% |
| `--site-field-alpha` | 12% | 18% |
| `--site-echo-alpha` | 5% | 8% |
| `--site-warm-alpha` | 2% | 3% |
| `--site-particle-alpha` | 10% | 15% |

Ultramarine is the primary field. Teal and warm are retained as low-alpha echoes of the previous multi-hue atmosphere; the warm layer is the counter-glow. The contour stroke cap is 20% light and 35% dark. The field alphas are lower so text remains legible in the worst composite. The site-wide fixed field uses the lower `site-*` alphas; the section fields use the `atmo-*` alphas.

Rules:

- Atmosphere is never text.
- Section atmosphere never sits behind the article reading column, the Experience list, the research abstracts, or any body-text zone. A mask fades the field to `--void` before text begins.
- The site-wide ambient field is a fixed, low-alpha layer behind all content. The contrast gate measures the worst text composite over its field, echo, warm, and particle layers; the current worst is 4.62:1 in light and 4.71:1 in dark.
- The particle field is 60 deterministic dots in one slow group. It is decorative, reduced-motion static, and under 20 KB.
- The halftone, grain, and grid layers are decorative and masked away from text in the section variants.

### 1.5 Project accents

`--project-accent` is set by a generated class on project cards, the archive, the spotlight, and the `/work/[slug]` root. It carries category labels, card titles on hover, figure labels, links, and metric values. The existing `hue` values still drive the `hue-field`, `hue-line`, and `hue-text` classes.

| Project | Light | Dark |
| --- | --- | --- |
| SpecSplit | `#A24A1F` | `#E08A5A` |
| LomaVerse | `#4B3FA8` | `#A99CFF` |
| IP-Sage | `#0C6F61` | `#4FC2AE` |
| HoneyLLM | `#8A5A00` | `#D9A441` |
| Country-in-the-Middle | `#A3245F` | `#E06A9A` |
| OptFantasy | `#2F6B2F` | `#7FC77F` |
| All other projects | `--accent` | `--accent` |

IP-Sage is 2% darker than the brief's starting value (`#0E7466` to `#0C6F61`) because the original measured 4.40:1 on its own 7% field. The adjusted value measures 4.70:1 on the field and 5.17:1 on `--void`.

The existing `hue` values in `data/projects.ts` are unchanged. They continue to drive the hue field, hue line, and hue text classes. `projectAccent` is additive and now used on cards and detail pages.

### 1.6 Data ink

| Token | Light | Dark |
| --- | --- | --- |
| `--data-slate` | `#5B6B7F` | `#9DAEC4` |
| `--data-ochre` | `#8A5A00` | `#D9A441` |
| `--data-sage` | `#2F6B2F` | `#7FC77F` |

Data ink is for figures: chart strokes, series, axes, and measurement marks. It is not a page accent. Every data ink value passes 4.5:1 as text and 3:1 as a graphic on `--void` and `--surface`.

### 1.7 Contrast result

`bun scripts/verify-contrast.ts` measures 178 pairs:

- text at 4.5:1;
- graphics and focus at 3:1;
- accent over the worst section-atmosphere composite;
- accent over the worst site-wide atmosphere and particle composite;
- every project accent on `--void`, `--surface`, and its own 7% field;
- the existing project hue text on `--void`, `--surface`, and `--hue-field`.

Current result:

```
OK: 178 pairs pass (text 4.5:1, graphics 3:1)
```

Key rows:

| Pair | Light | Dark |
| --- | --- | --- |
| `ink` on `void` | 15.36 | 18.65 |
| `ink-soft` on `void` | 7.57 | 10.31 |
| `ink-faint` on `void` | 6.27 | 6.80 |
| `accent` on `void` | 6.09 | 5.85 |
| `accent-contrast` on `accent` | 6.09 | 5.85 |
| focus `accent` on `surface` | 6.80 | 5.58 |
| worst section atmosphere text | 4.78 (accent on void) | 4.58 (accent on surface) |
| worst site atmosphere text | 4.62 (accent on void) | 4.71 (accent on void) |
| IP-Sage on project field | 4.70 | 8.39 |

The current CSS and the TypeScript token source both pass 178 pairs. The legacy `--wavelength` token has been removed.

### 1.8 Image treatment

- Matplotlib PNGs with white backgrounds use `mix-blend-mode: multiply` on paper. White becomes paper; the black plot marks remain.
- In dark mode, the same figure sits on `--figure-plate` (`#F2ECE1`) with a hairline. It is not inverted.
- Photos, screenshots, and renders are not multiplied. They use their own plate and `object-cover` or `object-contain` as declared by `coverFit` or `figure.fit`.
- Cover images share the 16:10 frame. A cover with `coverFit: "contain"` letterboxes on the plate; a cover with `coverFit: "cover"` crops. Charts never use `cover`.
- Logos use the shared `LogoTile`. Company logos use bare mode; club logos use the tiled mode.

## 2. Typography

### 2.1 Loaded fonts today

| Family | Axes | Subsets in the build | Latin file | Total files |
| --- | --- | --- | --- | --- |
| Outfit | 100-900 variable | latin, latin-ext | 32,228 B | 46,988 B |
| JetBrains Mono | 100-800 variable | latin, latin-ext, cyrillic, cyrillic-ext, greek, vietnamese | 40,480 B | 86,320 B |

Routes preload only the two latin files: 72,708 B. `font-display: swap`. Both use the Next.js font loader and Arial fallbacks with size-adjust.

### 2.2 Reading face

Option A is selected. Outfit carries display, headings, UI, and article body. JetBrains Mono carries labels, coordinates, metrics, and code. Initial font transfer is 72,708 B.

Option B was evaluated with Source Serif 4 static weight 400, latin subset, 48,704 B under the SIL Open Font License 1.1. It raised the initial transfer to 121,412 B (+48,704 B). The owner reviewed both and chose the single-family voice; Source Serif is not loaded and the local prototype asset has been removed.

### 2.3 Roles

| Role | Family | Size | Leading | Tracking | Measure | Use |
| --- | --- | --- | --- | --- | --- | --- |
| Display | Outfit 600 | `clamp(3.5rem, 7vw, 6rem)` | 1.02 | -0.03em | 2 lines max | Hero name |
| H1 | Outfit 600 | `clamp(2.25rem, 4.5vw, 3.75rem)` | 1.05 | -0.03em | 2 lines max | Page and project title |
| H2 | Outfit 600 | `clamp(1.875rem, 3.2vw, 3rem)` | 1.08 | -0.025em | 2 lines max | Section title |
| H3 | Outfit 600 | `clamp(1.25rem, 2vw, 1.5rem)` | 1.2 | -0.01em | 2 lines max | Card and subsection title |
| H4 | Outfit 600 | 1.125rem | 1.3 | 0 | 2 lines max | Small subsection |
| Dek | Outfit 400 | `clamp(1.0625rem, 1.4vw, 1.25rem)` | 1.6 | 0 | 60ch | Page and project description |
| Article body | Outfit 400 | 17px mobile, 18px desktop | 1.75 | 0 | 68ch | `.read` prose |
| UI body | Outfit 400 | 1rem | 1.5 | 0 | 65ch | Forms, cards, nav |
| Caption | Outfit 400 | 0.875rem | 1.5 | 0 | 70ch | Figure captions, sources |
| Mono label | JetBrains Mono 500 | 0.6875rem | 1.4 | 0.18em, uppercase | 1 line | Coordinates, rail labels, Fig. N |
| Stat numeral | JetBrains Mono 500 | `clamp(1.75rem, 4vw, 2.75rem)` | 1.0 | 0.02em, tabular | 1 line | Metric values |

Rules:

- `text-wrap: balance` on display through H3; `text-wrap: pretty` on paragraphs.
- `font-variant-numeric: tabular-nums` on stats, tables, and metrics.
- Article measure stays between 60 and 70 characters. The current `.read` cap is 68ch.
- Outfit carries the reading role. There is no second body face.
- No mixed-family emphasis inside a headline. Use weight or italic in the same family.
- Italic display words with descenders need leading 1.1 and a 1px bottom reserve.

## 3. Layout and bounding boxes

### 3.1 Breakpoints and containers

| Name | Width | Use |
| --- | --- | --- |
| `sm` | 640px | Large phone |
| `md` | 768px | Tablet |
| `lg` | 1024px | Desktop rail |
| `xl` | 1280px | Wide desktop |
| `2xl` | 1536px | Very wide |

| Container | Width | Use |
| --- | --- | --- |
| Page | 72rem / 1152px | Nav, sections, footer |
| Wide breakout | 90rem / 1440px | Figures and edge-to-edge artifacts |
| Article | 42.5rem / 680px | Project facts, research abstract |
| Reading measure | 68ch | `.read` prose |
| Figure | 47.5rem / 760px | Case-study figure frame |
| Hero copy | 6 of 12 columns | Copy |
| Hero portrait | 6 of 12 columns | Portrait |

Gutters are 24px. The page uses one container: `mx-auto max-w-6xl px-6`. Wide and full-bleed elements break out of the container only when the content is a figure or an atmosphere artifact.

### 3.2 Rail

The homepage section rail is `3 / 9` at `lg`: a sticky mono label and ornament in the first three columns, content in the remaining nine. Experience is the one full-width section with its own date rail at `180px minmax(0, 1fr)`.

### 3.3 Spacing and rhythm

The scale is 4px based:

| Token | Value |
| --- | --- |
| `--space-1` | 4px |
| `--space-2` | 8px |
| `--space-3` | 12px |
| `--space-4` | 16px |
| `--space-5` | 20px |
| `--space-6` | 24px |
| `--space-8` | 32px |
| `--space-10` | 40px |
| `--space-12` | 48px |
| `--space-16` | 64px |
| `--space-20` | 80px |
| `--space-24` | 96px |
| `--space-28` | 112px |
| `--space-32` | 128px |

Sections use 80px mobile and 112px desktop, separated by a 1px `--line` border. The section gap is always larger than any gap inside a section.

### 3.4 Hairlines, radius, z-index

- Hairline: 1px. `--line` for quiet rules, `--line-strong` for structural edges and focus-adjacent boundaries.
- Radius: 0 everywhere. The portrait is the only circle, at 50%.
- Touch targets: 44px minimum.
- Z-index scale:

| Layer | Value |
| --- | --- |
| Atmosphere | 0 |
| Content | 10 |
| Sticky archive bar | 30 |
| Mobile menu | 40 |
| Nav | 50 |
| Scroll progress | 60 |
| Shell actions | 65 |
| Search | 70 |
| Confirm dialog | 80 |
| Figure lightbox | 90 |
| Skip link | 100 |

### 3.5 Figure frame

The figure frame is one component with three aspect modes:

| Mode | Ratio | Use |
| --- | --- | --- |
| `16:10` | 1.6 | Covers and new figures without an intrinsic ratio |
| `4:3` | 1.333 | Square-ish UI shots and crops where cropping is acceptable |
| `free` | Intrinsic | Existing charts and screenshots. No forced crop. |

The frame:

- outer hairline on `--line`;
- `--figure-plate` plate;
- inner padding 12px mobile and 16px desktop;
- image inside the padding, `object-contain` for charts and `object-cover` for photos;
- caption below the frame, outside the plate;
- `Fig. N` mono label above the caption;
- optional corner crop marks on the plate corners;
- lightbox at 94vw, max 1400px, with a hairline caption bar.

Measured image aspects in the current content:

| Cluster | Range | Examples |
| --- | --- | --- |
| Portrait | 0.338-0.709 | LomaVerse UI, SpecSplit token chart, Psyches shots |
| Square | 1.000 | Logos, portrait |
| 4:3-ish | 1.041-1.500 | PAP shots, SpecSplit acceptance heatmap |
| 16:10-ish | 1.584-1.721 | OptFantasy frontier, LomaVerse 2D, HoneyLLM shots |
| 16:9-ish | 1.750-1.902 | SpecSplit tpot, GPU delay, HoneyLLM system design |
| 2:1 | 2.000-2.154 | OptFantasy method cover, CS1 workflow |
| Panoramic | 2.498-7.150 | Club wordmark, LomaVerse cover, IP-Sage cover, GPU matrices, research strips |

Consequences:

- Charts and screenshots use `free` and `contain`. The 16:10 frame is for covers and new figures only.
- The existing `figure-optics` test measures the button box. Adding inner padding changes that box. DS-4 updates the test to measure the image, not the padded button.
- Covers use the 16:10 frame and keep `coverFit`. A 3.48:1 cover with `contain` letterboxes; a 2.81:1 cover with `cover` crops. Neither is forced into a chart frame.

### 3.6 Logo tile

- Default tile: 48px square, 8px padding, hairline `--logo-border`, `--logo-plate`.
- Large tile: 64px square, same padding.
- Company logos: bare mode, 32-40px, no plate or border.
- Club logos: tiled mode, 48px square, zero radius.
- All logo images use `object-contain`.

### 3.7 Table, callout, focus

- Table: mono 11px uppercase header, 16px UI body, 1px row separators, tabular numerals, no zebra striping, caption above, horizontal scroll wrapper on mobile.
- Callout: hairline frame, `--surface` plate, 16-24px padding, mono label. No coloured left stripe.
- Focus: 2px `--accent` outline, 2px offset, radius 0.
- Selection: `--accent` at 22% behind `--ink`.

### 3.8 Elevation

None. No shadows, no glass, no backdrop blur, no floating cards. Depth comes from hairlines and the step from `--void` to `--surface` and `--surface-2`.

## 4. Motion

Motion is dynamic, but it obeys these tokens and rules. The old `docs/MOTION.md` has been removed; this document is the motion source.

| Token | Value | Use |
| --- | --- | --- |
| `--dur-micro` | 160ms | Press, hover, colour |
| `--dur-ui` | 260ms | Menus, dialogs, state changes |
| `--dur-page` | 320ms | Route transition |
| `--dur-reveal` | 320ms | Scroll reveal |
| `--dur-atmo` | 75s | Atmosphere drift |
| `--ease-out` | `cubic-bezier(0.23, 1, 0.32, 1)` | Entrances, exits, draws |
| `--ease-in-out` | `cubic-bezier(0.77, 0, 0.175, 1)` | On-screen movement |
| `--ease-drawer` | `cubic-bezier(0.32, 0.72, 0, 1)` | Drawers and sheets |
| `--ease-atmo` | `linear` | Constant atmosphere drift |

Rules:

- Animate `transform`, `opacity`, or `clip-path` only.
- No `scale(0)` entrances. Start at `scale(0.95)` with opacity 0 when a scale is needed.
- Hover motion is gated behind `@media (hover: hover) and (pointer: fine)`.
- UI durations stay at or under 320ms. The page transition is 320ms. The old 550ms reveal is retired.
- No layout-shifting animation. No scroll hijacking. Lenis remains smoothing only.
- One animated atmosphere layer in view at a time. The other layers are static.
- Atmosphere drift pauses offscreen and when the tab is hidden.
- `prefers-reduced-motion: reduce` makes every atmosphere artifact static, removes the drift, and keeps content visible.
- The portrait remains the LCP element. Atmosphere layers are absolutely positioned and add no layout shift.

## 5. Atmosphere

### 5.1 Component

One server-rendered component:

```tsx
<Atmosphere variant="hero" | "article" | "footer" | "og" />
```

It renders an `aria-hidden`, `pointer-events: none`, absolutely positioned stack behind content. It uses `contain: paint`. It never wraps content and never creates a hit target.

### 5.2 Artifact catalogue

| Artifact | Variant | Budget | Motion |
| --- | --- | --- | --- |
| Flowing contour waves | hero, og | 2 layers max, 5 paths per layer, under 20 KB | 75s linear transform drift on hero; static on og |
| Flowing gradient field | ambient, hero, article, footer, og | 3 radial layers: ultramarine, teal echo, warm counter-glow | 75s drift on article, 120s on ambient; static elsewhere |
| Flowing particle field | ambient | 60 deterministic dots, under 20 KB | 90s linear drift; static under reduced motion |
| Halftone fade | article, footer | radial-gradient dot grid masked by a linear gradient | static |
| Grain | all | inline SVG `feTurbulence` at 4% light and 2% dark | static |
| Registration marks | hero, article, og | `CoordinateMarks` plus corner crop marks | static |
| Existing line art | article, footer | `HarmonicRegister`, `SignalTrace`, `SectionDivider` | draw once or static; two per page maximum |

### 5.3 Variant mapping

| Variant | Where | Animated layer |
| --- | --- | --- |
| `ambient` | Fixed site-wide backdrop in the root layout | Gradient drift and particle drift |
| `hero` | Homepage hero | Contour drift |
| `article` | Project detail header, research article header, homepage rail sections | Gradient field drift |
| `footer` | Footer and contact close | None |
| `og` | Open Graph art recipe | None |

### 5.4 Masking and safety

- Section atmosphere is masked to `--void` before the article reading column, Experience list, research abstracts, and any body-text zone.
- The site-wide ambient field is fixed behind the content wrapper. It uses the lower `site-*` alphas and the particle layer, and the text gate covers the worst composite.
- Contour, halftone, grain, and grid layers in the section variants are decorative and masked away from text.
- No canvas on the homepage.
- No layout shift: every layer is absolutely or fixed positioned and the component has no intrinsic height.
- The portrait keeps `priority` and remains the LCP element.

## 6. Verification

### 6.1 Token generation

`design/tokens.ts` is the single source. `scripts/build-tokens.ts` writes a marked block into `app/globals.css`. The prototype uses the standalone output from the same source:

```bash
bun run build:tokens
bun scripts/build-tokens.ts --out prototypes/design-system.tokens.css --standalone
```

The generated block contains all light, dark, shared, and project-accent tokens. No component may declare a raw colour literal outside the token file.

### 6.2 Contrast

```bash
bun scripts/verify-contrast.ts --tokens
bun scripts/verify-contrast.ts
```

The first command gates the current generated CSS. The second gates the TypeScript token source directly. The current CSS and the candidate source both pass 178 pairs.

### 6.3 Token literal gate

`scripts/verify-tokens.ts` is active and wired to `bun run verify:tokens`:

- fails on any raw colour literal in `components/`, `app/`, or `lib/`;
- allows the token source (`design/tokens.ts`), the generated token block, `data/projects.ts` project accents, and SVG assets;
- runs `build-tokens --check` so a stale generated block fails;
- keeps the OG route literal-free by importing `design/tokens.ts`.

### 6.4 Assets and content

```bash
bun run verify:assets
bun test tests/content-depth.test.ts
```

`verify:assets` checks cover `coverFit`, figure dimensions, and the four LomaVerse presets. The article-structure test enforces prose depth, interleaved evidence, no end-of-article image dump, and no repeated headline metric. The content-depth test keeps every project traceable.

### 6.5 Build and browser

DS-4 runs:

```bash
bun run build
bun run lint
bun run typecheck
bun run verify:trope
bun run verify:contrast
bun run verify:tokens
bun run verify:assets
bun test
```

DS-5 runs the Playwright matrix: Home, `/work`, one article, Research, About, Contact, Playground, 404, in light and dark, at 375, 768, 1280, and 1920. Assertions: no horizontal overflow, no console errors, CLS under 0.05, no atmosphere long tasks, reduced-motion fallback present.

Live page checks completed:

- 60 particle nodes in the fixed ambient layer.
- `.read` computes to Outfit, 17px mobile and 18px desktop.
- SpecSplit shows 74.6 once, in the product-stage readout.
- Figure captions render as separate label, caption, and source lines.
- No horizontal overflow on Home, `/work`, `/work/specsplit`, Research, About, Contact, or Playground.
- Transparent PACE and CSE logos; originals retained.
- Production matrix: 7 routes × 2 themes × 4 widths = 56 checks, 0 failures, max CLS 0.0334.
- Production build: 30 pages, clean. Bundle 589,023 B gz across 25 chunks, +12,690 B gz over the 576,333 B baseline; the three/r3f chunk is unchanged at 237,449 B.

## 7. DS-A evidence and DS-4 results

| Item | Value |
| --- | --- |
| Prototype | `prototypes/design-system.html` |
| Token file | `prototypes/design-system.tokens.css` (generated from `design/tokens.ts`) |
| DS-A screenshots | `.review/design-system/` at 375 and 1280, light and dark, plus `#type`, `#figures`, and `#atmosphere` crops |
| Live screenshots | `.review/site-after/` after a scroll-reveal pass |
| Contrast | 178 pairs pass; worst section atmosphere 4.58:1; worst site atmosphere 4.62:1 |
| Font cost | 72,708 B initial, Option A |
| Rejected option | Source Serif 4 at 121,412 B (+48,704 B); evaluated, not loaded |
| Atmosphere frame time | 16.67 ms average, 16.7-16.8 ms p95, 16.8 ms max at 375 and 1280 |
| Atmosphere animations | `ds-atmosphere-contour`, `ds-atmosphere-drift`, and particle drift active; all `none` under reduced motion |
| CLS | 0 at 375; 0.0001 at 1280 |
| Overflow | 0 px at 375 and 1280 |
| Console | No errors |
| Unit and content tests | 143 pass across 10 files |
| Playwright | Full dev suite 138/139, one transient dev-server session failure; the failing responsive spec passed alone. The two OptFantasy failures were fixed and 15/15 affected tests passed. |
| Production matrix | 56/56 checks, max CLS 0.0334 |
| Production build | 30 pages; bundle 589,023 B gz, +12,690 B over baseline |

The `.light` class is a style-guide and QA reset, not a page mode. It exists so the token panels can show light and dark side by side. Pages still choose one theme.

## 8. Post-gate decisions applied

- Reading face: Option A, Outfit throughout. Source Serif 4 reverted.
- Accent use broadened: project accents on cards, archive, spotlight, figure labels, detail links, and metrics.
- Site-wide fixed ambient field with 60 particles and a slow drift.
- Articles expanded, figures interleaved, end galleries removed, headline metrics no longer repeated.
- Transparent PACE and CSE instructional logos; originals retained.
- New unit tests for token generation, project accents, reading face, particles, article depth, image interleaving, and metric repetition.
- `docs/MOTION.md` removed.
- Reveal duration reduced to 320ms.

## 9. DS-4 applied

- Renamed `--wavelength` to `--accent`; no alias.
- Generated the token block into `app/globals.css`; mapped `@theme inline` colours.
- Added `projectAccent` classes to project cards and `/work/[slug]`.
- Replaced `AmbientField` with `Atmosphere` and mounted hero, article, footer, and ambient variants.
- Applied the type roles and reduced the reveal to 320ms.
- Applied the figure frame, cover frame, focus ring, and figure caption roles.
- Added `scripts/verify-tokens.ts`, `build:tokens`, `verify:tokens`, and `verify:contrast:tokens`.
- Updated the affected Playwright tests: atmosphere variants, figure-optics plate measurement, hue/project-accent selectors, and OptFantasy visual coverage.
- Removed `docs/MOTION.md`.
- Transparent instructional logo copies added; the original PNGs remain in `public/assets/companies/`.
