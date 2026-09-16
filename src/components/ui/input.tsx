"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const fieldBase = [
  "w-full rounded-xl border border-input bg-card text-[15px] text-foreground",
  "transition-[border-color,box-shadow] duration-200",
  "placeholder:text-muted-foreground/70",
  "focus-visible:outline-none focus-visible:border-ring focus-visible:ring-4 focus-visible:ring-ring/15",
  "disabled:cursor-not-allowed disabled:opacity-50",
].join(" ");

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  trailing?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, trailing, ...props }, ref) => {
    return (
      <div className="relative flex items-center">
        {icon && (
          <span className="pointer-events-none absolute left-3.5 text-muted-foreground [&_svg]:size-4 [&_svg]:stroke-[1.75]">
            {icon}
          </span>
        )}
        <input
          type={type}
          ref={ref}
          className={cn(
            "flex h-11 px-3.5 py-2",
            fieldBase,
            icon && "pl-10",
            trailing && "pr-10",
            className,
          )}
          {...props}
        />
        {trailing && (
          <span className="absolute right-3 text-muted-foreground">
            {trailing}
          </span>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-[13px] font-medium leading-none text-foreground",
      className,
    )}
    {...props}
  />
));
Label.displayName = "Label";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn("flex min-h-24 px-3.5 py-2.5", fieldBase, className)}
    {...props}
  />
));
Textarea.displayName = "Textarea";
