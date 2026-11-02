# Network Observatory Design System

Status: Phase 2 complete; C1 Warm selected and implemented
Date: 2026-10-27
Base: `restore-character` after the Q1 accessibility fixes
Prototype: `/prototypes/palette.html`
Scope: palette, identity, type, spacing, numbering, and library decision

Gate 2 decision: C1 Warm. Numbering confirmed. A26 approved and fixed. No
new UI library. `.env.example` is tracked. C2 Signal and C3 Starlight remain
reference prototypes.

The selected C1 tokens are implemented in `app/globals.css`. C2 and C3 are
not shipped.

## 1. Design read

Reading this as: developer portfolio for hiring managers, research
collaborators, and systems engineers, with an editorial observatory language,
leaning toward the existing warm-paper and blue-black system, refined rather
than replaced.

Dials:

| Dial | Value | Reason |
| --- | --- | --- |
| `DESIGN_VARIANCE` | 7 | The site uses a 6/6 hero, 3/9 rails, and a full-width Experience section. Keep the rail asymmetry; do not add chaos. |
| `MOTION_INTENSITY` | 6 | The user set 6. Meaning-bearing motion only: traceroute packet, constellation twinkle, page transitions, and reveals. |
| `VISUAL_DENSITY` | 4 | Editorial portfolio density. The data is evidence, not a dashboard. |

The brief overrides several defaults in the loaded skills:

- `design-taste-frontend` bans section-number eyebrows and locale strips. The
  brief's `01 / EXPERIENCE` rail is core design language, so it stays. The
  coordinate line is removed; the base is San Jose, CA.
- `design-taste-frontend` prefers one accent. C2 and C3 add semantic
  secondary accents. The brief and the user's palette choice win; the usage
  rules below keep them from becoming decoration.
- `apple-design` recommends translucent materials. The brief keeps zero
  radius, no glass, and gradients only in the atmosphere block. Use its
  typography and motion guidance, not its materials.
- `brandkit` is an image-generation workflow. It informs the mark and OG
  strategy below; no generated brand board is committed at this gate.

## 2. Palette

### 2.1 Current base C

| Token | Light | Dark |
| --- | --- | --- |
| `--void` | `#f2ece1` | `#060a11` |
| `--surface` | `#fbf7ef` | `#0a1019` |
| `--surface-2` | `#f7f1e7` | `#0d1622` |
| `--ink` | `#121821` | `#f1f4f8` |
| `--ink-soft` | `#47515f` | `#a8b3c2` |
| `--ink-faint` | `#515b69` | `#8a95a6` |
| `--wavelength` | `#ad1526` | `#ff5a4d` |
| `--field-blue` | `#5b7fa6` | `#17324f` |
| `--field-teal` | `#2f7a72` | `#123c3a` |
| `--field-warm` | `#c98a3b` | `#c98a3b` |

### 2.2 C1 Warm

C1 is the selected implementation palette. It keeps the hues, raises chroma,
and makes the red stronger. The neutrals move slightly cooler and cleaner;
the field colors become more saturated.

| Token | Light | Dark |
| --- | --- | --- |
| `--void` | `#f4ecdf` | `#040a12` |
| `--surface` | `#fdf9f1` | `#08111d` |
| `--surface-2` | `#f7efe2` | `#0b1623` |
| `--ink` | `#0f1722` | `#f5f8fc` |
| `--ink-soft` | `#3f4b5a` | `#b0bccb` |
| `--ink-faint` | `#4b5766` | `#8c98aa` |
| `--wavelength` | `#b00f24` | `#ff4638` |
| `--field-blue` | `#3f7aa8` | `#16446b` |
| `--field-teal` | `#18786f` | `#0d4a44` |
| `--field-warm` | `#d08a2f` | `#d89a3f` |
| `--field-slate` | `#7f8ea8` | `#2b3a4f` |

Red is the primary action, focus, selected, and error color. It is the only
accent in C1. Project hues stay project-specific. The atmosphere fields carry
the higher chroma, but no gradient sits behind body text.

### 2.3 C2 Signal

