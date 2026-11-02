# Skill Load Log

Last updated: 2026-10-29

| Skill | Path | Loaded | What it requires |
| --- | --- | --- | --- |
| `grill-me` | `~/.agents/skills/grill-me/SKILL.md` | yes | Disabled for model invocation. Delegates to `grilling`. |
| `grilling` | `~/.agents/skills/grilling/SKILL.md` | yes | Work a design tree in frontier rounds; ask the whole frontier, then wait. |
| `redesign-existing-projects` | `~/.agents/skills/redesign-existing-projects/SKILL.md` | yes | Scan, diagnose, and fix in place. Audit typography, color, layout, states, content, and components. |
| `web-design-guidelines` | `~/.agents/skills/web-design-guidelines/SKILL.md` | yes | Fetch the current Vercel Web Interface Guidelines before each review. Re-fetched 2026-10-27. |
| `playwright-cli` | `~/.config/opencode/skills/playwright-cli/SKILL.md` | yes | Use Playwright CLI or tests for browser evidence. The audit and prototype checks use the installed Playwright library directly. |
| `brandkit` | `~/.agents/skills/brandkit/SKILL.md` | yes | Premium identity strategy: strategy first, monogram plus meaning, construction geometry, restrained palette, presentation-ready output. Used for the `SS` mark and OG direction; no generated board committed at this gate. |
| `design-taste-frontend` | `~/.agents/skills/design-taste-frontend/SKILL.md` | yes | Anti-slop frontend rules and three dials. Dials set to variance 7, motion 6, density 4. |
| `apple-design` | `~/.agents/skills/apple-design/SKILL.md` | yes | Response, direct manipulation, interruptible springs, materials, size-specific type, reduced motion. Used for type and motion guidance; materials do not apply because the brief keeps zero radius and no glass. |
| `pick-ui-library` | `~/.agents/skills/pick-ui-library/SKILL.md` | yes | Lookup for curated libraries. Decision: no new UI dependency. base-ui remains the fallback if the dialog surface grows. |
| `prototype` | `~/.agents/skills/prototype/SKILL.md` | yes | Build divergent variants behind a visual picker; never touch production code; use PICKER.md verbatim; promote only after the user chooses. |
| `animate` | `~/.agents/skills/animate/SKILL.md` | yes | Decide whether to animate, name the purpose, choose the cheapest tool, use transform/opacity, custom easing, reduced motion, and offscreen behavior. |
| `emil-design-eng` | `~/.agents/skills/emil-design-eng/SKILL.md` | yes | UI polish and animation craft: springs, press feedback, easing, reduced motion, and the review checklist. Used for Phase 3. |
| `ponytail` | `~/.agents/skills/ponytail/SKILL.md` | yes | Smallest complete change in production code; finish callers, tests, and validation; no speculative abstraction. The palette prototype is a deliberate design exploration, not production code. |
| `brainstorming` | `~/.qoder/plugins/cache/qoder-marketplace/superpowers/6.3.0/skills/brainstorming/SKILL.md` | yes | Classify work as spike, bounded, or architectural; ask before implementing; write a spec for architectural work. Its one-question-at-a-time rule conflicts with the brief's R11 batch, so the brief wins. |
| `ui-designer` | `~/.qoder/plugins/cache/qoder-marketplace/design-review/0.1.0/skills/ui-designer/SKILL.md` | yes | Design system first, real content, visual verification. Its Vite/shadcn and generated-image defaults conflict with the repo stack and the brief; the repo and brief win. |
| `ui-styling` | `~/.qoder/plugins/cache/qoder-marketplace/ui-ux-pro-max-skill/2.6.2/.claude/skills/ui-styling/SKILL.md` | yes | shadcn/ui, Tailwind, accessibility, responsive patterns. Used as reference; shadcn is not added. |
| `ui-ux-pro-max` | `~/.qoder/plugins/cache/qoder-marketplace/ui-ux-pro-max-skill/2.6.2/.claude/skills/ui-ux-pro-max/SKILL.md` | yes | Accessibility, touch, layout, form, and navigation rules. Used as a checklist; its search scripts were not needed. |

Deferred or out of scope:

