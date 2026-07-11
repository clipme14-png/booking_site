"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Sparkles, Check, Wallet, Layers, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { currentUser } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const steps = [
  {
    icon: Wallet,
    title: "Connect your wallet",
    desc: "Link your Solana wallet to receive rewards.",
    done: true,
  },
  {
    icon: Layers,
    title: "Choose a plan",
    desc: "Pick a board tier that matches your goals.",
    done: false,
  },
  {
    icon: BookOpen,
    title: "Read your first book",
    desc: "Finish a book and claim your first SOL reward.",
    done: false,
  },
];

const firstName = currentUser.name.split(" ")[0];

export default function WelcomePage() {
  const router = useRouter();

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="text-center"
    >
      <motion.div variants={item} className="flex justify-center">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.1 }}
          className="relative flex size-20 items-center justify-center rounded-3xl bg-brand-gradient text-white shadow-glow"
        >
          <Sparkles className="size-9" />
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.4 }}
            className="absolute -bottom-1.5 -right-1.5 flex size-7 items-center justify-center rounded-full border-2 border-background bg-success text-white"
          >
            <Check className="size-4" />
          </motion.span>
        </motion.div>
      </motion.div>

      <motion.h1 variants={item} className="mt-6 text-2xl font-bold tracking-tight">
        Welcome to Quantum Invest, <span className="text-gradient">{firstName}</span>!
      </motion.h1>
      <motion.p variants={item} className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
        Your account is ready. Complete a few quick steps to start turning pages
        into SOL.
      </motion.p>

      <motion.div variants={item} className="mt-8">
        <Card className="overflow-hidden text-left">
          <div className="border-b border-border bg-muted/40 px-5 py-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Getting started
            </p>
          </div>
          <ul className="divide-y divide-border">
            {steps.map((step) => (
              <li key={step.title} className="flex items-center gap-3.5 px-5 py-3.5">
                <span
                  className={cn(
                    "flex size-9 shrink-0 items-center justify-center rounded-lg",
                    step.done
                      ? "bg-success/12 text-success"
                      : "bg-primary/10 text-primary",
                  )}
                >
                  {step.done ? <Check className="size-4.5" /> : <step.icon className="size-4.5" />}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      step.done && "text-muted-foreground line-through",
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{step.desc}</p>
                </div>
                {step.done && (
                  <span className="text-xs font-medium text-success">Done</span>
                )}
              </li>
            ))}
          </ul>
        </Card>
      </motion.div>

      <motion.div variants={item} className="mt-8 space-y-3">
        <Button
          size="lg"
          className="w-full"
          onClick={() => router.push("/dashboard")}
        >
          Go to dashboard
          <ArrowRight />
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => router.push("/plans")}
        >
          Explore plans
        </Button>
      </motion.div>
    </motion.div>
  );
}