C2 is C1 plus a data accent:

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--signal` | `#08706a` | `#5fe0d4` | Stat values, live indicators, measurement lines |
| `--signal-soft` | `rgba(8,112,106,0.12)` | `rgba(95,224,212,0.12)` | Selected data rows, sparkline fills |
| `--signal-glow` | `rgba(8,112,106,0.28)` | `rgba(95,224,212,0.28)` | One live node, one focus halo |

Signal teal is the global data accent. It does not carry prose. A project card
keeps its own project hue for project-specific metrics. Signal teal is for
project values, measurement traces, live status, and cross-archive
data counts.

### 2.4 C3 Starlight

C3 is C2 plus a highlight accent:

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--starlight` | `#8a620f` | `#e8b96a` | One highlight line |
| `--starlight-bright` | `#c9973e` | `#ffd88a` | Glow, non-text highlight only |
| `--starlight-soft` | `rgba(138,98,15,0.12)` | `rgba(232,185,106,0.12)` | Highlight panel tint |
| `--starlight-glow` | `rgba(201,151,62,0.28)` | `rgba(255,216,138,0.28)` | Highlight halo |

Gold is for one highlight at a time. It is not a body-copy color.
`--starlight-bright` is decorative only; the text-safe value is
`--starlight`.

### 2.5 Accent hierarchy

1. Wavelength red: action, focus, error, selected.
2. Signal teal: measured data and live status.
3. Starlight gold: one highlight.
4. Project hues: project identity in fields, lines, and text.

The three semantic accents are not interchangeable. A data value does not
become red because it is important. A primary action does not become teal
because it is measured. Gold never replaces red for focus or action.

## 3. Measured contrast

The prototype measures every pair in the browser and renders the table. All
pairs below pass WCAG AA normal text at 4.5:1.

| Pair | C1 light | C1 dark | C2 light | C2 dark | C3 light | C3 dark |
| --- | --- | --- | --- | --- | --- | --- |
| ink on void | 15.36 | 18.65 | 15.36 | 18.65 | 15.36 | 18.65 |
| ink on surface | 17.15 | 17.79 | 17.15 | 17.79 | 17.15 | 17.79 |
| ink-soft on void | 7.57 | 10.31 | 7.57 | 10.31 | 7.57 | 10.31 |
| ink-soft on surface | 8.45 | 9.84 | 8.45 | 9.84 | 8.45 | 9.84 |
| ink-faint on void | 6.27 | 6.80 | 6.27 | 6.80 | 6.27 | 6.80 |
| ink-faint on surface | 7.01 | 6.48 | 7.01 | 6.48 | 7.01 | 6.48 |
| wavelength on void | 6.09 | 5.85 | 6.09 | 5.85 | 6.09 | 5.85 |
| wavelength on surface | 6.80 | 5.58 | 6.80 | 5.58 | 6.80 | 5.58 |
| void on wavelength | 6.09 | 5.85 | 6.09 | 5.85 | 6.09 | 5.85 |
| project hue on void | 5.61 | 10.55 | 5.61 | 10.55 | 5.61 | 10.55 |
| project hue on hue field | 5.29 | 9.80 | 5.29 | 9.80 | 5.29 | 9.80 |
| signal on void | - | - | 5.06 | 12.39 | 5.06 | 12.39 |
| signal on surface | - | - | 5.66 | 11.82 | 5.66 | 11.82 |
| void on signal | - | - | 5.06 | 12.39 | 5.06 | 12.39 |
| starlight on void | - | - | - | - | 4.67 | 10.95 |
| starlight on surface | - | - | - | - | 5.21 | 10.45 |
| void on starlight | - | - | - | - | 4.67 | 10.95 |

The tightest pair is C3 light starlight on void at 4.67:1. Gold is therefore
reserved for short labels and non-text highlights.

The app's atmosphere gate measures the worst field composite, not only the
solid surfaces. C1's brighter dark fields originally failed: wavelength was
3.50:1 on `atmo-blue`, and ink-faint was 4.07:1. The C1 dark atmosphere alphas
are now 19 percent wash blue, 10 percent wash teal, 30 percent field blue, and
21 percent field teal. That restores the worst composite to 4.70:1 for
wavelength and 5.46:1 for ink-faint. The light alphas stay at 6, 5, 18, and
16 percent. `verify:contrast` records the result.

