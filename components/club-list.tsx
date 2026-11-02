import { ArrowUpRight } from "@/components/ui-icons";
import { LogoTile } from "@/components/logo-tile";
import { clubs } from "@/data/education";
import { clean } from "@/lib/copy";

export function ClubList() {
  return (
    <ul className="flex flex-col">
      {clubs.map((club) => (
        <li key={club.name}>
          <a
            href={club.website}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between gap-6 border-t border-line py-5"
          >
            <span className="flex min-w-0 items-center gap-4">
              {club.logo && (
                <LogoTile
                  src={club.logo}
                  alt={`${club.name} logo`}
                  className="h-11 w-11"
                />
              )}
              <span className="flex min-w-0 flex-wrap items-baseline gap-x-4 gap-y-1">
                <span className="text-base font-semibold tracking-tight text-ink">
                  {clean(club.name)}
                </span>
                <span className="text-sm text-ink-soft">{clean(club.role)}</span>
              </span>
            </span>
            <ArrowUpRight
              className="h-4 w-4 shrink-0 text-ink-faint transition-colors group-hover:text-accent"
              aria-hidden
            />
          </a>
        </li>
      ))}
    </ul>
  );
}
