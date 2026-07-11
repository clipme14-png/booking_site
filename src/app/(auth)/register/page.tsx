"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { WalletButton } from "@/components/wallet-button";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
    </svg>
  );
}
function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.656l-5.214-6.817-5.966 6.817H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  );
}

function scorePassword(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
  if (/\d/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 4);
}

const strengthMeta = [
  { label: "Too weak", color: "bg-destructive", text: "text-destructive", pct: 12 },
  { label: "Weak", color: "bg-destructive", text: "text-destructive", pct: 33 },
  { label: "Medium", color: "bg-warning", text: "text-warning", pct: 60 },
  { label: "Strong", color: "bg-secondary", text: "text-secondary", pct: 82 },
  { label: "Very strong", color: "bg-success", text: "text-success", pct: 100 },
];

export default function RegisterPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [agree, setAgree] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const score = scorePassword(password);
  const meta = strengthMeta[score];
  const mismatch = confirm.length > 0 && confirm !== password;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mismatch) {
      toast({ title: "Passwords don't match", variant: "error" });
      return;
    }
    if (!agree) {
      toast({ title: "Please accept the terms to continue", variant: "warning" });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/verify-email");
    }, 1100);
  }

  return (
    <motion.div variants={container} initial="hidden" animate="visible">
      <motion.div variants={item} className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight">Create your account</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Start learning and earning SOL in minutes.
        </p>
      </motion.div>

      <motion.form variants={item} onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Alex Rivera"
            required
            icon={<User />}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

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

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Create a strong password"
            required
            icon={<Lock />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            trailing={
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            }
          />
          {password.length > 0 && (
            <div className="pt-1">
              <Progress
                value={meta.pct}
                className="h-1.5"
                indicatorClassName={meta.color}
                animated={false}
              />
              <p className={cn("mt-1.5 text-xs font-medium", meta.text)}>
                {meta.label}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirm">Confirm password</Label>
          <Input
            id="confirm"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="Re-enter your password"
            required
            icon={<Lock />}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={cn(mismatch && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/25")}
          />
          {mismatch && (
            <p className="text-xs font-medium text-destructive">
              Passwords don&apos;t match
            </p>
          )}
        </div>

        <label className="flex cursor-pointer items-start gap-2.5 text-sm text-muted-foreground">
          <button
            type="button"
            role="checkbox"
            aria-checked={agree}
            onClick={() => setAgree((a) => !a)}
            className={cn(
              "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
              agree
                ? "border-transparent bg-brand-gradient text-white"
                : "border-input bg-card hover:border-primary/50",
            )}
          >
            {agree && <Check className="size-3.5" />}
          </button>
          <span>
            I agree to Quantum Invest&apos;s{" "}
            <Link href="/terms" className="font-medium text-primary hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="font-medium text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </span>
        </label>

        <Button type="submit" size="lg" loading={loading} className="w-full">
          Create account
        </Button>
      </motion.form>

      <motion.div variants={item} className="my-6 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">or continue with</span>
        <Separator className="flex-1" />
      </motion.div>

      <motion.div variants={item} className="space-y-3">
        <div className="[&>button]:w-full">
          <WalletButton variant="outline" size="lg" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" size="lg" type="button">
            <GoogleIcon />
            Google
          </Button>
          <Button variant="outline" size="lg" type="button">
            <XIcon />
            X
          </Button>
        </div>
      </motion.div>

      <motion.p variants={item} className="mt-8 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Sign in
        </Link>
      </motion.p>
    </motion.div>
  );
}
