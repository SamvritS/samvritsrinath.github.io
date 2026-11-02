#!/usr/bin/env bash
# Bundle and critical-path report. TELEMETRY, NOT A GATE.
#
# The gzipped byte budgets are retired by user directive (v5.5): transfer cost
# is CDN-served and cache-amortized, so totals are recorded for trend only and
# this script never fails on them. What it does fail on is the L1 critical-path
# contract, because that is a property of the built document rather than of a
# machine's speed: a heavy asset on the initial HTML is wrong on any runner.
#
# Everything else in the load contract is measured in
# tests/e2e/load-perf.spec.ts, where timing thresholds belong. Measuring
# thresholds in a shell script on shared CI hardware produces flaky failures
# that train people to ignore the gate.
set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -d .next/static/chunks ]; then
  echo 'No build output found. Run `bun run build` first.' >&2
  exit 1
fi

rows=$(mktemp)
trap 'rm -f "$rows"' EXIT

total=0
count=0
for f in .next/static/chunks/*.js; do
  [ -e "$f" ] || continue
  raw=$(wc -c < "$f" | tr -d ' ')
  gz=$(gzip -c "$f" | wc -c | tr -d ' ')
  total=$((total + gz))
  count=$((count + 1))
  # Classify by content, not filename: Turbopack hashes chunk names.
  if grep -q 'THREE.WebGLRenderer' "$f" 2>/dev/null; then
    kind='three/r3f'
  elif grep -q '__next_f' "$f" 2>/dev/null; then
    kind='flight'
  else
    kind='app'
  fi
  printf '%s\t%s\t%s\t%s\n' "$gz" "$raw" "$kind" "$(basename "$f")" >> "$rows"
done

echo '=== bundle telemetry (advisory, not gated) ==='
printf 'chunks:   %s\n' "$count"
printf 'total gz: %s B (%.1f KB)\n' "$total" "$(awk "BEGIN{print $total/1024}")"
echo
printf '%10s %11s  %-10s %s\n' 'gz B' 'raw B' 'kind' 'chunk'
printf '%10s %11s  %-10s %s\n' '----------' '-----------' '----------' '-----'
sort -rn "$rows" | head -12 | while IFS="$(printf '\t')" read -r gz raw kind name; do
  printf '%10s %11s  %-10s %s\n' "$gz" "$raw" "$kind" "$name"
done

three_gz=$(cut -f1,3 "$rows" | awk -F'\t' '$2=="three/r3f"{s+=$1} END{print s+0}')
echo
echo "three/r3f chunk gz: ${three_gz} B"
echo
echo 'Retired by user directive, recorded for trend only: +180KB total 3D,'
echo '+100KB hero, and the byte-identical 236,515 B three chunk from v5.2-5.4.'
echo 'The gates that do fail: scripts/verify-tropes.sh (L1) and'
echo 'tests/e2e/load-perf.spec.ts (L4, L5).'

echo
echo '=== L1 critical path (gated) ==='
bash scripts/verify-tropes.sh
echo 'measure:bundle: L1 clean'