# Skill Load Log

Last updated: 2026-11-01
Branch: `feat/ui/color-pop`
Policy: Project Taste v2 only. The global `design-taste-frontend` copy is read but not used. `docs/MOTION.md` has been removed; motion rules live in `docs/DESIGN_SYSTEM.md`.

## Loaded skills

| Skill | Path | Status | What it requires |
| --- | --- | --- | --- |
| `grilling` | `~/.agents/skills/grilling/SKILL.md` | Active | Frontier rounds; ask the whole frontier, then wait. |
| `grill-me` | `~/.agents/skills/grill-me/SKILL.md` | Loaded | Delegates to `grilling`. |
| `redesign-existing-projects` | `~/.agents/skills/redesign-existing-projects/SKILL.md` | Loaded | Scan, diagnose, and fix in place. Keep the stack. |
| `design-taste-frontend` | `.agents/skills/design-taste-frontend/SKILL.md` | Active project copy | Tasteskill v2. The project copy is 542 lines; the global copy is 1,206 lines; the diff is 1,665 lines. Use the project copy only. |
| `design-taste-frontend` | `~/.agents/skills/design-taste-frontend/SKILL.md` | Read, not used | Global anti-slop v1 with the three dials and appendices. Superseded by the project copy and the brief. |
| `apple-design` | `~/.agents/skills/apple-design/SKILL.md` | Loaded | Type and motion guidance. Materials and glass do not apply. |
| `brandkit` | `~/.agents/skills/brandkit/SKILL.md` | Loaded, not applied | Image-generation brand system. No generated board or asset is committed. |
| `emil-design-eng` | `~/.agents/skills/emil-design-eng/SKILL.md` | Loaded | Motion purpose, easing, press feedback, reduced motion. |
| `animate` | `~/.agents/skills/animate/SKILL.md` | Loaded | Decide whether to animate, name the purpose, cheapest tool, transform/opacity only. |
| `pick-ui-library` | `~/.agents/skills/pick-ui-library/SKILL.md` | Loaded | No new UI library. |
| `prototype` | `~/.agents/skills/prototype/SKILL.md` | Loaded, adapted | The brief asks for one living style guide, not a variant picker. No production code imports the prototype. |
| `web-design-guidelines` | `~/.agents/skills/web-design-guidelines/SKILL.md` | Loaded | Fetch the current Vercel guidelines before a review. |
| `playwright-cli` | `~/.config/opencode/skills/playwright-cli/SKILL.md` | Loaded | Browser evidence through Playwright. Used for screenshots and measurements. |
| `frontend-design` | `~/.qoder/plugins/cache/qoder-marketplace/frontend-design/1.0.0/skills/frontend-design/SKILL.md` | Loaded | Distinctive direction. It flags the chosen vermilion/hairline look as a default; the brief chooses it deliberately. |
| `full-output-enforcement` | `~/.agents/skills/full-output-enforcement/SKILL.md` | Applied | Complete files only, no elision. |
| `ponytail` | `~/.agents/skills/ponytail/SKILL.md` | Read, not applied | Smallest complete change. The design-system exploration is explicitly requested; production changes stay minimal. |
| `graphify` | `~/.config/opencode/skills/graphify/SKILL.md` | Read, not used | The graph exists, but direct reads and greps produced exact DS-0 counts. |
| `task-observer` | `~/.config/opencode/skills/task-observer/SKILL.md` | Read, not activated | Its session-start log would add unrelated workspace files and no skill-improvement signal is clear. The brief says use only if clearly useful. |
| `image-to-code` | `~/.agents/skills/image-to-code/SKILL.md` | Read via subagent, not applied | Its image-first pipeline exempts a precise design system. No generated reference images. |
| `imagegen-frontend-mobile` | `~/.agents/skills/imagegen-frontend-mobile/SKILL.md` | Read via subagent, not applied | Mobile-only and image-only. Out of scope. |
| `write-swift` | `~/.agents/skills/write-swift/SKILL.md` | Not invoked | As instructed. |
| `find-skills` | `~/.agents/skills/find-skills/SKILL.md` | Not invoked | As instructed. |
| `karpathy-guidelines` | command | Loaded | Simplicity, surgical changes, verifiable goals. |
| `brainstorming` | command | Loaded | Approval gate. Its one-question rule yields to the grilling frontier batch. |

