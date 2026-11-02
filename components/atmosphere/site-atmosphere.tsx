import { Atmosphere } from "@/components/atmosphere/atmosphere";

export function SiteAtmosphere() {
  return (
    <div
      className="site-atmosphere"
      aria-hidden="true"
      data-testid="site-atmosphere"
    >
      <Atmosphere variant="ambient" />
    </div>
  );
}
