import type { Metadata } from "next";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...pageMetadata({
    title: "Privacy",
    description: "How this site handles personal data.",
    path: "/privacy",
  }),
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-24">
      <p className="eyebrow">Policy</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink">
        Privacy
      </h1>
      <div className="read mt-8 flex flex-col gap-6">
        <p>
          This is a personal portfolio site. It does not run accounts,
          paywalls, or comment systems, and there is no database of visitor
          profiles on the server.
        </p>
        <p>
          Two small preferences are stored in your own browser with
          localStorage: the theme choice and the cookie notice flag. Both
          stay on your device and are never sent anywhere.
        </p>
        <p>
          Campaign links may carry utm_source, utm_medium, or utm_campaign
          parameters. The site stores those values in your own browser with
          sessionStorage and attaches them to the contact form payload and
          email links so the owner knows which link you followed. They stay
          on your device until the tab closes and are never sold.
        </p>
        <p>
          The contact form sends the message you type to the site owner
          through the configured mail service. Do not include sensitive
          personal data in that form.
        </p>
        <p>
          Vercel Analytics and Speed Insights collect aggregate, anonymized
          usage counts to keep the site fast. They do not sell personal
          data.
        </p>
        <p className="font-mono text-xs tracking-widest text-ink-faint">
          LAST UPDATED 2026
        </p>
      </div>
    </div>
  );
}
