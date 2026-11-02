import { Reveal } from "@/components/reveal";

type PageHeaderProps = {
  index: string;
  kicker: string;
  title: string;
  description?: string;
};

export function PageHeader({
  index,
  kicker,
  title,
  description,
}: PageHeaderProps) {
  return (
    <header data-testid="page-header" className="border-t border-line pt-5">
      <div className="grid gap-4 lg:grid-cols-12 lg:gap-12">
        <p className="eyebrow flex items-center gap-3 lg:col-span-3">
          <span className="text-accent">{index}</span>
          <span className="h-px w-6 bg-accent opacity-50" />
          {kicker}
        </p>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-9 lg:col-start-4">
          <Reveal mask>
            <h1 className="type-h1 max-w-4xl text-ink">{title}</h1>
          </Reveal>
          {description && (
            <p className="type-dek mt-5 max-w-2xl">{description}</p>
          )}
        </div>
      </div>
    </header>
  );
}
