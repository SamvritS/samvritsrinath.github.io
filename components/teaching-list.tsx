import { LogoTile } from "@/components/logo-tile";
import { teaching } from "@/data/education";
import { clean } from "@/lib/copy";

export function TeachingList() {
  const roles = teaching.flatMap((company) =>
    company.roles.map((role) => ({
      ...role,
      company: company.company,
      logo: company.logo,
    })),
  );

  return (
    <ul className="flex flex-col">
      {roles.map((role) => (
        <li
          key={`${role.company}-${role.role}`}
          className="grid gap-4 border-t border-line py-8 md:grid-cols-[220px_1fr] md:gap-10"
        >
          <div>
            <p className="font-mono text-xs tabular-nums text-ink-faint">
              {clean(role.duration)}
            </p>
            <div className="mt-2 flex items-center gap-3">
              {role.logo && (
                <LogoTile
                  src={role.logo}
                  alt={`${role.company} logo`}
                  className="h-12 w-12"
                  bare
                />
              )}
              <p className="text-sm text-ink-soft">{clean(role.company)}</p>
            </div>
          </div>

          <div>
            <h3 className="text-base font-medium text-ink">
              {clean(role.role)}
            </h3>
            {role.description.length > 0 && (
              <ul className="mt-3 flex flex-col gap-2">
                {role.description.map((line) => (
                  <li key={line} className="read flex gap-3">
                    <span aria-hidden className="text-ink-faint">
                      +
                    </span>
                    {clean(line)}
                  </li>
                ))}
              </ul>
            )}
            {role.technologies.length > 0 && (
              <p className="mt-4 font-mono text-xs tracking-[0.12em] text-ink-faint">
                {role.technologies.join(" · ")}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
