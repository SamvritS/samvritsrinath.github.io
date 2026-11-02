import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOTS = ["app", "components", "lib"];
const EXTENSIONS = new Set([".ts", ".tsx", ".css"]);
const ALLOWED = new Set(["app/globals.css"]);
const COLOR = /#[0-9a-fA-F]{3,8}\b|\brgba?\(\s*\d|\bhsla?\(\s*\d/;
const failures: string[] = [];

function walk(directory: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    if (entry.name.startsWith(".")) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...walk(path));
      continue;
    }
    if (EXTENSIONS.has(path.slice(path.lastIndexOf(".")))) files.push(path);
  }
  return files;
}

for (const root of ROOTS) {
  for (const file of walk(root)) {
    if (ALLOWED.has(file)) continue;
    const source = readFileSync(file, "utf8");
    source.split("\n").forEach((line, index) => {
      if (COLOR.test(line)) {
        failures.push(`${file}:${index + 1} raw colour literal: ${line.trim()}`);
      }
      if (line.includes("wavelength")) {
        failures.push(`${file}:${index + 1} legacy wavelength token: ${line.trim()}`);
      }
    });
  }
}

execFileSync(
  "bun",
  ["scripts/build-tokens.ts", "--out", "app/globals.css", "--check"],
  { stdio: "inherit" },
);

if (failures.length > 0) {
  console.error(`FAIL: ${failures.length} token violation(s)`);
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}

console.log("OK: tokens are current and no raw colour literals remain");
