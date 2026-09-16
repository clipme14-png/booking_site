"use client";

import * as React from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  icon,
  change,
  changeLabel,
  className,
  children,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
  change?: number;
  changeLabel?: string;
  /** Retained for API compatibility; stat cards are monochrome. */
  accent?: "primary" | "secondary" | "accent" | "warning";
  className?: string;
  children?: React.ReactNode;
}) {
  const positive = (change ?? 0) >= 0;

  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13px] font-medium text-muted-foreground">{label}</p>
        {icon && (
          <span className="text-muted-foreground/70 [&_svg]:size-4 [&_svg]:stroke-[1.75]">
            {icon}
          </span>
        )}
      </div>
      <p className="tabular mt-3 text-[28px] font-semibold leading-none tracking-tight">
        {value}
      </p>
      {change !== undefined && (
        <p className="mt-3 flex items-center gap-1 text-xs">
          <span
            className={cn(
              "inline-flex items-center gap-0.5 font-medium tabular [&_svg]:size-3.5",
              positive ? "text-success" : "text-destructive",
            )}
          >
            {positive ? <ArrowUpRight /> : <ArrowDownRight />}
            {Math.abs(change)}%
          </span>
          {changeLabel && (
            <span className="text-muted-foreground">{changeLabel}</span>
          )}
        </p>
      )}
      {children}
    </Card>
  );
}

/** Number that eases up to its value once scrolled into view. */
export function CountUp({
  value,
  duration = 1.4,
  decimals = 0,
  prefix = "",
  suffix = "",
}: {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduce = useReducedMotion();
  const format = React.useCallback(
    (n: number) =>
      `${prefix}${n.toLocaleString("en-US", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${suffix}`,
    [prefix, suffix, decimals],
  );

  React.useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    if (reduce) {
      el.textContent = format(value);
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.28, 0.11, 0.32, 1],
      onUpdate: (n) => {
        el.textContent = format(n);
      },
    });
    return () => controls.stop();
  }, [inView, value, duration, reduce, format]);

  return (
    <span ref={ref} className="tabular">
      {format(0)}
    </span>
  );
}
