import { NextResponse } from "next/server";
import emailjs from "@emailjs/nodejs";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { name?: string; email?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  if (name.length > 200 || email.length > 200 || message.length > 5000) {
    return NextResponse.json({ error: "Message too large" }, { status: 400 });
  }

  try {
    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID!,
      process.env.EMAILJS_TEMPLATE_ID!,
      { user_name: name, user_email: email, message },
      {
        publicKey: process.env.EMAILJS_PUBLIC_KEY!,
        privateKey: process.env.EMAILJS_PRIVATE_KEY!,
      },
    );
    return NextResponse.json({ ok: true, status: response.status });
  } catch {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}