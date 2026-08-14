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
  interactivity: `atmosphere`, `theme-toggle`, `nav`, contact form.
- No comments in code. Let the code speak.
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

## Data model

- `data/projects.ts`: `Project` entries. `featured: true` + one `spotlight`
  control the homepage; every project auto-generates a `/work/[slug]` page via
  `generateStaticParams` in `app/work/[slug]/page.tsx`. `ContentSection[]`
  (`diagram`/`figure`/`text`) drives each page's narrative.
- Edit data files, not page components, to change content.

## Deployment

- Vercel, Next.js preset. Contact route `/api/contact` reads
  `EMAILJS_*` env vars (server-only). `.env.example` documents them.