| Skill | Status | Reason |
| --- | --- | --- |
| `avoid-ai-writing` | Deferred to Phase 6 | The copy pass is a separate gate. |
| `image-to-code`, `imagegen-frontend-mobile` | Not used | The harness supports image input and generation, but the palette gate uses real repo assets and CSS. No generated images are committed. |
| `find-skills` | Not used | No missing capability. |
| `write-swift` | Out of scope | Not relevant to a Next.js portfolio. |
| `full-output-enforcement` | Applied directly through R8 | Complete files only; no elision. |

## Conflicts resolved by the brief

| Skill rule | Brief or repo rule | Resolution |
| --- | --- | --- |
| `design-taste-frontend`: no section-number eyebrows | `01 / FIELD` is core design language | Keep the section rail; the brief wins. |
| `design-taste-frontend`: no locale strips | Coordinate line is core design language | Keep the coordinate; the brief wins. |
| `design-taste-frontend`: one accent | C2 and C3 add semantic accents | Keep one primary action accent plus defined data and sound accents; the user's palette direction wins. |
| `design-taste-frontend`: hero top padding cap | The current hero is a 5/7 instrument composition | Preserve the existing hero; Phase 2 changes palette and identity, not layout. |
| `apple-design`: translucent materials | Zero radius, no glass, gradients only in atmosphere | Use Apple's type and motion guidance; skip materials. |
| `pick-ui-library`: base-ui for dialogs | The custom dialogs now trap and restore focus | No new dependency; revisit if the surface grows. |
| `ui-designer`: generate images | The brief forbids invented or unlicensed assets | Use real repo assets; no generated images. |
| `brainstorming`: one question at a time | Brief R11 asks one batch with defaults | Follow the brief. |

## Phase 2 evidence

- Prototype: `/prototypes/palette.html`
- Screenshots: `.review/palette/` (gitignored)
- Measured contrast: rendered in the prototype and recorded in `docs/DESIGN_SYSTEM.md`
- No production palette tokens changed in Phase 2

## Phase 4 evidence

- `animate`: the traceroute packet is a one-pass, first-view animation; the
  other diagram signals keep their existing loop and pause offscreen.
- `ui-ux-pro-max` and `web-design-guidelines`: checked the sound toggle's
  target size, `aria-pressed`, keyboard path, and decorative SVG naming.
- `emil-design-eng`: kept the divider and piano strip static, token-driven, and
  free of hover or layout motion.
- No new library or generated asset was added.

## Phase 5 evidence

- `test-driven-development`: the score unit tests and the persistence,
  page-map, and highlight browser tests were written and watched failing
  before `lib/sound-score.ts`, `lib/sound.ts`, and the provider changes.
- `animate`: the sound highlight is a 140 ms fill transition, not a keyframe
  loop; reduced motion keeps the color state.
- `web-design-guidelines`: the toggle keeps `aria-pressed` and a state-accurate
  label, the decorative strip is `aria-hidden`, and the mobile target stays
  44 px.
- No new dependency or audio asset was added.

## Revision R1 evidence

- Reloaded `redesign-existing-projects`, `design-taste-frontend`, and
  `apple-design` on 2026-10-29 for the hero redesign.
- `redesign-existing-projects`: audited the 5/7 portrait-as-sun hero and
  replaces the existing composition in place rather than rewriting the page.
- `design-taste-frontend`: two columns at 1024 and up, one accent, zero radius
  outside the portrait, and no decorative constellation. The site-wide section
  rail still overrides the no-section-number rule.
- `apple-design`: type and motion guidance only; materials do not apply
  because the brief keeps zero radius and no glass. The typed title line is
  the only hero motion.
- Prototype: `/prototypes/hero.html`; screenshots in `.review/hero/`
  (gitignored).

## Revision R1.1 item 4 evidence

- Reloaded `brandkit`, `pick-ui-library`, and `web-design-guidelines` on
  2026-10-29.
- `brandkit`: identity and asset-system guidance. No generated brand board and
  no new mark; the existing SS mark stays.
- `pick-ui-library`: no new UI dependency. The shared `LogoTile` is a local
  component; the curated list had no logo-tile package need.
- `web-design-guidelines`: fetched 2026-10-29. Checked alt text, explicit image
  dimensions, hero priority, decorative-icon hiding, hover states, and
  contrast. Added `aria-hidden` to the new paper and club icons.
- Asset map: `docs/ASSET_MAP.md` (68 used, 16 unused, none deleted).
- Prototype: `/prototypes/logos.html`.
