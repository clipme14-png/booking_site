"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MailCheck, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { currentUser } from "@/lib/mock-data";
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

export default function VerifyEmailPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [code, setCode] = React.useState<string[]>(Array(LENGTH).fill(""));
  const [loading, setLoading] = React.useState(false);
  const [seconds, setSeconds] = React.useState(30);
  const inputs = React.useRef<Array<HTMLInputElement | null>>([]);

  React.useEffect(() => {
    if (seconds <= 0) return;
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

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
      // support paste of multiple digits
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
      router.push("/two-factor");
    }, 1000);
  }

  function resend() {
    setSeconds(30);
    setCode(Array(LENGTH).fill(""));
    inputs.current[0]?.focus();
    toast({
      title: "Code resent",
      description: `A new code is on its way to ${currentUser.email}.`,
      variant: "success",
    });
  }

  const mm = Math.floor(seconds / 60);
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <motion.div variants={container} initial="hidden" animate="visible">
      <motion.div variants={item} className="mb-8 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/12 text-primary">
          <MailCheck className="size-7" />
        </div>
        <h1 className="mt-5 text-2xl font-bold tracking-tight">Verify your email</h1>
        <p className="mx-auto mt-2 max-w-xs text-sm text-muted-foreground">
          We sent a 6-digit code to{" "}
          <span className="font-medium text-foreground">{currentUser.email}</span>.
          Enter it below to continue.
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

      <motion.div variants={item} className="mt-6 text-center text-sm text-muted-foreground">
        {seconds > 0 ? (
          <span>
            Resend code in{" "}
            <span className="font-medium tabular-nums text-foreground">
              {mm}:{ss}
            </span>
          </span>
        ) : (
          <button
            type="button"
            onClick={resend}
            className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
          >
            <RotateCcw className="size-4" />
            Resend code
          </button>
        )}
      </motion.div>

      <motion.p variants={item} className="mt-8 text-center text-sm text-muted-foreground">
        Wrong email?{" "}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Change it
        </Link>
      </motion.p>
    </motion.div>
  );
}
