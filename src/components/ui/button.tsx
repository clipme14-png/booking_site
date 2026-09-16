"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-full font-medium select-none",
    "transition-[background-color,color,border-color,opacity,transform] duration-200 ease-[var(--ease-apple)]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
    "disabled:pointer-events-none disabled:opacity-40 active:scale-[0.98]",
    "[&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:stroke-[1.75]",
  ].join(" "),
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/85",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/88",
        accent: "bg-accent text-accent-foreground hover:bg-accent/88",
        outline:
          "border border-input bg-transparent text-foreground hover:bg-muted hover:border-foreground/20",
        ghost: "text-foreground hover:bg-muted",
        subtle: "bg-muted text-foreground hover:bg-foreground/10",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/88",
        link: "h-auto rounded-none px-0 text-secondary hover:underline underline-offset-4",
      },
      size: {
        sm: "h-8 px-3.5 text-[13px]",
        default: "h-10 px-5 text-sm",
        lg: "h-11 px-6 text-[15px]",
        xl: "h-12 px-7 text-[17px]",
        icon: "size-10",
        "icon-sm": "size-8",
      },
    },
    compoundVariants: [{ variant: "link", className: "px-0 h-auto" }],
    defaultVariants: { variant: "default", size: "default" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Loader2 className="animate-spin" />}
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
