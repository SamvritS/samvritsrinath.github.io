import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

test("gsap is gone from the dependency tree and the source", () => {
  const pkg = JSON.parse(readFileSync("package.json", "utf8")) as {
    dependencies: Record<string, string>;
  };
  assert.equal(pkg.dependencies.gsap, undefined);
  const hits = [...walk("app"), ...walk("components"), ...walk("lib")]
    .filter((p) => /\.(ts|tsx)$/.test(p))
    .filter((p) => readFileSync(p, "utf8").includes("gsap"));
  assert.deepEqual(hits, []);
});
