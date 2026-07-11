import * as React from "react";
import { cn } from "@/lib/utils";

const sizes = {
  sm: "size-8 text-xs",
  default: "size-10 text-sm",
  lg: "size-12 text-base",
  xl: "size-16 text-lg",
};

export function Avatar({
  name,
  src,
  size = "default",
  className,
  ring,
}: {
  name?: string;
  src?: string;
  size?: keyof typeof sizes;
  className?: string;
  ring?: boolean;
}) {
  const initials = (name ?? "?")
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand-gradient font-semibold text-white",
        ring && "ring-2 ring-background ring-offset-2 ring-offset-primary/30",
        sizes[size],
        className,
      )}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name ?? ""} className="h-full w-full object-cover" />
      ) : (
        initials
      )}
    </span>
  );
}
