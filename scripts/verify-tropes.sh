#!/usr/bin/env bash
set -euo pipefail

# Every rule below names a file it greps. A grep against a missing path exits
# 2, which in a `&&` list is indistinguishable from a clean non-match, so a
# renamed or deleted file silently voids its own rule. Assert each gated path
# exists first, so a missing file fails loudly instead of passing.
for gated in components/figure.tsx components/hero.tsx components/portrait.tsx \
  app/globals.css app/layout.tsx scripts/verify-copy.ts; do
  [ -e "$gated" ] || { echo "FAIL: gated path missing, rule would be vacuous: $gated"; exit 1; }
done

# The planetary runtime is removed, not dormant. Reintroducing any of these
# paths must fail the gate rather than quietly rejoin the bundle.
for gone in components/planetary-journey data/transit.ts \
  public/assets/projects/transit; do
  [ ! -e "$gone" ] || { echo "FAIL: removed runtime path exists: $gone"; exit 1; }
done

STYLE='backdrop-blur|glass-|lucide|rounded-(2xl|3xl)|shadow-(sm|md|lg|xl|2xl)|drop-shadow|sparkle|animate-(bounce|pulse|spin)'
grep -rEn "$STYLE" app components data lib --include='*.tsx' --include='*.ts' --include='*.css' && { echo 'FAIL: banned pattern'; exit 1; }

# Atmosphere treatments are centralized: gradients and blur may only exist
# inside the marked block in app/globals.css. A component that reaches for
# bg-linear-to-r or blur-lg is the same unrestricted gradient problem wearing a
# utility class, so both the declaration and the utility are gated.
grep -q 'atmosphere:allow-begin' app/globals.css && grep -q 'atmosphere:allow-end' app/globals.css \
  || { echo 'FAIL: atmosphere allow block markers missing from app/globals.css'; exit 1; }
tmp_css=$(mktemp)
trap 'rm -f "$tmp_css"' EXIT
perl -0pe 's{/\* atmosphere:allow-begin \*/.*?/\* atmosphere:allow-end \*/}{}gs' app/globals.css > "$tmp_css"
grep -nE 'linear-gradient|radial-gradient|conic-gradient|filter:[^;]*blur\(' "$tmp_css" \
  && { echo 'FAIL: atmosphere treatment outside the approved globals block'; exit 1; }
grep -rEn 'bg-(linear|radial|conic)(-|\[)|\b(blur|backdrop-blur)-' app components data lib \
  --include='*.tsx' --include='*.ts' --include='*.css' \
  && { echo 'FAIL: gradient or blur utility in a component'; exit 1; }
grep -rEn 'hover:(translate|scale|rotate)' app components --include='*.tsx' \
  | grep -vE 'hover:-?translate-y-px' \
  && { echo 'FAIL: hover transform outside the 1px allowance'; exit 1; }
# rounded-full is banned except components/portrait.tsx: the portrait on About
# is the one circular element and matches the supplied LinkedIn image.
grep -rEn 'rounded-full' app components data lib --include='*.tsx' --include='*.ts' --include='*.css' | grep -v 'components/portrait.tsx' && { echo 'FAIL: rounded-full outside portrait'; exit 1; }
grep -rn '—' data components app --include='*.ts' --include='*.tsx' && { echo 'FAIL: em dash in copy'; exit 1; }
grep -rEn '\bInter\b|\bGeist\b|Space[_ ]Grotesk' app components lib next.config.ts && { echo 'FAIL: banned font'; exit 1; }
grep -rn '✓\|✔' components app && { echo 'FAIL: checkmark bullet'; exit 1; }
grep -n 'aspect-\\[4/3\\].*object-contain.*p-6\\|object-contain.*p-6.*aspect-\\[4/3\\]' components/figure.tsx && { echo 'FAIL: Defect 1 thumbnail pattern'; exit 1; }
grep -n 'md:absolute' components/hero.tsx && { echo 'FAIL: absolute hero stage'; exit 1; }
# bg-white and bare #fff only in documented exceptions (print sheet, OG image)
grep -rEn 'bg-white' app components lib --include='*.tsx' --include='*.ts' --include='*.css' && { echo 'FAIL: bg-white'; exit 1; }
grep -rEn '#[fF]{3}\b|#[fF]{6}\b' app components lib --include='*.tsx' --include='*.ts' --include='*.css' | grep -v 'app/globals.css\|app/opengraph-image.tsx\|app/resume/page.tsx' && { echo 'FAIL: bare white hex'; exit 1; }
# colored left-stripe borders, gradient headline text, decorative orb blends
grep -rn 'border-l-4' app components --include='*.tsx' && { echo 'FAIL: left stripe'; exit 1; }
grep -rn 'bg-clip-text\|text-transparent' app components --include='*.tsx' && { echo 'FAIL: gradient text'; exit 1; }
grep -rEn 'blur-|saturate-|mix-blend-screen' app components --include='*.tsx' && { echo 'FAIL: orb blend'; exit 1; }
# emoji in copy (excluding copyright/trademark symbols; skipped if rg absent)
if command -v rg >/dev/null 2>&1; then
  rg '\p{Extended_Pictographic}' app components data --glob '*.tsx' --glob '*.ts' | grep -v '[©®™]' && { echo 'FAIL: emoji in copy'; exit 1; }
