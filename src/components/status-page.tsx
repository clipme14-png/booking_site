"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

type Accent = "primary" | "secondary" | "accent" | "warning" | "destructive";

const iconTone: Record<Accent, string> = {
  primary: "text-foreground",
  secondary: "text-foreground",
  accent: "text-foreground",
  warning: "text-warning",
  destructive: "text-destructive",
};

const ease = [0.28, 0.11, 0.32, 1] as const;

function Rise({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StatusPage({
  icon: Icon,
  code,
  title,
  description,
  actions,
  children,
  accent = "primary",
}: {
  icon: LucideIcon;
  code?: string;
  title: string;
  description: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  accent?: Accent;
}) {
  return (
    <main className="flex min-h-screen w-full flex-col bg-canvas px-5">
      <div className="mx-auto flex h-14 w-full max-w-[1080px] items-center">
        <Logo />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
        <Rise>
          {code ? (
            <p className="text-[96px] font-semibold leading-none tracking-[-0.05em] text-foreground/[0.12] tabular sm:text-[128px]">
              {code}
            </p>
          ) : (
            <span
              className={cn(
                "flex size-16 items-center justify-center rounded-full bg-foreground/[0.05]",
                iconTone[accent],
              )}
            >
              <Icon className="size-7" strokeWidth={1.5} />
            </span>
          )}
        </Rise>

        <Rise delay={0.06}>
          <h1 className="mt-8 max-w-xl text-balance text-[32px] font-semibold leading-[1.1] tracking-[-0.028em] sm:text-[40px]">
            {title}
          </h1>
        </Rise>

        <Rise delay={0.12}>
          <p className="mx-auto mt-4 max-w-md text-pretty text-[17px] leading-[1.5] text-muted-foreground">
            {description}
          </p>
        </Rise>

        {children && (
          <Rise delay={0.18} className="mt-10 w-full max-w-md">
            {children}
          </Rise>
        )}

        {actions && (
          <Rise
            delay={0.24}
            className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row [&>*]:w-full sm:[&>*]:w-auto"
          >
            {actions}
          </Rise>
        )}
      </div>

      <footer className="mx-auto flex w-full max-w-[1080px] flex-col items-center justify-between gap-2 border-t border-border py-5 text-xs text-muted-foreground sm:flex-row">
        <span>Copyright © 2026 Quantum Invest</span>
        <span className="flex gap-4">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <a href="mailto:support@quantuminvest.io" className="hover:text-foreground">Support</a>
          <Link href="#" className="hover:text-foreground">System status</Link>
        </span>
      </footer>
    </main>
  );
}

/** A quiet list used on status pages for troubleshooting steps. */
export function StatusChecklist({
  title,
  items,
}: {
  title: string;
  items: { icon: LucideIcon; text: string }[];
}) {
  return (
    <div className="rounded-2xl bg-background p-5 text-left">
      <p className="text-[13px] font-semibold">{title}</p>
      <ol className="mt-3 divide-y divide-border">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-3 py-3 first:pt-1 last:pb-0">
            <it.icon className="mt-0.5 size-4 shrink-0 stroke-[1.75] text-muted-foreground" />
            <span className="text-[13px] leading-relaxed text-foreground/80">{it.text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
