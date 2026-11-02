import assert from "node:assert/strict";
import test from "node:test";
import { projects } from "../data/projects";
import { constellationEdges, constellationNodes } from "../data/constellation";

test("every node names a real project with a published metric", () => {
  assert.ok(constellationNodes.length >= 4);
  for (const node of constellationNodes) {
    const project = projects.find((p) => p.slug === node.slug);
    assert.ok(project, node.slug);
    assert.ok(project.metrics.length > 0, `${node.slug} has a metric`);
    assert.ok(node.x >= 0 && node.x <= 640, "x is inside the viewBox");
    assert.ok(node.y >= 0 && node.y <= 560, "y is inside the viewBox");
  }
});

test("every edge is a real shared technology", () => {
  assert.ok(constellationEdges.length >= 3);
  for (const edge of constellationEdges) {
    const from = projects.find((p) => p.slug === edge.from);
    const to = projects.find((p) => p.slug === edge.to);
    assert.ok(from && to, `${edge.from} -> ${edge.to}`);
    assert.ok(
      from.technologies.includes(edge.shared),
      `${edge.from} has ${edge.shared}`,
    );
    assert.ok(
      to.technologies.includes(edge.shared),
      `${edge.to} has ${edge.shared}`,
    );
  }
});

test("node positions are asymmetric", () => {
  const xs = new Set(constellationNodes.map((n) => n.x));
  const ys = new Set(constellationNodes.map((n) => n.y));
  assert.equal(xs.size, constellationNodes.length);
  assert.equal(ys.size, constellationNodes.length);
});
