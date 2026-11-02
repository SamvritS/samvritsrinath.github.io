# Samvrit Srinath - Network Observatory

A portfolio for network systems, internet measurement, and machine learning
work. Built with Next.js App Router and deployed to
[samvrit.vercel.app](https://samvrit.vercel.app).

The site is an observation log, not a planetarium. Astronomy supplies the
vocabulary: field, aperture, signal, archive. Engineering and research supply
every claim. A harmonic register and a restrained atmosphere carry the same
idea visually.

## Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript strict
- **Styling**: Tailwind CSS v4 (CSS-first tokens in `app/globals.css`)
- **Icons**: `@phosphor-icons/react`, plus inline brand SVGs in
  `components/icons.tsx`
- **Motion**: `motion/react` + Lenis. GSAP is not installed.
- **3D**: `three` + `@react-three/fiber`, lazy-loaded on case studies only
- **Citations**: structured BibTeX in `lib/bibtex.ts`; no dependency
- **Analytics**: `@vercel/analytics` + `@vercel/speed-insights`
- **Contact**: `/api/contact` server route using `@emailjs/nodejs`
- **Package manager**: Bun (`bun.lock`, no npm lockfile)

## Commands

```bash
bun install
bun run dev            # http://localhost:3000
bun run build          # production build, includes type checking
bun run start          # serve the production build
bun run lint           # ESLint
bun run typecheck      # tsc --noEmit
bunx playwright test   # end-to-end, workers: 1
bun test               # node tests; tests/e2e is ignored via bunfig.toml
bun run verify:trope   # style, copy, and critical-path gates
bun run verify:assets  # asset existence and figure dimensions
bun run verify:contrast
bun test tests/content-depth.test.ts
bun run measure:bundle # advisory bundle report, not a gate
```

Run `bun run lint`, `bun run typecheck`, and the relevant tests after any code
change. Run `bun run verify:assets` and `bun test tests/content-depth.test.ts`
after touching `data/`.

## Routes

| Route | Purpose |
| --- | --- |
| `/` | Hero, experience, skills, selected projects, research, education, teaching, clubs, contact |
| `/work` | Project archive with category filters and search |
| `/work/[slug]` | Project case study, generated from `data/projects.ts` |
| `/research` | Citable research archive shared with the homepage |
| `/about` | Portrait, education record, teaching, and clubs |
| `/contact` | Form, email, FAQ, and confirmation dialog |
| `/resume` | Print-fidelity resume sheet |
| `/playground` | Pointer-driven particle field |
| `/privacy`, `/terms` | Policy pages |

`/work/lomaverse` is the only route that mounts the LomaVerse N-body
simulation. `/work/ip-sage` mounts its address-space layer and product stage.
No homepage section mounts a canvas.

## Structure

```text
app/                    App Router routes and the contact API
components/             Layout, editorial sections, visuals, and demos
  atmosphere/           AmbientField, HarmonicRegister, CoordinateMarks, SignalTrace
  observatory/          NetworkConstellation, retained but not mounted
  demos/                Lazy 3D demos and the pure nbody integrator
  visuals/              Curated SVG compositions and shared primitives
data/                   Typed content: projects, research, experience, education, site
lib/                    Types, copy, BibTeX serializer, class helper, scene colour
public/assets/          Covers, figures, papers, logos, portrait, LomaVerse evidence
scripts/                Verification, asset checks, preset generation
tests/                  Node tests and Playwright specs
```

## Design system

- Light is warm paper (`--void #f2ece1`) with dark ink; dark is blue-toned
  near-black (`--void #060a11`). Both use the same accent, `--wavelength`:
  `#ad1526` in light, `#ff5a4d` in dark.
- Tokens are CSS variables in `app/globals.css`, mapped through `@theme inline`.
  Components use semantic classes such as `text-ink`, `text-ink-soft`,
  `border-line`, and `bg-surface`. Project hues live in `data/projects.ts` and
  are applied through `--hue`, `hue-field`, `hue-line`, and `hue-text`.
- Atmosphere is centralized: gradients and blur live only inside the marked
  block in `app/globals.css`; components consume `.atmosphere-*`, `.field-*`,
  and `.hero-portrait*` classes. Glass, shadows, giant orbs, gradient text,
  rainbow accents, and decorative star fields stay banned.
- The hero is a 6/6 split on `lg`: copy on the left, a plain circular portrait
  on the right. `HeroPortrait` is the priority image; there is no constellation,
  register, orbit, or portrait glow in the hero.
- The Experience section is the one full-width homepage section: a company
  header, then a `180px minmax(0,1fr)` date/content grid.
- `HarmonicRegister` is the shared five-line motif: Work rail, Experience seam,
  Research spectral trace, Contact convergence.
- Outfit for display and body, JetBrains Mono for labels, coordinates, and
  metrics. Reading prose uses `.read` at 17px mobile and 18px desktop with a
  68ch cap.
- Zero border radius except the portrait. The portrait appears in the hero and
  on `/about`.
- `NetworkConstellation` is a bespoke SVG built from real project nodes and
  shared technologies in `data/constellation.ts`. It is retained but no longer
  mounted on the homepage. `tests/constellation.test.ts` checks every slug,
  metric, and edge against `data/projects.ts`.
- Motion is limited to one-pass reveals, the finite atmosphere drift, the
  register draw, and Lenis smooth scrolling. `prefers-reduced-motion` removes
  non-essential motion.

## Content model

All content lives in `data/`. To add a project, extend `data/projects.ts`
following the `Project` shape in `lib/types.ts`. It powers the homepage lead and
ledger, the `/work` archive, and the generated case-study page.

- Every project sets `problem`, `contribution[]`, `status`, `role`, and optional
  `team`.
- `ContentSection[]` (`prose`/`visual`/`figure`/`gallery`/`paper`/`metrics`/
  `links`/`system`/`implementation`/`evidence`) drives each case study.
- Figures carry intrinsic `width` and `height` plus `fit`. Read dimensions with
  `sips`; never guess them.
- Project covers carry `coverFit` (`contain` for charts and diagrams, `cover`
  for photos and renders). `verify:assets` fails on wide covers without it.
- `ProjectCard` takes `orientation` (`stack` for archive cells, `row` for the
  lead card).
- Research areas live in `data/research.ts`; papers are first-class objects and
  render through `components/research-archive.tsx` on both the homepage and
  `/research`.
- Papers carry a structured `citation`; `lib/bibtex.ts` serializes it and
  `CitationControl` provides formatted and BibTeX copy. Keys are unique, and
  escaping is covered by `tests/unit/bibtex.test.ts`.
- `data/constellation.ts` is the retained project graph. A node names
  a real project slug; an edge names a technology present in both endpoints.

## Verification

The release gate is:

```bash
bun test
bun run lint
bun run typecheck
bun run build
bunx playwright test
bun run verify:trope
bun run verify:assets
bun test tests/content-depth.test.ts
bun run verify:contrast
```

`verify:trope` also asserts that the removed planetary runtime stays removed:
`components/planetary-journey/`, `data/transit.ts`, and
`public/assets/projects/transit/` must not exist. `verify:contrast` measures
the ink family and accent over `void`, `surface`, and the worst atmospheric
field composite.

Restoration-specific specs: `hero-portrait`, `experience-layout`, `atmosphere`,
`citations`, and `responsive`.

## Deployment

Vercel, Next.js preset. The contact route reads server-only environment
variables:

- `EMAILJS_SERVICE_ID`
- `EMAILJS_TEMPLATE_ID`
- `EMAILJS_PUBLIC_KEY`
- `EMAILJS_PRIVATE_KEY`

See `.env.example`.

## License

MIT
