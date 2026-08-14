# Samvrit Srinath — Personal Portfolio

A research-influenced portfolio built with Next.js App Router, deployed to
[samvrit.vercel.app](https://samvrit.vercel.app).

## Tech Stack

- **Framework**: Next.js 16 (App Router) + React 19 + TypeScript
- **Styling**: Tailwind CSS v4 (CSS-first config in `app/globals.css`)
- **Icons**: lucide-react (brand icons are hand-drawn in `components/icons.tsx`)
- **Analytics**: @vercel/analytics + @vercel/speed-insights
- **Contact**: `/api/contact` server route using @emailjs/nodejs

## Getting Started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm run start      # serve production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Project Structure

```
app/                 # App Router routes (/, /work, /work/[slug], /research, /about, /resume, /contact)
  api/contact/       # EmailJS server route
components/          # Server + client components (atmosphere, nav, diagram, figure, etc.)
data/                # Typed content: projects, research, experience, education, site
lib/                 # Types, cn() helper, seeded RNG
public/assets/       # Images (webp), papers, resume PDF
```

## Content

All content lives in `data/`. To add a project, extend `data/projects.ts`
following the existing `Project` shape in `lib/types.ts` — it powers the
homepage, `/work` archive, and the generated deep-dive pages (`/work/[slug]`).
Images referenced as `assets/...` resolve relative to `public/`.

## Design System

- Dual theme: light (`:root`) and dark (`.dark` on `<html>`) via class strategy,
  no-FOUC init script in `app/layout.tsx`. Palette tokens in `app/globals.css`.
- Glass is a layer, not everywhere: `glass-nav` / `glass-float` utility classes.
- Typography: Geist + Geist Mono (`next/font/google`).
- Signatures: system-diagram SVG engine (`components/diagram.tsx`), numbered
  figure captions (`components/figure.tsx`), metric bands.

## Deployment

Deployed on Vercel. `samvrit.vercel.app` uses the Next.js framework preset and
these environment variables (Settings → Environment Variables):

- `EMAILJS_SERVICE_ID`
- `EMAILJS_TEMPLATE_ID`
- `EMAILJS_PUBLIC_KEY`
- `EMAILJS_PRIVATE_KEY`

These are server-only; the browser never sees them. See `.env.example`.

## License

MIT
