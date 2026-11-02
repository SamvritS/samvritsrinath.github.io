import Link from "next/link";
import { ArrowUpRight, Envelope } from "@/components/ui-icons";
import { GithubIcon, LinkedinIcon } from "@/components/icons";
import { CopyButton } from "@/components/copy-button";
import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="relative border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 py-10 lg:flex-row">
        <div className="flex items-center gap-5">
          <a
            href={site.contact.github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="flex h-10 w-10 items-center justify-center border border-line text-ink-soft transition-colors hover:border-accent hover:text-ink"
          >
            <GithubIcon className="h-[18px] w-[18px]" />
          </a>
          <a
            href={site.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="flex h-10 w-10 items-center justify-center border border-line text-ink-soft transition-colors hover:border-accent hover:text-ink"
          >
            <LinkedinIcon className="h-[18px] w-[18px]" />
          </a>
          <a
            href={`mailto:${site.contact.email}`}
            aria-label="Email"
            className="flex h-10 w-10 items-center justify-center border border-line text-ink-soft transition-colors hover:border-accent hover:text-ink"
          >
            <Envelope className="h-4.5 w-4.5" />
          </a>
        </div>

        <div className="flex flex-col items-center gap-3">
          <div className="font-mono text-xs tracking-widest text-ink-faint">
            NETWORK OBSERVATORY · SAN JOSE
          </div>
          <div className="flex items-center gap-3 font-mono text-xs text-ink-soft">
            <span>
              {site.name} · <span className="text-accent">{site.contact.email}</span>
            </span>
            <CopyButton text={site.contact.email} />
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 lg:items-end">
          <div className="flex items-center gap-4 text-sm text-ink-soft">
            <Link
              href="/resume"
              className="flex items-center gap-1 transition-colors hover:text-ink"
            >
              Résumé
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
            <Link
              href="/playground"
              data-testid="footer-playground"
              className="transition-colors hover:text-ink"
            >
              Playground
            </Link>
            <Link
              href="/privacy"
              data-testid="footer-privacy"
              className="transition-colors hover:text-ink"
            >
              Privacy
            </Link>
            <Link
              href="/terms"
              data-testid="footer-terms"
              className="transition-colors hover:text-ink"
            >
              Terms
            </Link>
            <span className="text-ink-faint">
              © {new Date().getFullYear()}
            </span>
          </div>
          <p
            data-testid="last-updated"
            className="font-mono text-xs text-ink-faint"
          >
            Last updated {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </footer>
  );
}