### 3.1 Project hue text

A26 is fixed. `app/globals.css` uses a theme-aware weight:

```css
--hue-text-weight: 50%;
```

with `65%` in dark mode. The app's `.hue-text` class mixes each project hue
with ink at that weight. `verify:contrast` now gates every project hue against
`void`, `surface`, and its own hue field. All project hues pass. The worst is
LomaVerse `#84cc16` at 4.82:1 on void and 4.65:1 on its hue field. IP-Sage
`#14b8a6` is 5.61:1 and 5.29:1.

The previous 65 percent light mix failed for IP-Sage at 4.08:1 on void and
3.85:1 on the hue field, and for OptFantasy, LomaVerse, and the GPU hue on the
field as well.

## 4. Gradient placements

Gradients remain inside the marked `atmosphere:allow-begin` and
`atmosphere:allow-end` block in `app/globals.css`. Components consume classes;
they do not declare gradient utilities.

| Placement | Field | Text rule |
| --- | --- | --- |
| Home hero | Radial field on the portrait side only, using `--field-blue`, `--field-teal`, and `--field-warm` | Left copy stays on solid `--void`. No gradient under the copy. |
| Project detail header | Project hue band at 7 percent with a top rule and one corner field | Title may sit on the hue band; reading copy sits on `--surface`. |
| Playground | Dark field with signal teal and wavelength particles | Labels sit on a solid bar above or below the field. |
| OG image | 1200 x 630 dark field with one accent corner and a signal line | Name and role sit on the solid dark area. |

The prototype shows all four placements. It does not place body text on a
gradient.

## 5. Identity

The `brandkit` guidance is used for strategy and construction. No generated
brand board is committed at this gate.

- `SS` mark: two offset arcs on a 6 by 6 grid, forming a signal path and a
  monogram. One terminal node uses `--wavelength`. The C1 favicon uses the
  mark on `#040a12`; the nav wordmark stays as `SS` text for now.
- Favicon: 64 by 64, mark on the C1 dark field. The current `app/icon.svg`
  uses the new mark and terminal node.
- OG art: 1200 by 630 dark field, name and role, the mark, a corner field,
  one signal rule, and one accent line. `app/opengraph-image.tsx` uses the C1
  literal values because Satori cannot resolve CSS variables.
- No photographic or stock assets are introduced. The prototype uses the real
  portrait and real project covers.

## 6. Typography

Keep Outfit for display and body, JetBrains Mono for labels, coordinates,
metrics, and code.

- Display: `text-4xl` to `text-8xl`, tracking `-0.03em` to `-0.045em`,
  leading `1.02` to `1.08`.
- Section titles: `text-3xl` to `text-5xl`.
- Reading prose: `.read` at 17 px mobile and 18 px desktop with a 68ch cap.
- Labels: mono, 11 px, uppercase, 0.18 to 0.22em tracking.
- Numbers: `tabular-nums` everywhere.
- Add `text-wrap: balance` to display headings and `text-wrap: pretty` to
  reading prose. This closes audit finding A18.
- Do not introduce a serif. The current sans system is the brand.

## 7. Spacing, radius, elevation, z-index

- One container: `mx-auto max-w-6xl px-6`.
- Section padding: `py-20 md:py-28`; separators are `border-t border-line`.
  Work, Observation, and Contact replace the plain border with `SectionDivider`,
  a full-width hairline carrying the orbit-and-signal motif.
- Experience date rail: `180px minmax(0,1fr)`.
- Zero radius except the portrait.
- No shadows, no glass, no blur. Gradients live only in the atmosphere block.
- Proposed z-index scale:
  - 0 field
  - 10 content
  - 30 sticky archive bar
  - 40 mobile menu overlay
  - 50 nav
  - 60 scroll progress
  - 65 shell actions
  - 70 search
  - 80 confirm dialog
  - 90 figure lightbox
  - 100 skip link
