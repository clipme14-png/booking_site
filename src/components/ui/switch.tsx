"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** iOS-style switch. */
export function Switch({
  checked,
  onCheckedChange,
  className,
  disabled,
  "aria-label": ariaLabel,
}: {
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
  className?: string;
  disabled?: boolean;
  "aria-label"?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex h-[26px] w-[42px] shrink-0 items-center rounded-full p-[2px] transition-colors duration-300 ease-[var(--ease-apple)] disabled:opacity-40",
        checked ? "bg-success" : "bg-foreground/15",
        className,
      )}
    >
      <span
        className={cn(
          "inline-block size-[22px] rounded-full bg-white shadow-[0_2px_6px_rgb(0_0_0/0.18),0_0_0_0.5px_rgb(0_0_0/0.04)] transition-transform duration-300 ease-[var(--ease-apple)]",
          checked ? "translate-x-4" : "translate-x-0",
        )}
      />
    </button>
  );
}
