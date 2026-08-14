import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="relative border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 md:flex-row">
        <div className="flex items-center gap-5">
          <a
            href={site.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
          >
            <GithubIcon className="h-[18px] w-[18px]" />
          </a>
          <a
            href={site.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
          >
            <LinkedinIcon className="h-[18px] w-[18px]" />
          </a>
          <a
            href={`mailto:${site.contact.email}`}
            aria-label="Email"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
          >
            <Mail className="h-4.5 w-4.5" />
          </a>
        </div>

        <div className="font-mono text-xs tracking-widest text-ink-faint">
          {site.name} — {site.tagline}
        </div>

        <div className="flex items-center gap-4 text-sm text-ink-soft">
          <Link
            href="/resume"
            className="flex items-center gap-1 transition-colors hover:text-ink"
          >
            Résumé
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          <span className="text-ink-faint">
            © {new Date().getFullYear()}
          </span>
        </div>
      </div>
    </footer>
  );
}