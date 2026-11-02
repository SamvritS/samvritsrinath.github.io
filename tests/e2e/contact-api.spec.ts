import { test, expect } from "@playwright/test";

test("contact endpoint rejects malformed and non-object JSON", async ({
  request,
}) => {
  const malformed = await request.post("/api/contact", {
    headers: { "content-type": "application/json" },
    data: "{",
  });
  expect(malformed.status()).toBe(400);

  const nonObject = await request.post("/api/contact", {
    headers: { "content-type": "application/json" },
    data: "null",
  });
  expect(nonObject.status()).toBe(400);
});

test("contact endpoint requires an application/json content type", async ({
  request,
}) => {
  const response = await request.post("/api/contact", {
    headers: { "content-type": "text/plain" },
    data: "{}",
  });
  expect(response.status()).toBe(415);
});

test("contact endpoint rejects oversized and invalid submissions", async ({
  request,
}) => {
  const oversized = await request.post("/api/contact", {
    headers: { "content-type": "application/json" },
    data: JSON.stringify({ name: "A", email: "a@example.com", message: "x".repeat(9000) }),
  });
  expect(oversized.status()).toBe(413);

  const invalidEmail = await request.post("/api/contact", {
    headers: { "content-type": "application/json" },
    data: { name: "Ada", email: "invalid", message: "Hello." },
  });
  expect(invalidEmail.status()).toBe(400);
});

test("contact endpoint rejects cross-origin browser submissions", async ({
  request,
}) => {
  const response = await request.post("/api/contact", {
    headers: {
      origin: "https://attacker.example",
      "content-type": "application/json",
    },
    data: { name: "Ada", email: "ada@example.com", message: "Hello." },
  });
  expect(response.status()).toBe(403);
});

test("contact endpoint rejects bot honeypot submissions", async ({
  request,
}) => {
  const response = await request.post("/api/contact", {
    headers: { "content-type": "application/json" },
    data: {
      name: "Ada",
      email: "ada@example.com",
      message: "Hello.",
      company: "Acme Inc",
    },
  });
  expect(response.status()).toBe(400);
});

test("site responds with browser security headers", async ({ request }) => {
  const response = await request.get("/");
  expect(response.headers()["x-content-type-options"]).toBe("nosniff");
  expect(response.headers()["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(response.headers()["x-frame-options"]).toBe("SAMEORIGIN");
  expect(response.headers()["permissions-policy"]).toContain("camera=()");
});

test("site responds with HSTS and report-only CSP", async ({ request }) => {
  const response = await request.get("/");
  expect(response.headers()["strict-transport-security"]).toContain("max-age=");
  expect(
    response.headers()["content-security-policy-report-only"],
  ).toContain("default-src 'self'");
});
