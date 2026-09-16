import * as React from "react";
import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl px-6 py-16 text-center",
        className,
      )}
    >
      {icon && (
        <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-foreground/[0.05] text-muted-foreground [&_svg]:size-6 [&_svg]:stroke-[1.5]">
          {icon}
        </div>
      )}
      <h3 className="text-[17px] font-semibold tracking-tight">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
