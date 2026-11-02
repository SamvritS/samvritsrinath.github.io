# AGENTS.md

Guidance for AI coding agents working in this repository.

## Commands

- `bun run dev` - Next.js dev server (Turbopack), http://localhost:3000
- `bun run build` - production build (also runs TypeScript)
- `bun run lint` - ESLint (flat config)
- `bun run typecheck` - `tsc --noEmit`
- `bun test` - Node tests; `tests/e2e/**` is ignored through `bunfig.toml`
- `bunx playwright test` - E2E (workers: 1, `bun run dev` webServer)
- `bun run verify:trope` - style, copy, critical-path, and removed-runtime gates
- `bun run verify:assets` - asset existence and figure dimensions
- `bun run verify:contrast` - token contrast pairs
- `bun run measure:bundle` - advisory bundle report, not a gate

Run `bun run lint` and `bun run typecheck` after any code change. Run
`verify:assets` and `bun test tests/content-depth.test.ts` after touching
`data/`.

## Conventions

- Server Components by default. `"use client"` is reserved for interactivity:
  `nav`, `theme-toggle`, `site-search`, `cookie-banner`, `reveal`, `hero-titles`,
  `citation-control`, scroll progress, go-to-top, floating contact, the contact
  form, `project-cover`, `figure`, the demos, and the SVG visuals.
- Brand icons (GitHub, LinkedIn) are inline SVGs in `components/icons.tsx`.
  Do not add a brand-icon package.
- TypeScript strict. Type everything in `lib/types.ts`; content lives in
  `data/`, one file per domain, strongly typed.
- Tailwind v4 is CSS-first. Theme tokens are CSS variables in
  `app/globals.css` mapped via `@theme inline`. Do not add
  `tailwind.config.js`.
- Dark mode is a `.dark` class on `<html>`, toggled by `theme-toggle`. The
  no-FOUC init script lives in `app/layout.tsx` and runs during parse.
- react-hooks and react/no-unescaped-entities rules are strict. Do not call
  `setState` inside effects. Escape apostrophes (`&apos;`) in JSX text.
- All content images go through `next/image` with `width` and `height` props.
  Store raster assets as WebP. Paths in data are relative to `public/`
  (for example `assets/projects/<slug>/<file>.webp`).
- Atmosphere is centralized. Gradients and blur live only inside the
  `atmosphere:allow-begin` block in `app/globals.css`; components consume the
  `.atmosphere-*`, `.field-*`, and `.hero-portrait*` classes. Gradient
  utilities, glass, shadows, giant orbs, decorative star fields, fake
  diagrams, and raw colour literals stay banned. `scripts/verify-tropes.sh`
  enforces the distinction.

### Comment policy

Do not add comments that narrate implementation or describe JSX structure. Do
not praise or justify code with comments. No TODO/FIXME comments unless
explicitly requested.

Add a comment only when it explains a non-obvious constraint:

- a technical constraint or workaround
- a mathematical or algorithmic idea
- an accessibility requirement
- an external API or platform constraint

Prefer expressive names and types over comments. When modifying a component
for visual reasons, do not rewrite unrelated comments. Keep the diff scoped
to the requested change.

## Design system

- The tokens are `--void`, `--surface`, `--surface-2`, `--ink`, `--ink-soft`,
  `--ink-faint`, `--line`, `--line-strong`, and `--wavelength`. Light is warm
  paper (`#f2ece1`); dark is blue-toned near-black (`#060a11`). The accent is
  `#ad1526` in light and `#ff5a4d` in dark. Atmosphere adds `--field-blue`,
  `--field-teal`, `--field-warm`, `--field-slate`, and the `--atmo-*` alpha
  tokens.
- `scripts/verify-contrast.ts` gates the ink family and wavelength against
  void, surface, and the worst atmospheric field composite in both modes at
  4.5:1. The atmosphere alphas are tokens, so a stronger field fails the gate
  instead of silently lowering a label.
- Outfit for display and body. JetBrains Mono for labels, coordinates,
  metrics, and code. Reading prose uses `.read` at 17px mobile and 18px
  desktop with a 68ch cap. Numeric values are `tabular-nums`.
- One container: `mx-auto max-w-6xl px-6`. Sections are separated by
  `border-t border-line`, not cards. Homepage section headers use
  `SectionHeading` in `rail` mode: a sticky mono label in the first three
  columns and content in the remaining nine. Experience is the one full-width
  exception with its own header and date rail.
- `PageHeader` (`components/page-header.tsx`) is the shared h1 header for
  `/work`, `/research`, `/about`, `/contact`, and `/playground`. It renders
  `data-testid="page-header"` and carries the route index, kicker, title,
  description, and observer coordinate.
