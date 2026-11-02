import Image from "next/image";
import { cn } from "@/lib/utils";

export function LogoTile({
  src,
  alt,
  className,
  bare = false,
}: {
  src: string;
  alt: string;
  className?: string;
  bare?: boolean;
}) {
  return (
    <span
      data-testid="logo-tile"
      data-bare={bare ? "true" : undefined}
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        !bare && "aspect-square border border-logo-border bg-logo-plate p-2",
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={100}
        height={100}
        className="h-full w-full object-contain"
      />
    </span>
  );
}