- Token cleanup: `--surface-2` and `--field-slate` are currently unused.
  Use them or remove them. Add `--signal`, `--signal-soft`, `--signal-glow`,
  `--starlight`, `--starlight-bright`, `--starlight-soft`, `--starlight-glow`,
  and `--hue-text-weight` only if the chosen variant needs them.

## 8. Section numbering

Proposal:

| Context | Scheme |
| --- | --- |
| Homepage | 01 Experience, 02 Skills, 03 Selected Projects, 04 Research, 05 Education, 06 Teaching, 07 Community, 08 Contact |
| `/work` | 01 Work archive |
| `/research` | 02 Research |
| `/about` | 03 About; section numerals dropped |
| `/contact` | 04 Contact |
| `/playground` | 05 Interactive study |
| `/work/[slug]` | No route index. Keep the project eyebrow and year. |
| `/resume`, `/privacy`, `/terms` | No route index. Keep the document or policy label. |

Homepage numbering follows the live sequence. About drops section numerals
because it reuses Teaching and Community out of Home order. Route headers still
follow the nav order.

Implemented:

- Homepage rails `01 / EXPERIENCE` through `08 / CONTACT`.
- `/about` drops section numerals; Teaching and Community keep their kickers.
- `/work`, `/research`, `/about`, `/contact`, and `/playground` keep the
  route indices 01 through 05.
- Project details, the résumé, privacy, and terms remain unnumbered.

## 9. Library decision

Decision: no new UI dependency. This is confirmed.

The current stack is custom React components, Phosphor icons, Motion, clsx,
cva, and Tailwind v4. `pick-ui-library` would suggest base-ui for accessible
dialogs and popovers. After the Q1 fixes, the search and confirm dialogs have
focus traps, return focus, live regions, and inert content. Base-ui would be
a refactor with no visible gain at this size. Revisit if the dialog or popover
surface grows.

No shadcn/ui, next-themes, cmdk, Sonner, or chart library is added. The theme
init is already no-FOUC, the search is small, and the data visuals are
hand-built for the content.

## 10. Motion

Motion intensity is 6. `docs/MOTION.md` specifies every animation and its
reduced-motion fallback. The implemented direction is meaning-bearing only:

- Page transitions fade content in over 220 ms. They are opacity only, so
  sticky rails keep working.
- The constellation component is not mounted on the homepage after R1.1. Its
  draw, signal, and twinkle remain defined for the retained component; nothing
  loops.
- The hero title cycle pauses offscreen. The decorative 48 second atmosphere
  drift is removed; the field is static.
- The Country-in-the-Middle traceroute packet crosses the measured paths once,
  on first view. It does not loop.

Everything pauses offscreen and has a reduced-motion static fallback. No
layout-shifting animation, no scroll hijacking, and no hover transforms above
1 px.

### 10.1 Instrument motifs

- `SectionDivider` is a static orbit and signal mark on a full-width hairline.
  It replaces the border on Work, Observation, and Contact only.
- The traceroute packet is a `VisualSignal` in `once` mode. It stays hidden
  until its diagram enters the viewport, then runs one 4 second pass and
  freezes.
- Diagrams remain real-data SVG. The Country-in-the-Middle bundles, labels,
  and rail come from the project's measured table; no node is invented for
  decoration.

## 11. Gate 2 decision

C1 Warm is selected and implemented.

Confirmed:

- Homepage numbering: 01 Field, 02 Work, 03 Observation, 04 Instruments,
  05 Record, 06 Teaching, 07 Community, 08 Contact. About uses 03.1 Teaching
  and 03.2 Community. Route headers follow the nav order.
- A26: the project hue text weight is 50 percent light and 65 percent dark;
  every project hue passes the extended contrast gate.
- No new UI library.
- `.env.example` is tracked with `NEXT_PUBLIC_SITE_URL`.
- The C1 favicon and OG image use the new palette and mark.

The prototype remains at `/prototypes/palette.html` as the C1/C2/C3 reference.
The picker is fixed at the bottom of the viewport. Keys 1 to 3 and the arrow
keys switch variants; the theme button is top-right.