- Project hue is a 7 percent field tint (`hue-field`) or a line/text accent
  (`hue-line`, `hue-text`), never a saturated panel. Project hues stay in
  `data/projects.ts` and flow through `--hue`.
- Zero border radius except the portrait. The portrait appears in the hero
  and on `/about`; it is the one circular element on the site.
- The hero is copy 6 / portrait 6 on `lg`. The portrait is a plain circular
  image with no orbit, register, or constellation; `HeroPortrait` carries the
  only `priority` image.
- Company logos use `LogoTile` in bare mode at a larger size, with no plate or
  border. Club logos use the tiled mode: square, zero radius, a hairline
  border, and a light plate in dark mode. Paper links use the Phosphor
  `FileText` glyph.
- The Experience section is the one full-width homepage section: a company
  header, then a `180px minmax(0,1fr)` grid with the date in the first column
  and the role, bullets, and technologies in the second. It stacks below `md`
  and is not pushed into the `SectionHeading` rail.
- Motion is `motion/react` plus Lenis. Reveals run once and translate 22px
  over 550ms. Hover changes colour, border, underline, or at most a 1px
  translate. No scroll hijacking and no larger hover transforms.
  `prefers-reduced-motion` makes reveals instant and stops the LomaVerse
  scene.
- `NetworkConstellation` (`components/observatory/network-constellation.tsx`)
  is a server-rendered SVG. It draws real project nodes and technology edges
  from `data/constellation.ts`. It is no longer mounted on the homepage after
  R1.1 and is retained as a removal candidate; CSS still owns the edge draw
  and the one signal pass, and there is no canvas and no client JS.
- The homepage invariant is zero canvases and zero product stages.
  `tests/e2e/network-observatory.spec.ts` and `tests/e2e/observatory.spec.ts`
  guard it. Outside `/playground`'s 2D particle canvas, the only canvases on
  the site are behind lazy boundaries on `/work/lomaverse` and `/work/ip-sage`.

## Data model

- `data/projects.ts`: `Project` entries. `featured` plus `spotlight` control
  the homepage lead. Every project generates a `/work/[slug]` page through
  `generateStaticParams` in `app/work/[slug]/page.tsx`.
- `ContentSection[]` (`prose`/`visual`/`figure`/`gallery`/`paper`/`metrics`/
  `links`/`system`/`implementation`/`evidence`) drives each case study.
  `Figure` carries intrinsic `width`/`height` plus `fit` (`contain` charts,
  `cover` UI shots); read dimensions with `sips`, never guess them.
- Project covers carry `coverFit` (`contain` charts/diagrams, `cover`
  photos/renders). `verify:assets` fails on covers wider than 2.4:1 with
  `coverFit` unset. Projects without a cover render a MetricPlate from their
  own metrics.
- Every project sets `problem`, `contribution[]`, `status`, `role`, and
  optional `team`. `ProjectCard` takes `orientation` (`stack` in archive
  cells, `row` for the lead card).
- `data/constellation.ts` is the retained project graph. A node names a real
  project slug and displays that project's own metric verbatim.
  An edge names a technology that appears in both endpoints'
  `technologies` arrays. `tests/constellation.test.ts` checks the graph
  against `data/projects.ts`.
- `components/demos/nbody-core.ts` is the ONLY integrator. Pure
  velocity-Verlet, no React, no three, no DOM. `lomaverse-sim.tsx` imports it
  rather than declaring a copy. It backs the LomaVerse case study only.
- `public/assets/projects/lomaverse/presets.json` carries the four N-body
  configurations the case study documents. Every body carries `provenance`;
  `verify:assets` enforces four entries in case-study order, finite 3-number
  position and velocity, a mass, and non-empty provenance. The seeded bodies
  orbit a fixed origin, not a pinned barycentre: linear centre-of-mass drift
  is a frame property, not an instability.
- Regenerate presets with `bun scripts/build-lomaverse-presets.ts`. It refuses
  to write a non-finite or escaping seed.
- The LomaVerse demo is the only full WebGL simulation. `/work/ip-sage` also
  mounts its address-space layer and product stage behind a lazy boundary.
  Both are absent without WebGL and inert under reduced motion.
- The sim's canvas wrapper is `lomaverse-rig`, carrying `data-az`, `data-el`,
  `data-trail-samples`, and `aria-pressed`. Assert camera and pin state from
  those attributes, never from pixels. `lomaverse-hover` is the mono body
  readout in the control rail. The rig is hand-rolled: no OrbitControls, no
  drei, no wheel handling. Pointer input must invalidate the demand frameloop
  or the rig dies while paused.