## Conflicts resolved by the brief

| Skill rule | Brief or repo rule | Resolution |
| --- | --- | --- |
| Project Taste v2: no thin rules, no hairlines, no crop marks | The figure frame, rail, and section system are hairline based | The brief wins. Hairlines stay. |
| Project Taste v2: no gradients, no decorative shapes | The atmosphere is a token-bounded gradient and SVG system | The brief wins. Gradients stay inside the `atmosphere:allow` block. |
| Project Taste v2: no monospace outside code | Mono labels, coordinates, metrics, and Fig. N are core | The brief wins. JetBrains Mono stays. |
| Project Taste v2: no eyebrows, no index numbering | Section rail labels and route indices are core | The brief wins. |
| Global Taste v1: no em dashes, no locale strips, no section numbers | The site uses section indices and a coordinate line | The global copy is not used. The project copy and brief win. |
| Frontend Design: vermilion + hairline + broadsheet is a default | The brief explicitly selects this language | The brief wins. |
| Apple Design: translucent materials | Zero radius, no glass, no shadows | Type and motion only. |
| Prototype: divergent variants behind a picker | The brief asks for one living style guide | Build one style guide. No production imports. |
| Brainstorming: one question at a time | The grilling frontier asks a batch | Grilling wins as the later explicit invocation. |
| Karpathy / Ponytail: smallest change | The brief asks for a full token system and prototype | The brief wins. DS-4 production changes stay scoped. |
| `docs/MOTION.md`: atmosphere is static | The user says motion can be dynamic | `MOTION.md` has been removed. The design system is the motion source. |
| `verify-tropes` raw-colour exceptions | The brief wants one TypeScript token source | DS-4 adds `verify-tokens`; the OG route imports the token source. |

## Round 1 decisions

| # | Decision |
| --- | --- |
| 1 | Rename `--wavelength` to `--accent` globally in DS-4, no alias. |
| 2 | Add optional `projectAccent: { light, dark }`; keep `hue`; use project accents on cards and `/work/[slug]`. |
| 3 | Ultramarine primary plus retained teal and warm echo layers. |
| 4 | Option A selected: Outfit throughout. Source Serif 4 evaluated at 121,412 B and rejected by the owner. |
| 5 | Meaningful graphics and focus at 3:1; decorative hairlines exempt; image aspects measured. |
| 6 | Keep `HarmonicRegister`, `SignalTrace`, `SectionDivider`, and `CoordinateMarks`; two per page maximum. |
| 7 | TypeScript token source plus generated CSS; the OG route imports the same source. |

## DS-A and DS-4 evidence

- Prototype: `prototypes/design-system.html`
- Generated token file: `prototypes/design-system.tokens.css`
- DS-A screenshots: `.review/design-system/`
- Live screenshots: `.review/site-after/`
- Contrast: 178 pairs pass; worst section atmosphere 4.58:1; worst site atmosphere 4.62:1
- Font cost: 72,708 B initial, Option A
- Rejected option: Source Serif 4 at 121,412 B (+48,704 B); not loaded
- Atmosphere: 16.67 ms average frame time, 16.7-16.8 ms p95, 16.8 ms max
- Particles: 60 nodes in the fixed ambient layer
- CLS: 0 at 375; 0.0001 at 1280
- Overflow: 0 px at 375 and 1280
- Console errors: none
- Reduced motion: atmosphere contour, field, and particle animations `none`
- Unit and content tests: 143 pass across 10 files
- Playwright: full dev suite 138/139, one transient dev-server session failure that passed alone; the 2 OptFantasy failures were fixed and 15/15 affected tests passed
- Production matrix: 56/56 checks, max CLS 0.0334
- Production build: 30 pages; bundle 589,023 B gz, +12,690 B over baseline
- Live checks: Outfit reading role; 74.6 once on SpecSplit; transparent PACE and CSE logos

## Not used

| Skill | Reason |
| --- | --- |
| `avoid-ai-writing` | Not used; the copy was edited manually under the post-gate content request. |
| `ui-ux-pro-max`, `ui-styling`, `ui-designer` | Read in a prior phase; not part of the current skill list. The brief's system is more specific. |
| `write-swift`, `find-skills` | Not relevant. |
