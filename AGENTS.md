# AGENTS.md

Guidance for AI coding agents working in this repository.

## Commands

- `npm run dev` — Next.js dev server (Turbopack), http://localhost:3000
- `npm run build` — production build (also runs TypeScript)
- `npm run lint` — ESLint (flat config)
- `npm run typecheck` — `tsc --noEmit`

Run `npm run lint` and `npm run typecheck` after any code change.

## Conventions

- Server Components by default. Client components ("use client") are only for
  interactivity: `atmosphere`, `theme-toggle`, `nav`, contact form, and the
  SVG visuals in `components/visuals/` (animations + reduced-motion handling).
- Brand icons (GitHub, LinkedIn) were removed from lucide v1 — use the inline
  SVGs in `components/icons.tsx`, not lucide.
- Never import brand icons from lucide-react; they do not exist there.
- TypeScript strict. Type everything in `lib/types.ts`; content lives in
  `data/`, one file per domain, strongly typed.
- Tailwind v4 is CSS-first — theme tokens are CSS variables in
  `app/globals.css` mapped via `@theme inline`. Don't add `tailwind.config.js`.
- Dark mode is a `.dark` class on `<html>`, toggled by `theme-toggle`. The
  no-FOUC init script lives in `app/layout.tsx`.
- react-hooks and react/no-unescaped-entities rules are strict — don't call
  setState inside effects, and escape apostrophes (`&apos;`) in JSX text.
- All content images go through `next/image` with `width`/`height` props. Store
  raster assets as WebP. Source paths in data are relative to `public/`
  (e.g. `assets/projects/<slug>/<file>.webp`).

### Comment policy

Do not add comments that narrate implementation or describe JSX structure. Do
not praise or justify code with comments. No TODO/FIXME comments unless
explicitly requested.

Add a comment only when it explains a non-obvious constraint:

- a non-obvious technical constraint or workaround
- a mathematical/algorithmic idea
- an accessibility requirement
- an external API/platform constraint

Prefer expressive names and types over comments. When modifying a component
for visual/design reasons, do not rewrite unrelated comments — keep the diff
scoped to the requested change.

## Data model

- `data/projects.ts`: `Project` entries. `featured: true` + one `spotlight`
  control the homepage; every project auto-generates a `/work/[slug]` page via
  `generateStaticParams` in `app/work/[slug]/page.tsx`. `ContentSection[]`
  (`prose`/`visual`/`figure`/`gallery`/`paper`/`metrics`/`links`) drives each
  page's narrative.
- Visuals: `data/projects.ts` references curated visuals by `VisualId`
  (e.g. `visual: "ownership-pipeline"`), resolved in
  `components/visuals/registry.tsx`. Shared SVG primitives live in
  `components/visuals/primitives.tsx`; each composition has its own geometry —
  never force a project into the generic box-and-arrow renderer.
- Research projects expose a first-class `paper` (`{ title, venue, year, href }`)
  rendered as `PaperLink` in the case-study header and a "Primary sources"
  block at the end; a `paper` section can also sit mid-narrative. Never embed
  PDFs inline.
- Edit data files, not page components, to change content.

## Deployment

- Vercel, Next.js preset. Contact route `/api/contact` reads
  `EMAILJS_*` env vars (server-only). `.env.example` documents them.