- Never hand a CSS custom property to a three material directly. Tailwind's
  optimizer emits `rgba()` tokens as 8-digit hex, `THREE.Color` parses only
  `#rgb`/`#rrggbb`, and an unparsed colour warns once and leaves the material
  white. Read tokens through `swatch()` in
  `components/demos/lomaverse-sim.tsx` and fold its alpha into material
  opacity; three has no alpha channel.
- `THREE.Clock: This module has been deprecated` comes from
  `@react-three/fiber`, which constructs one per Canvas. It is not ours to
  fix. Do not filter console warnings to hide it, and do not "fix" it by
  reading `THREE.Timer` in app code.
- JSON-LD goes in `body` with `id="json-ld"`, never in `head`. An extension
  that prepends nodes to `head` shifts every positional inline script and
  breaks hydration. `tests/e2e/hydration.spec.ts` guards both halves.
- Tech logos are local (`components/tech-icon-glyphs.ts`), extracted from
  react-icons 5.7 and verified against what the package renders.
  `react-icons` is still in `package.json` and imported by nothing; removing
  it is the owner's call.
- Depth gates: `bun run verify:assets` and
  `bun test tests/content-depth.test.ts` (identity fields, section table,
  traceable metrics, clean copy). Run both after touching `data/`.
- Visuals: `data/projects.ts` references curated visuals by `VisualId`
  (for example `visual: "ownership-pipeline"`), resolved in
  `components/visuals/registry.tsx`. Shared SVG primitives live in
  `components/visuals/primitives.tsx`. Each composition has its own geometry;
  never force a project into a generic box-and-arrow renderer.
- Research projects expose a first-class `paper` (`{ title, venue, year,
  href }`) rendered through `PaperLink` in the case-study header and a
  "Primary sources" block at the end. A `paper` section can also sit
  mid-narrative. Never embed PDFs inline.
- Homepage and `/research` share `components/research-archive.tsx`. Area
  titles render as `h3` on the homepage and `h2` on `/research`. Papers keep
  venue, year, title, authors, abstract, tags, a Cite control, and a PDF or
  arXiv link.
- `data/research.ts` papers carry a structured `citation`. `lib/bibtex.ts`
  serializes it, escapes text fields, leaves DOI/URL/eprint raw, and rejects
  bad keys or years. `tests/unit/bibtex.test.ts` and
  `tests/e2e/citations.spec.ts` gate it. The two anonymized IMC PDFs use
  `@misc` with no author list; do not invent one.
- Edit data files, not page components, to change content.

## Known conditions

- **The homepage CLS failure is fixed, not relaxed.** Measured 2026-09-26 on a
  cold cache, the CLS gate read **0.1931**, sourced by `FOOTER.relative`.
  The cause was `app/loading.tsx`: the prerendered `index.html` shipped a
  314px "Loading" card in `<main>` and materialised the real page after
  hydration. Removing the file puts the real content directly inside `<main>`.
  The measured gate is green, and `CLS_MAX` stays at 0.1. Any spec that
  navigates to `/` and measures DOM should still wait for the streamed
  sections rather than read exactly at the load event.
- **The old long-task attribution was wrong.** A trace on 2026-09-28 showed
  the largest task on the homepage was not WebGL but `react-icons/si`, a
  5.2MB index module parsed for 33 brand marks. Brand icons are now local in
  `components/icons.tsx`, and no homepage section mounts a canvas. The
  remaining first-load work is ordinary bundle and hydration cost. Measure it
  with `tests/e2e/load-perf.spec.ts` and `bun run measure:bundle`; do not
  re-attribute it to a scene that is not on the page.
- A fixed full-viewport R3F container eats every click on the page if one is
  ever reintroduced. R3F sets `pointer-events: auto` inline on its wrapper
  when no `eventSource` is given, and an inline style outranks a class. The
  LomaVerse canvas stays inside its bounded case-study stage.

## Deployment

- Vercel, Next.js preset. `/api/contact` reads `EMAILJS_*` env vars
  (server-only). `.env.example` documents them.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community
structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or
instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when
  graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for
  relationships and `graphify explain "<concept>"` for focused concepts.
  These return a scoped subgraph, usually much smaller than
  GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates.
  Dirty graph files are not a reason to skip graphify. Only skip graphify if
  the task is about stale or incorrect graph output, or the user explicitly
  says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of
  raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when
  query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current
  (AST-only, no API cost).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
