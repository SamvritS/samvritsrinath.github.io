import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { BANNED_COPY } from "../lib/banned-copy";

// The copy ban used to grep app/, components/ and lib/ for the vocabulary, which
// meant an identifier or a stylesheet class could fail a content rule. It now
// reads the two surfaces that actually carry reader-facing prose: the content
// modules at source, and every prerendered route as a reader receives it.

const offenders: string[] = [];

function walk(dir: string, extensions: string[]): string[] {
  const found: string[] = [];
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) found.push(...walk(path, extensions));
    else if (extensions.some((ext) => entry.endsWith(ext))) found.push(path);
  }
  return found;
}

function report(path: string, where: string, excerpt: string): void {
  offenders.push(`${path} ${where}: ${excerpt}`);
}

const dataModules = walk("data", [".ts"]);
for (const path of dataModules) {
  const lines = readFileSync(path, "utf8").split("\n");
  lines.forEach((line, i) => {
    const match = BANNED_COPY.exec(line);
    if (match) report(path, `line ${i + 1}`, match[0]);
  });
}

function renderedText(html: string): string {
  return html
    .replace(/<(script|style|template)\b[\s\S]*?<\/\1>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&#x2014;|&#8212;|&mdash;/gi, "-")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ");
}

const routeHtml = walk(".next/server/app", [".html"]);
for (const path of routeHtml) {
  const text = renderedText(readFileSync(path, "utf8"));
  const match = BANNED_COPY.exec(text);
  if (!match) continue;
  const at = match.index;
  report(path, "rendered", text.slice(Math.max(0, at - 40), at + 40));
}

if (routeHtml.length === 0 || dataModules.length === 0) {
  console.error(
    `FAIL: nothing to read (${routeHtml.length} route HTML, ${dataModules.length} data modules). ` +
      "A gate that scans no files is not a gate — run `bun run build` first.",
  );
  process.exit(1);
}

if (offenders.length > 0) {
  console.error(`FAIL: banned copy in ${offenders.length} place(s)`);
  for (const line of offenders) console.error(`  ${line}`);
  process.exit(1);
}

console.log(
  `OK: banned copy absent from ${routeHtml.length} rendered route(s) and ${dataModules.length} data modules`,
);
