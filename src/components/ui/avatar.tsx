import * as React from "react";
import { cn } from "@/lib/utils";

const sizes = {
  sm: "size-8 text-[11px]",
  default: "size-9 text-[13px]",
  lg: "size-12 text-base",
  xl: "size-16 text-xl",
};

/** Monogram avatar in the style of Contacts. */
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
        "relative inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-gradient-to-b from-[#a8a8ad] to-[#8a8a8f] font-medium tracking-wide text-white dark:from-[#6e6e73] dark:to-[#545458]",
        ring && "ring-2 ring-foreground ring-offset-2 ring-offset-card",
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
