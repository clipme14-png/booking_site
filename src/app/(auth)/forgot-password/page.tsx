"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MailCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/toast";

const fade = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25 } },
};

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 900);
  }

  function resend() {
    toast({
      title: "Reset link resent",
      description: `We sent another link to ${email}.`,
      variant: "success",
    });
  }

  return (
    <AnimatePresence mode="wait">
      {!sent ? (
        <motion.div key="form" {...fade}>
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight">Reset your password</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter the email associated with your account and we&apos;ll send you a
              secure link to reset your password.
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                icon={<Mail />}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button type="submit" size="lg" loading={loading} className="w-full">
              Send reset link
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Remembered it?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Back to login
            </Link>
          </p>
        </motion.div>
      ) : (
        <motion.div key="sent" {...fade}>
          <Card className="overflow-hidden">
            <CardContent className="flex flex-col items-center px-6 pb-8 pt-8 text-center">
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.05 }}
                className="flex size-16 items-center justify-center rounded-2xl bg-success/12 text-success"
              >
                <MailCheck className="size-8" />
              </motion.div>

              <h1 className="mt-5 text-xl font-bold tracking-tight">Check your email</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                We sent a password reset link to
              </p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">{email}</p>
              <p className="mt-4 text-xs text-muted-foreground">
                Didn&apos;t get it? Check your spam folder or resend below.
              </p>

              <div className="mt-6 w-full space-y-3">
                <Button
                  variant="subtle"
                  size="lg"
                  className="w-full"
                  onClick={resend}
                >
                  Resend link
                </Button>
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowLeft className="size-4" />
                  Back to login
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
