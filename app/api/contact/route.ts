import { NextResponse } from "next/server";
import emailjs from "@emailjs/nodejs";
import { createContactRateLimiter } from "@/lib/contact-rate-limit";

export const runtime = "nodejs";

const MAX_BODY_BYTES = 8 * 1024;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 5;
const takeRateLimit = createContactRateLimiter({
  limit: RATE_LIMIT,
  windowMs: RATE_WINDOW_MS,
});

type ContactPayload = {
  name: string;
  email: string;
  message: string;
  company?: unknown;
};

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers);
  headers.set("Cache-Control", "no-store");
  return NextResponse.json(body, { ...init, headers });
}

async function readLimitedBody(req: Request) {
  const declaredLength = Number(req.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_BODY_BYTES) {
    return { ok: false as const, tooLarge: true };
  }
  if (!req.body) return { ok: false as const, tooLarge: false };

  const reader = req.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_BODY_BYTES) {
        await reader.cancel();
        return { ok: false as const, tooLarge: true };
      }
      chunks.push(value);
    }
  } catch {
    return { ok: false as const, tooLarge: false };
  }

  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return { ok: true as const, body: new TextDecoder().decode(bytes) };
}

function isContactPayload(value: unknown): value is ContactPayload {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const input = value as Record<string, unknown>;
  return (
    typeof input.name === "string" &&
    typeof input.email === "string" &&
    typeof input.message === "string"
  );
}

function isAllowedOrigin(req: Request) {
  if (req.headers.get("sec-fetch-site") === "cross-site") return false;
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).origin === new URL(req.url).origin;
  } catch {
    return false;
  }
}

function withinRateLimit(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for");
  const key =
    forwarded?.split(",").map((value) => value.trim()).filter(Boolean).pop()?.slice(0, 64) ||
    req.headers.get("x-real-ip")?.slice(0, 64) ||
    "unknown";
  return takeRateLimit(key);
}

export async function POST(req: Request) {
  if (!isAllowedOrigin(req)) {
    return jsonResponse({ error: "Request not allowed" }, { status: 403 });
  }
  const contentType = req.headers.get("content-type")?.split(";", 1)[0].trim().toLowerCase();
  if (contentType !== "application/json") {
    return jsonResponse({ error: "Expected JSON" }, { status: 415 });
  }

  const body = await readLimitedBody(req);
  if (!body.ok) {
    const status = body.tooLarge ? 413 : 400;
    return jsonResponse(
      { error: status === 413 ? "Message too large" : "Invalid request" },
      { status },
    );
  }

  let value: unknown;
  try {
    value = JSON.parse(body.body);
  } catch {
    return jsonResponse({ error: "Invalid request" }, { status: 400 });
  }
  if (!isContactPayload(value)) {
    return jsonResponse({ error: "Missing fields" }, { status: 400 });
  }
  if (typeof value.company === "string" && value.company.trim() !== "") {
    return jsonResponse({ error: "Invalid request" }, { status: 400 });
  }

  const name = value.name.trim();
  const email = value.email.trim();
  const message = value.message.trim();
  if (!name || !email || !message) {
    return jsonResponse({ error: "Missing fields" }, { status: 400 });
  }
  if (name.length > 200 || email.length > 200 || message.length > 5000) {
    return jsonResponse({ error: "Message too large" }, { status: 413 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResponse({ error: "Invalid email address" }, { status: 400 });
  }
  if (!withinRateLimit(req)) {
    return jsonResponse(
      { error: "Too many requests" },
      { status: 429, headers: { "retry-after": "600" } },
    );
  }

  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;
  if (!serviceId || !templateId || !publicKey || !privateKey) {
    return jsonResponse({ error: "Contact service unavailable" }, { status: 503 });
  }

  try {
    const response = await emailjs.send(
      serviceId,
      templateId,
      { user_name: name, user_email: email, message },
      { publicKey, privateKey },
    );
    return jsonResponse({ ok: true, status: response.status });
  } catch {
    return jsonResponse({ error: "Failed to send message" }, { status: 502 });
  }
}
