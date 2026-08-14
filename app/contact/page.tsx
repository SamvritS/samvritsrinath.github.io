"use client";

import { useState } from "react";
import { Loader2, Check, AlertTriangle } from "lucide-react";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "success" | "error";

const inputClass =
  "w-full rounded-xl border border-line bg-surface/70 px-5 py-3.5 text-[15px] text-ink placeholder:text-ink-faint transition-colors focus:border-line-strong focus:outline-none";

export default function ContactPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const update =
    (field: keyof typeof form) =>
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
    };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 pb-28 pt-36 md:pt-44">
      <header className="mb-14">
        <p className="eyebrow mb-5 flex items-center gap-3">
          <span className="text-ink-faint">Contact</span>
          <span className="h-px w-8 bg-current opacity-40" />
          <span>Get in touch</span>
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-ink md:text-6xl">
          Say hello.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft md:text-lg">
          Software engineering roles, systems work, or research — I read
          everything. Prefer email? Write to{" "}
          <a
            href={`mailto:${site.contact.email}`}
            className="text-indigo hover:underline"
          >
            {site.contact.email}
          </a>
          .
        </p>
      </header>

      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-faint">
              Name
            </span>
            <input
              required
              value={form.name}
              onChange={update("name")}
              placeholder="Ada Lovelace"
              className={inputClass}
              autoComplete="name"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-faint">
              Email
            </span>
            <input
              required
              type="email"
              value={form.email}
              onChange={update("email")}
              placeholder="ada@example.com"
              className={inputClass}
              autoComplete="email"
            />
          </label>
        </div>

        <label className="flex flex-col gap-2">
          <span className="font-mono text-xs uppercase tracking-[0.18em] text-ink-faint">
            Message
          </span>
          <textarea
            required
            rows={6}
            value={form.message}
            onChange={update("message")}
            placeholder="Tell me about what you're building…"
            className={cn(inputClass, "resize-y")}
          />
        </label>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            disabled={status === "sending"}
            className="flex items-center gap-2 rounded-full bg-indigo px-8 py-3.5 text-sm font-medium text-white shadow-[0_8px_32px_-12px_var(--glow)] transition-all duration-300 hover:bg-indigo/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "sending" && (
              <Loader2 className="h-4 w-4 animate-spin" />
            )}
            {status === "sending" ? "Sending…" : "Send message"}
          </button>

          {status === "success" && (
            <span className="flex items-center gap-2 text-sm text-indigo">
              <Check className="h-4 w-4" />
              Message sent — thank you.
            </span>
          )}
          {status === "error" && (
            <span className="flex items-center gap-2 text-sm text-gold">
              <AlertTriangle className="h-4 w-4" />
              Couldn&apos;t send. Email me directly instead.
            </span>
          )}
        </div>
      </form>
    </div>
  );
}