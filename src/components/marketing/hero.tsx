"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Sparkles, Coins, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { WalletButton } from "@/components/wallet-button";
import { CountUp } from "@/components/ui/stat-card";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
      {/* Background glows */}
      <div className="pointer-events-none absolute inset-0 grid-pattern opacity-60 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="pointer-events-none absolute -top-40 left-1/2 size-[36rem] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
      <div className="pointer-events-none absolute top-20 right-0 size-96 rounded-full bg-secondary/15 blur-[100px]" />

      <div className="relative mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge variant="outline" className="mb-6 gap-1.5 border-primary/30 bg-primary/5 py-1.5 pl-1.5 pr-3">
              <span className="rounded-full bg-brand-gradient px-2 py-0.5 text-[10px] font-bold text-white">
                NEW
              </span>
              <span className="text-foreground">Season 4 rewards are live</span>
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
          >
            Read to <span className="text-gradient">learn.</span>
            <br />
            Learn to <span className="text-gradient">earn.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mx-auto mt-6 max-w-xl text-pretty text-lg text-muted-foreground"
          >
            Quantum Invest rewards you in SOL for reading books and passing quizzes. The
            premium learn-to-earn platform built on Solana — where knowledge
            compounds into wealth.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="xl" className="w-full sm:w-auto">
                Start earning free
                <ArrowRight />
              </Button>
            </Link>
            <WalletButton size="lg" variant="outline" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 text-xs text-muted-foreground"
          >
            No credit card · Free Starter plan · Non-custodial
          </motion.p>
        </div>

        {/* Floating dashboard preview */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto mt-16 max-w-5xl"
        >
          <div className="rounded-2xl border border-border glass-strong p-2 shadow-lg">
            <div className="overflow-hidden rounded-xl border border-border bg-card">
              <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
                <span className="size-3 rounded-full bg-destructive/60" />
                <span className="size-3 rounded-full bg-warning/60" />
                <span className="size-3 rounded-full bg-success/60" />
                <span className="ml-3 text-xs text-muted-foreground">
                  app.quantuminvest.io/dashboard
                </span>
              </div>
              <div className="grid gap-4 p-5 sm:grid-cols-3">
                {[
                  { icon: Coins, label: "Claimable", value: "1.84 SOL", accent: "text-primary bg-primary/10" },
                  { icon: TrendingUp, label: "This week", value: "4.2 SOL", accent: "text-secondary bg-secondary/10" },
                  { icon: BookOpen, label: "Streak", value: "27 days", accent: "text-accent bg-accent/10" },
                ].map((c) => (
                  <div key={c.label} className="rounded-xl border border-border bg-background/60 p-4">
                    <div className={`flex size-9 items-center justify-center rounded-lg ${c.accent}`}>
                      <c.icon className="size-4.5" />
                    </div>
                    <p className="mt-3 text-xs text-muted-foreground">{c.label}</p>
                    <p className="text-xl font-bold">{c.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* floating chips */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-6 top-24 hidden rounded-xl border border-border glass-strong p-3 shadow-lg sm:block"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-accent" />
              <span className="text-sm font-semibold">+0.2 SOL earned</span>
            </div>
          </motion.div>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-4 bottom-16 hidden rounded-xl border border-border glass-strong p-3 shadow-lg sm:block"
          >
            <div className="flex items-center gap-2">
              <Badge variant="solid" className="h-5">Board 4</Badge>
              <span className="text-sm font-semibold">Scholar</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Stats bar */}
        <div className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4">
          {[
            { value: 512, suffix: "K+", label: "SOL distributed" },
            { value: 24.8, suffix: "K", label: "Active learners", decimals: 1 },
            { value: 1.2, suffix: "M", label: "Books read", decimals: 1 },
            { value: 99.9, suffix: "%", label: "Uptime", decimals: 1 },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold tracking-tight sm:text-4xl">
                <CountUp value={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