fi
# exclamation hype in UI copy strings
grep -rEn "'[^']*![^']*'|\"[^\"]*![^\"]*\"" data --include='*.ts' && { echo 'FAIL: ! in data copy'; exit 1; }
# terminal-window motifs
grep -rEn -i 'terminal|cli-window|prompt-line' app components --include='*.tsx' | grep -vi 'determine' && { echo 'FAIL: terminal motif'; exit 1; }
# A raw colour literal in a themed surface is the same ban wearing a different
# hat, so it is checked too. The exemptions are narrow and each is a documented
# case, not a widening of the rule:
#   lomaverse-sim.tsx  swatch()'s sentinel and its ink-faint fallback, both
#                      load-bearing for the alpha-folding three-d.spec.ts guards
grep -rEn '(#[0-9a-fA-F]{3,8}\b|rgb\([0-9]+, ?[0-9]+, ?[0-9]+\))' app components lib --include='*.tsx' --include='*.ts' \
  | grep -vE 'data/projects\.ts|data/research\.ts|app/globals\.css|app/opengraph-image\.tsx|app/resume/page\.tsx|components/demos/lomaverse-sim\.tsx' \
  && { echo 'FAIL: stray colour literal'; exit 1; }
# transform-based hover effects and state-detached infinite loops
grep -rEn 'hover:(translate|scale|rotate)' app components --include='*.tsx' && { echo 'FAIL: hover transform'; exit 1; }
grep -rEn 'animate-infinite|iteration-count:[^1]' app components --include='*.tsx' --include='*.css' | grep -v 'iteration-count: 1' && { echo 'FAIL: infinite loop'; exit 1; }
# dialog images must not carry fixed pixel dimensions (Defect 1 pattern)
grep -n 'width={[0-9]' components/figure.tsx && { echo 'FAIL: fixed dialog image size'; exit 1; }
# L1, critical path. This is the one part of the load-performance contract
# that gates in CI, because it is a property of the committed source and of
# the built HTML rather than of a machine's timing: a heavy asset referenced
# from the initial document, or a synchronous script we own, is a regression
# regardless of how fast the runner is. Everything else in the load contract
# is measured in tests/e2e/load-perf.spec.ts, where thresholds belong.
#
# The three checks below are deliberately narrow, and each was negative-tested
# by planting the exact violation and watching this script exit non-zero.
# A grep that cannot fail is not a gate: see the v5.5 dead-rule record in the
# plan doc, where two rules printed OK while grepping a file that never
# existed. So every path read here is asserted to exist first.

[ -d .next/server/app ] || { echo 'FAIL: no build output; run `bun run build` first'; exit 1; }
route_html=$(find .next/server/app -maxdepth 2 -name 'index.html' | head -1)
[ -n "$route_html" ] || { echo 'FAIL: no prerendered index.html to inspect'; exit 1; }

# Banned vocabulary, checked against prose rather than against source. The rule
# used to grep app/, components/ and lib/, which failed a content rule on an
# identifier or a CSS class ("./journey-data", ".planetary-journey-canvas") while
# saying nothing about what a reader sees. scripts/verify-copy.ts now scans the
# data modules at source and every prerendered route as rendered text, so it
# covers more surface with fewer false hits. It lives here, after the build
# assertion, because half of it reads the built HTML.
bun scripts/verify-copy.ts || { echo 'FAIL: banned copy'; exit 1; }

# One definition of "heavy", shared by all three rules below so they cannot
# drift apart. It did drift once: L1a matched /assets/(3d|svs|frames)/ while
# L1b matched a narrower set, and negative-testing L1b is what caught it.
HEAVY='/assets/(3d|svs|frames)/'

# Split the document so each rule owns one region and can be proven to fail on
# its own. Before this, a heavy <link> in <head> also matched L1a's whole-file
# scan, so L1a always fired first and L1b was never independently exercised.
head_html=$(perl -0ne 'print $1 if /<head[^>]*>(.*?)<\/head>/s' "$route_html")
body_html=$(perl -0ne 'print $1 if /<body[^>]*>(.*)<\/body>/s' "$route_html")

# L1a: the document body must not reference a heavy asset. A reference there is
# an eager fetch on the critical path.
if printf '%s' "$body_html" | grep -oE "$HEAVY" | head -1 | grep -q .; then
  echo "FAIL: L1a heavy asset referenced in initial HTML body: $route_html"
  printf '%s' "$body_html" | grep -oE "$HEAVY" | sort -u | sed 's/^/    /'
  exit 1
fi

# L1b: no preload, prefetch, or preconnect may point at a heavy asset. Preload
# is the shape that looks harmless in review and still costs first paint.
if printf '%s' "$head_html" | grep -oE '<link[^>]+rel="(preload|prefetch|preconnect)"[^>]*>' \
   | grep -qE "$HEAVY"; then
  echo 'FAIL: L1b heavy asset preloaded in initial HTML head'
  printf '%s' "$head_html" | grep -oE '<link[^>]+rel="(preload|prefetch|preconnect)"[^>]*>' \
    | grep -E "$HEAVY" | sed 's/^/    /'
  exit 1
fi

# L1c: the only synchronous, first-party inline script we author is
# #theme-init, which must stay in the body (AGENTS.md, hydration contract).
# Next.js emits its own RSC flight payload as bare <script> tags; those are
# framework-mandated and are not ours to gate, so they are excluded by
# requiring an id. Any src-less script carrying an id other than theme-init
# or json-ld is ours and is a finding.
stray=$(printf '%s' "$body_html" | grep -oE '<script id="[^"]+"' \
        | sed -E 's/<script id="([^"]+)"/\1/' \
        | grep -vE '^(theme-init|json-ld)$' || true)
if [ -n "$stray" ]; then
  echo 'FAIL: L1c unexpected first-party inline script id(s) on the critical path:'
  echo "$stray" | sed 's/^/    /'
  exit 1
fi

echo 'OK: trope-free'
echo 'OK: L1 critical path (no heavy asset refs in body, no heavy preloads in head, no stray inline script ids)'
