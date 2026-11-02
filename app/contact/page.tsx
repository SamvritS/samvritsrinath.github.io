"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Warning } from "@/components/ui-icons";
import { CopyButton } from "@/components/copy-button";
import { PageHeader } from "@/components/page-header";
import { readUtm } from "@/components/utm-capture";
import { site } from "@/data/site";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "success" | "error";

const inputClass =
  "w-full border border-line bg-surface px-5 py-3.5 text-[15px] text-ink placeholder:text-ink-faint transition-colors focus:border-line-strong";

const FAQS = [
  {
    q: "Are you open to work?",
    a: "Yes. Industry software engineering roles, Networking or ML Inference Work, Or potential research collaboration.",
  },
  {
    q: "Where are you based?",
    a: "San Jose, California.",
  },
  {
    q: "Is your code available?",
    a: "Project pages link to public repositories where the code is open.",
  },
  {
    q: "How do I cite your papers?",
    a: "Use the Cite button on research cards, or open the PDF for the full reference.",
  },
  {
    q: "What should I include?",
    a: "Your name, a contact address, and a short note on what you are building.",
  },
];

export default function ContactPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [company, setCompany] = useState("");
  const cancelRef = useRef<HTMLButtonElement>(null);
  const submitRef = useRef<HTMLButtonElement>(null);

  const update =
    (field: keyof typeof form) =>
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
    };

  useEffect(() => {
    if (!confirmOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [confirmOpen]);

  useEffect(() => {
    if (status === "success" || status === "error") {
      submitRef.current?.focus();
    }
  }, [status]);

  function closeConfirm() {
    setConfirmOpen(false);
    window.setTimeout(() => submitRef.current?.focus(), 0);
  }

  async function send() {
    setConfirmOpen(false);
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, company, utm: readUtm() }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      setForm({ name: "", email: "", message: "" });
      setCompany("");
    } catch {
      setStatus("error");
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setConfirmOpen(true);
  }

  function onDialogKey(e: React.KeyboardEvent) {
    if (e.key === "Escape") closeConfirm();
    if (e.key === "Tab") {
      const els = e.currentTarget.querySelectorAll("button");
      if (els.length === 0) return;
      const first = els[0];
      const last = els[els.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 pb-28 pt-36 md:pt-44">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
      <div inert={confirmOpen}>
      <PageHeader
        index="04"
        kicker="Contact"
        title="Say hello."
        description="Software engineering roles, Networking or ML Inference Work, Or potential research collaboration."
      />

      <div className="mt-6 grid gap-4 lg:grid-cols-12 lg:gap-12">
        <div className="flex flex-wrap items-center gap-3 lg:col-span-9 lg:col-start-4">
          <a
            href={`mailto:${site.contact.email}`}
            className="font-mono text-sm text-ink transition-colors hover:text-accent"
          >
            {site.contact.email}
          </a>
          <CopyButton text={site.contact.email} />
        </div>
      </div>

      <div className="mt-14 grid gap-16 lg:grid-cols-12 lg:gap-12">
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-5 lg:col-span-6 lg:col-start-4"
        >
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
            placeholder="Tell me about what you are interested in."
            className={cn(inputClass, "resize-y")}
          />
        </label>

        <div
          aria-hidden="true"
          className="absolute h-px w-px overflow-hidden opacity-0"
        >
          <label>
            Company, leave this field empty
            <input
              name="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              autoComplete="off"
              tabIndex={-1}
            />
          </label>
        </div>

        <div className="flex items-center gap-4 pt-2">
          <button
            type="submit"
            ref={submitRef}
            data-testid="contact-submit"
            disabled={status === "sending"}
            className="flex items-center gap-2 border border-ink bg-ink px-8 py-3.5 font-mono text-sm text-void transition-colors hover:border-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "sending" ? "Sending" : "Send message"}
          </button>

          {status === "success" && (
            <span className="flex items-center gap-2 text-sm text-ink">
              <Check className="h-4 w-4" />
              Message sent. Thank you.
            </span>
          )}
          {status === "error" && (
            <span className="flex items-center gap-2 text-sm text-accent">
              <Warning className="h-4 w-4" />
              Could not send. Email me directly instead.
            </span>
          )}
          <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
            {status === "success" ? "Message sent. Thank you." : ""}
          </div>
          <div className="sr-only" role="alert" aria-live="assertive" aria-atomic="true">
            {status === "error" ? "Could not send. Email me directly instead." : ""}
          </div>
        </div>
        </form>

        <section
          aria-label="Frequently asked questions"
          className="lg:col-span-3 lg:col-start-10"
        >
          <h2 className="font-mono text-[0.6875rem] uppercase tracking-[0.2em] text-ink-faint">
            Questions
          </h2>
          <div className="mt-6 flex flex-col divide-y divide-line border-y border-line">
            {FAQS.map((f, i) => {
              const open = openFaq === i;
              const questionId = `faq-question-${i}`;
              const answerId = `faq-answer-${i}`;
              return (
                <div key={f.q}>
                  <button
                    type="button"
                    id={questionId}
                    data-testid="faq-item"
                    aria-expanded={open}
                    aria-controls={answerId}
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <span className="text-[15px] font-medium text-ink">
                      {f.q}
                    </span>
                    <span aria-hidden className="font-mono text-ink-faint">
                      {open ? "-" : "+"}
                    </span>
                  </button>
                  <div
                    id={answerId}
                    role="region"
                    aria-labelledby={questionId}
                    hidden={!open}
                    className="pb-5"
                  >
                    <p className="read">{f.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/40 p-6">
          <div
            data-testid="confirm-dialog"
            role="dialog"
            aria-modal="true"
            aria-label="Confirm message"
            onKeyDown={onDialogKey}
            className="w-full max-w-md border border-line-strong bg-surface p-8"
          >
            <h2 className="text-lg font-semibold tracking-tight text-ink">
              Send this message?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              This will send your message to {site.contact.email}.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                data-testid="confirm-send"
                autoFocus
                onClick={send}
                className="border border-ink bg-ink px-6 py-2.5 font-mono text-sm text-void transition-colors hover:border-accent hover:bg-accent"
              >
                Send
              </button>
              <button
                type="button"
                ref={cancelRef}
                onClick={closeConfirm}
                className="border border-line-strong px-6 py-2.5 font-mono text-sm text-ink transition-colors hover:border-accent"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
