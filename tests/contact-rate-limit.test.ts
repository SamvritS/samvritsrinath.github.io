import assert from "node:assert/strict";
import test from "node:test";
import { createContactRateLimiter } from "../lib/contact-rate-limit";

test("contact limiter caps one key and releases it after the window", () => {
  let now = 1000;
  const take = createContactRateLimiter({
    limit: 2,
    windowMs: 100,
    now: () => now,
  });

  assert.equal(take("client-a"), true);
  assert.equal(take("client-a"), true);
  assert.equal(take("client-a"), false);
  now += 100;
  assert.equal(take("client-a"), true);
});

test("contact limiter separates clients and bounds tracked keys", () => {
  const take = createContactRateLimiter({ limit: 1, windowMs: 100, maxKeys: 2 });
  assert.equal(take("client-a"), true);
  assert.equal(take("client-b"), true);
  assert.equal(take("client-c"), true);
  assert.equal(take("client-a"), true);
});
