"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const LENGTH = 6;

export default function TwoFactorPage() {
  const router = useRouter();
  const [code, setCode] = React.useState<string[]>(Array(LENGTH).fill(""));
  const [loading, setLoading] = React.useState(false);
  const inputs = React.useRef<Array<HTMLInputElement | null>>([]);

  const filled = code.join("").length === LENGTH;

  function setDigit(index: number, value: string) {
    const digits = value.replace(/\D/g, "");
    if (!digits) {
      setCode((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }
    setCode((prev) => {
      const next = [...prev];
      for (let i = 0; i < digits.length && index + i < LENGTH; i++) {
        next[index + i] = digits[i];
      }
      return next;
    });
    const nextIndex = Math.min(index + digits.length, LENGTH - 1);
    inputs.current[nextIndex]?.focus();
  }

  function onKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) inputs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < LENGTH - 1) inputs.current[index + 1]?.focus();
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!filled) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/welcome");
    }, 1000);
  }

  return (
    <motion.div variants={container} initial="hidden" animate="visible">
      <motion.div variants={item} className="mb-8 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-glow">
          <ShieldCheck className="size-7" />
        </div>
        <h1 className="mt-5 text-2xl font-bold tracking-tight">
          Two-factor authentication
        </h1>
        <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
          Enter the 6-digit code from your authenticator app to finish signing in.
        </p>
      </motion.div>

      <motion.form variants={item} onSubmit={onSubmit} className="space-y-6">
        <div className="flex justify-center gap-2 sm:gap-2.5">
          {code.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={LENGTH}
              aria-label={`Digit ${i + 1}`}
              value={digit}
              onChange={(e) => setDigit(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
              onFocus={(e) => e.target.select()}
              className={cn(
                "size-12 rounded-xl border bg-card text-center text-lg font-semibold shadow-xs transition-all sm:size-13",
                "focus-visible:outline-none focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/25",
                digit ? "border-primary/50" : "border-input",
              )}
            />
          ))}
        </div>

        <Button type="submit" size="lg" loading={loading} disabled={!filled} className="w-full">
          Verify
        </Button>
      </motion.form>

      <motion.p variants={item} className="mt-6 text-center text-sm text-muted-foreground">
        <Link
          href="/two-factor?method=backup"
          className="inline-flex items-center gap-1.5 font-medium text-primary hover:underline"
        >
          <KeyRound className="size-4" />
          Use a backup code instead
        </Link>
      </motion.p>

      <motion.p variants={item} className="mt-8 text-center text-xs text-muted-foreground">
        Lost access to your device?{" "}
        <Link href="/login" className="font-medium hover:text-foreground">
          Contact support
        </Link>
      </motion.p>
    </motion.div>
  );
}
