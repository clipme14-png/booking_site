"use client";

import * as React from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

type Accent = "primary" | "secondary" | "accent" | "warning" | "destructive";

const accentMap: Record<
  Accent,
  { glow: string; ring: string; iconBg: string; text: string; blob: string }
> = {
  primary: {
    glow: "bg-primary/25",
    ring: "ring-primary/20",
    iconBg: "bg-brand-gradient",
    text: "text-primary",
    blob: "from-primary/30 to-secondary/20",
  },
  secondary: {
    glow: "bg-secondary/25",
    ring: "ring-secondary/20",
    iconBg: "bg-gradient-to-br from-secondary to-primary",
    text: "text-secondary",
    blob: "from-secondary/30 to-primary/20",
  },
  accent: {
    glow: "bg-accent/25",
    ring: "ring-accent/20",
    iconBg: "bg-gradient-to-br from-accent to-secondary",
    text: "text-accent",
    blob: "from-accent/30 to-secondary/20",
  },
  warning: {
    glow: "bg-warning/25",
    ring: "ring-warning/20",
    iconBg: "bg-gradient-to-br from-warning to-destructive",
    text: "text-warning",
    blob: "from-warning/30 to-destructive/20",
  },
  destructive: {
    glow: "bg-destructive/25",
    ring: "ring-destructive/20",
    iconBg: "bg-gradient-to-br from-destructive to-warning",
    text: "text-destructive",
    blob: "from-destructive/30 to-warning/20",
  },
};

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
  const a = accentMap[accent];

  return (
    <main className="relative flex min-h-screen w-full flex-col items-center overflow-hidden bg-background px-4 py-8">
      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-60" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 35%, black, transparent 75%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 35%, black, transparent 75%)",
        }}
      >
        <div className="absolute inset-0 grid-pattern" />
      </div>
      <motion.div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -top-24 left-1/2 size-[520px] -translate-x-1/2 rounded-full blur-3xl",
          a.glow,
        )}
        animate={{ opacity: [0.5, 0.8, 0.5], scale: [1, 1.08, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/2 h-[300px] w-[700px] -translate-x-1/2 rounded-full bg-secondary/10 blur-3xl"
      />

      {/* Top logo */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-5xl"
      >
        <Logo />
      </motion.div>

      {/* Centered content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center py-10 text-center">
        {/* Animated gradient icon blob */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-8"
        >
          <motion.div
            aria-hidden
            className={cn(
              "absolute -inset-6 rounded-[2rem] bg-gradient-to-br blur-2xl",
              a.blob,
            )}
            animate={{ scale: [1, 1.12, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className={cn(
              "relative flex size-24 items-center justify-center rounded-[1.75rem] text-white shadow-glow ring-1",
              a.iconBg,
              a.ring,
            )}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Icon className="size-11" strokeWidth={1.8} />
          </motion.div>
        </motion.div>

        {/* Optional big error code */}
        {code && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mb-2"
          >
            <span className="bg-brand-gradient bg-clip-text text-7xl font-black tracking-tighter text-transparent sm:text-8xl">
              {code}
            </span>
          </motion.div>
        )}

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-xl text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.16 }}
          className="mt-4 max-w-md text-pretty text-base leading-relaxed text-muted-foreground"
        >
          {description}
        </motion.p>

        {children && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="mt-6 w-full max-w-md"
          >
            {children}
          </motion.div>
        )}

        {actions && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.28 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            {actions}
          </motion.div>
        )}
      </div>

      {/* Footer hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="relative z-10 pb-2 text-xs text-muted-foreground/70"
      >
        Quantum Invest — Learn. Earn. Repeat.
      </motion.p>
    </main>
  );
}
