# Motion

Status: Phase 3 implemented
Date: 2026-10-27
Motion intensity: 6
Scope: page transitions, constellation, reveals, in-page instruments, and
offscreen behavior

## 1. Principles

- Motion must explain hierarchy, show a state change, prevent a jarring
  change, or demonstrate a real system. Decoration alone does not qualify.
- Animate `transform`, `opacity`, or `clip-path` only. No layout properties.
- One shared easing set. Entrances and exits use `--ease-out-expo`. The
  twinkle uses `--ease-in-out`.
- Hover motion lives only inside `@media (hover: hover) and (pointer: fine)`.
- Every loop pauses offscreen or when the tab is hidden. Every motion has a
  reduced-motion fallback.
- No scroll hijacking. Lenis is smoothing only, and it is skipped when
  reduced motion is requested.
- Page transitions are opacity only. A transformed page wrapper would create
  a containing block and break the sticky section rails.

## 2. Easing and duration

| Token | Value | Use |
| --- | --- | --- |
| `--ease-out-expo` | `cubic-bezier(0.16, 1, 0.3, 1)` | Entrances, exits, draws, page transition |
| `--ease-in-out` | `cubic-bezier(0.77, 0, 0.175, 1)` | The finite constellation twinkle |

Durations:

| Band | Duration |
| --- | --- |
| Press and color feedback | 120 to 200 ms |
| UI state transitions | 200 to 320 ms |
| Page transition | 220 ms |
| Scroll reveal | 550 ms |
| Draw and signal passes | 900 ms to 5 s, once |

## 3. Motion table

| Element | Trigger | Property | Duration and easing | Offscreen | Reduced motion | Why |
| --- | --- | --- | --- | --- | --- | --- |
| Route transition | Pathname change | `opacity` 0 to 1 | 220 ms, ease-out | Not applicable, route-level | Instant, opacity 1 | Prevents a jarring page swap |
| Scroll reveal | In view, once | `opacity`, `transform: translateY(22px)`, or `clip-path` | 550 ms, ease-out | One-shot | Instant | Establishes reading order |
| Constellation edge draw | First paint | `stroke-dashoffset` 1 to 0 | 900 ms, ease-out, 120 ms stagger | One-shot | Static | Shows the graph is a network |
| Constellation signal | After edge draw | `stroke-dashoffset` | 5 s, linear, once | One-shot | Hidden | One measured pass across the graph |
| Constellation twinkle | First paint | `opacity` 1 to 0.35 to 1 on two node rings | 1.6 s, ease-in-out, 2 iterations | Finite | Static at opacity 1 | Astronomy cue without a permanent loop |
| Harmonic register draw | First paint | `stroke-dashoffset` | 1.2 s, ease-out, once | One-shot | Static | Ties the five-line motif to the page |
| Signal trace draw | First paint | `stroke-dashoffset` | 1.6 s, ease-out, once | One-shot | Static | Shows the measured route |
| Signal trace pulse | After draw | `stroke-dashoffset` | 4 s, linear, once | One-shot | Hidden | One packet-like pass |
| Scroll progress | Scroll | `scaleX` direct, or spring above reduced motion | Scroll-linked | Fixed chrome | Direct value, no spring | Functional position indicator |
| Hero title cycle | Autoplay | Text change, 45 ms per character, 1.8 s hold | 2.6 s cycle | IntersectionObserver pauses it | Static first title | Names the current roles |
| Atmosphere field | Not animated | None | None | Static | Static | The gradient is atmosphere, not motion |
| Playground field | Pointer and rAF | Canvas | Existing | IntersectionObserver pauses | Static frame | Direct manipulation |
| LomaVerse simulation | Visible and not paused | WebGL | Existing | Demand frameloop and observer | Absent | Explanatory simulation |
| IP-Sage address space | Visible walkthrough | WebGL | Existing | Demand frameloop and observer | Absent | Explanatory stage |
| Visual packet | Visible | SVG `animateMotion` | 2.2 to 4 s, linear, loop | IntersectionObserver pauses | Hidden | Shows flow through a diagram |
| Traceroute packet | First view | SVG `animateMotion` | 4 s, once | Starts on first view; no loop | Hidden | Shows the measured path once |
| Section divider | Not animated | None | None | Static | Static | Separates sections with the signal motif |

## 4. Removed motion

- The 48 second atmosphere drift is removed. The field is static. It was a
  decorative loop that did not explain anything and ran whether or not it was
  on screen.
- The hero title cycle no longer resets to an empty string between titles. It
  starts the next title at its first character, so the line never blanks.
- The reduced-motion rule that forced the scroll progress line to full width
  is removed. The progress line now tracks scroll directly under reduced
  motion.

## 5. Offscreen and tab behavior

- `HeroTitles` uses an IntersectionObserver with threshold 0. Timers are
  cleared when the hero leaves the viewport and resume when it returns.
- The Playground already pauses through an IntersectionObserver.
- LomaVerse and IP-Sage already pause through their visibility observers and
  demand frameloops.
- No other motion loops. Draws and signals are finite.
- Lenis is skipped when `prefers-reduced-motion: reduce` matches.

## 6. Reduced motion

- Page transitions: instant, opacity 1.
- Reveals: instant, no transform.
- Constellation and harmonic draws: static final state.
- Constellation twinkle: static, opacity 1.
- Hero titles: first title, no cycle.
- Scroll progress: direct scroll value, no spring.
- Atmosphere: static.
- Playground: static frame.
- LomaVerse and IP-Sage: absent.

## 7. Verification

- Reduced-motion Playwright pass checks the twinkle and atmosphere animation
  names are `none`, the route transition is opacity 1, and the progress line
  is present.
- Full pass checks the page transition reaches opacity 1, no console errors,
  no horizontal overflow, and no layout shift.
- The build and typecheck run after the motion changes.
