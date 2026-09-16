"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ease = [0.28, 0.11, 0.32, 1] as const;

/** A check that draws itself inside a filled circle, in the manner of Apple Pay. */
export function SuccessMark({
  size = 64,
  className,
  tone = "success",
}: {
  size?: number;
  className?: string;
  tone?: "success" | "ink";
}) {
  return (
    <motion.span
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, ease }}
      className={cn(
        "inline-flex items-center justify-center rounded-full",
        tone === "success" ? "bg-success text-white" : "bg-primary text-primary-foreground",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 24 24" fill="none" style={{ width: size * 0.5, height: size * 0.5 }} aria-hidden>
        <motion.path
          d="M5 12.5 10 17.5 19 7"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.45, delay: 0.25, ease }}
        />
      </svg>
    </motion.span>
  );
}
