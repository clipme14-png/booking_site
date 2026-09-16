"use client";

import * as React from "react";
import QRCode from "qrcode";
import { AnimatePresence, motion } from "framer-motion";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import {
  Check,
  ChevronLeft,
  Copy,
  CreditCard,
  ExternalLink,
  Loader2,
  Smartphone,
} from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { SuccessMark } from "@/components/ui/success-mark";
import { useToast } from "@/components/ui/toast";
import type { BillingCycle, PaymentMethod } from "@/lib/billing/catalog";
import type { PublicOrder } from "@/lib/billing/orders";
import { buildPaymentTransaction } from "@/lib/billing/solana-tx";
import type { Plan } from "@/lib/mock-data";
import { cn, shortAddress } from "@/lib/utils";

type Options = {
  paystack: { currency: string; amount: string } | null;
  crypto: { cluster: string; sol: string; usdc: string | null } | null;
};

type CryptoPayment = {
  recipient: string;
  amount: string;
  amountDecimal: string;
  decimals: number;
  token: string;
  mint: string | null;
  reference: string;
  cluster: string;
  solanaPayUrl: string;
};

type Step =
  | { name: "choose" }
  | { name: "crypto"; order: PublicOrder; payment: CryptoPayment }
  | { name: "paid"; order: PublicOrder; payment: CryptoPayment | null };

const ease = [0.28, 0.11, 0.32, 1] as const;

function explorerUrl(signature: string, cluster: string) {
  const suffix = cluster === "mainnet-beta" ? "" : `?cluster=${cluster}`;
  return `https://explorer.solana.com/tx/${signature}${suffix}`;
}

function formatMoney(amount: string, currency: string) {
  const n = Number(amount);
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: Number.isInteger(n) ? 0 : 2,
    }).format(n);
  } catch {
    return `${n.toLocaleString("en-US")} ${currency}`;
  }
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
  return data as T;
}

export function CheckoutDialog({
  plan,
  cycle,
  defaultEmail,
  onClose,
}: {
  plan: Plan | null;
  cycle: BillingCycle;
  defaultEmail: string;
  onClose: () => void;
}) {
  const open = !!plan;
  return (
    <Dialog open={open} onClose={onClose} className="max-w-[440px]">
      {plan && (
        <CheckoutFlow
          key={`${plan.id}-${cycle}`}
          plan={plan}
          cycle={cycle}
          defaultEmail={defaultEmail}
          onClose={onClose}
        />
      )}
    </Dialog>
  );
}

function CheckoutFlow({
  plan,
  cycle,
  defaultEmail,
  onClose,
}: {
  plan: Plan;
  cycle: BillingCycle;
  defaultEmail: string;
  onClose: () => void;
}) {
  const [step, setStep] = React.useState<Step>({ name: "choose" });

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={step.name}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease }}
      >
        {step.name === "choose" && (
          <ChooseStep
            plan={plan}
            cycle={cycle}
            defaultEmail={defaultEmail}
            onCrypto={(order, payment) => setStep({ name: "crypto", order, payment })}
          />
        )}
        {step.name === "crypto" && (
          <CryptoStep
            plan={plan}
            order={step.order}
            payment={step.payment}
            onBack={() => setStep({ name: "choose" })}
            onPaid={(order) => setStep({ name: "paid", order, payment: step.payment })}
          />
        )}
        {step.name === "paid" && (
          <PaidStep plan={plan} order={step.order} payment={step.payment} onClose={onClose} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 1: choose a method                                            */
/* ------------------------------------------------------------------ */

function ChooseStep({
  plan,
  cycle,
  defaultEmail,
  onCrypto,
}: {
  plan: Plan;
  cycle: BillingCycle;
  defaultEmail: string;
  onCrypto: (order: PublicOrder, payment: CryptoPayment) => void;
}) {
  const [options, setOptions] = React.useState<Options | null>(null);
  const [loadError, setLoadError] = React.useState<string | null>(null);
  const [method, setMethod] = React.useState<PaymentMethod | null>(null);
  const [email, setEmail] = React.useState(defaultEmail);
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    fetch(`/api/billing/options?planId=${plan.id}&cycle=${cycle}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("Could not load prices."))))
      .then((data: Options) => {
        if (cancelled) return;
        setOptions(data);
        setMethod(data.paystack ? "paystack" : data.crypto ? "sol" : null);
      })
      .catch((e: Error) => !cancelled && setLoadError(e.message));
    return () => {
      cancelled = true;
    };
  }, [plan.id, cycle]);

  const methods: {
    id: PaymentMethod;
    title: string;
    detail: string;
    price: string | null;
    icon: React.ReactNode;
  }[] = options
    ? [
        {
          id: "paystack",
          title: "Card, bank or transfer",
          detail: "Secure checkout by Paystack",
          price: options.paystack ? formatMoney(options.paystack.amount, options.paystack.currency) : null,
          icon: <CreditCard />,
        },
        {
          id: "sol",
          title: "Solana",
          detail: "Send SOL from any wallet",
          price: options.crypto ? `${options.crypto.sol} SOL` : null,
          icon: <TokenGlyph label="S" />,
        },
        {
          id: "usdc",
          title: "USDC",
          detail: "Stablecoin on Solana",
          price: options.crypto?.usdc ? `${options.crypto.usdc} USDC` : null,
          icon: <TokenGlyph label="$" />,
        },
      ]
    : [];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!method) return;
    setBusy(true);
    setError(null);
    try {
      if (method === "paystack") {
        const { authorizationUrl } = await postJson<{ authorizationUrl: string }>(
          "/api/billing/checkout",
          { planId: plan.id, cycle, method, email },
        );
        window.location.assign(authorizationUrl);
        return; // keep the spinner while the browser leaves
      }
      const { order, payment } = await postJson<{ order: PublicOrder; payment: CryptoPayment }>(
        "/api/billing/checkout",
        { planId: plan.id, cycle, method, email },
      );
      onCrypto(order, payment);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <p className="text-[13px] text-muted-foreground">
        {cycle === "yearly" ? "Yearly" : "Monthly"} subscription
      </p>
      <h2 className="mt-0.5 pr-8 text-[22px] font-semibold tracking-tight">{plan.name}</h2>

      <fieldset className="mt-6">
        <legend className="mb-2 text-[13px] font-medium">Payment method</legend>
        {!options && !loadError && (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-[62px] animate-pulse rounded-xl bg-foreground/[0.04]" />
            ))}
          </div>
        )}
        {loadError && <p className="text-[13px] text-destructive">{loadError}</p>}
        <div className="overflow-hidden rounded-xl border border-border" role="radiogroup">
          {methods.map((m, i) => {
            const available = !!m.price;
            const selected = method === m.id;
            return (
              <label
                key={m.id}
                className={cn(
                  "flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors",
                  i > 0 && "border-t border-border",
                  selected ? "bg-foreground/[0.04]" : "hover:bg-foreground/[0.02]",
                  !available && "cursor-not-allowed opacity-45",
                )}
              >
                <input
                  type="radio"
                  name="method"
                  value={m.id}
                  checked={selected}
                  disabled={!available}
                  onChange={() => setMethod(m.id)}
                  className="sr-only"
                />
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground/[0.06] text-foreground [&_svg]:size-4 [&_svg]:stroke-[1.75]">
                  {m.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[14px] font-medium">{m.title}</span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {available ? m.detail : "Not available"}
                  </span>
                  {m.price && (
                    <span className="mt-0.5 block text-[13px] font-medium tabular sm:hidden">{m.price}</span>
                  )}
                </span>
                {m.price && (
                  <span className="hidden shrink-0 text-[13px] font-medium tabular sm:block">{m.price}</span>
                )}
                <span
                  className={cn(
                    "flex size-5 shrink-0 items-center justify-center rounded-full border transition-colors",
                    selected ? "border-secondary bg-secondary text-white" : "border-input",
                  )}
                >
                  {selected && <Check className="size-3" strokeWidth={3} />}
                </span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-5 space-y-1.5">
        <Label htmlFor="checkout-email">Email for your receipt</Label>
        <Input
          id="checkout-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {options?.crypto && options.crypto.cluster !== "mainnet-beta" && method !== "paystack" && (
        <p className="mt-4 rounded-lg bg-warning/10 px-3 py-2 text-xs text-warning">
          Test network ({options.crypto.cluster}). Don&apos;t send real funds.
        </p>
      )}

      {error && (
        <p role="alert" className="mt-4 text-[13px] text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" className="mt-6 w-full" disabled={!method} loading={busy}>
        {method === "paystack" ? "Continue to Paystack" : "Continue"}
      </Button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        {method === "paystack"
          ? "You'll finish paying on Paystack's secure page."
          : method
            ? "You'll get an address and an exact amount to send."
            : options
              ? "Payments aren't set up yet."
              : "\u00a0"}
      </p>
    </form>
  );
}

function TokenGlyph({ label }: { label: string }) {
  return <span className="text-[13px] font-semibold leading-none">{label}</span>;
}

/* ------------------------------------------------------------------ */
/*  Step 2: crypto                                                     */
/* ------------------------------------------------------------------ */

function useCountdown(until: number | null) {
  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (!until) return null;
  const left = Math.max(0, until - now);
  const m = Math.floor(left / 60000);
  const s = Math.floor((left % 60000) / 1000);
  return { left, label: `${m}:${String(s).padStart(2, "0")}` };
}

function CopyRow({ label, value, display, mono }: { label: string; value: string; display?: string; mono?: boolean }) {
  const [copied, setCopied] = React.useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="group flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors hover:bg-foreground/[0.03]"
    >
      <span className="min-w-0">
        <span className="block text-xs text-muted-foreground">{label}</span>
        <span className={cn("block truncate text-[14px] font-medium", mono && "font-mono text-[13px]")}>
          {display ?? value}
        </span>
      </span>
      <span className="flex shrink-0 items-center gap-1 text-xs text-secondary">
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        {copied ? "Copied" : "Copy"}
      </span>
    </button>
  );
}

function CryptoStep({
  plan,
  order,
  payment,
  onBack,
  onPaid,
}: {
  plan: Plan;
  order: PublicOrder;
  payment: CryptoPayment;
  onBack: () => void;
  onPaid: (order: PublicOrder) => void;
}) {
  const { toast } = useToast();
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected } = useWallet();
  const { setVisible } = useWalletModal();
  const [status, setStatus] = React.useState(order.status);
  const [qr, setQr] = React.useState<string | null>(null);
  const [sending, setSending] = React.useState(false);
  const [sentSignature, setSentSignature] = React.useState<string | null>(null);
  const countdown = useCountdown(order.expiresAt);

  React.useEffect(() => {
    QRCode.toString(payment.solanaPayUrl, { type: "svg", margin: 0, errorCorrectionLevel: "M" })
      .then(setQr)
      .catch(() => setQr(null));
  }, [payment.solanaPayUrl]);

  // Poll until the server sees the payment.
  const onPaidRef = React.useRef(onPaid);
  React.useEffect(() => {
    onPaidRef.current = onPaid;
  });
  React.useEffect(() => {
    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;
    const tick = async () => {
      try {
        const res = await fetch(`/api/billing/orders/${order.id}`, { cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as { order: PublicOrder };
          if (stopped) return;
          setStatus(data.order.status);
          if (data.order.status === "paid") return onPaidRef.current(data.order);
          if (data.order.status !== "pending") return;
        }
      } catch {
        /* keep polling */
      }
      if (!stopped) timer = setTimeout(tick, 4000);
    };
    timer = setTimeout(tick, 2500);
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [order.id]);

  const payWithWallet = async () => {
    if (!publicKey) return setVisible(true);
    setSending(true);
    try {
      const tx = buildPaymentTransaction(publicKey, {
        recipient: payment.recipient,
        amount: payment.amount,
        decimals: payment.decimals,
        mint: payment.mint,
        reference: payment.reference,
      });
      const signature = await sendTransaction(tx, connection);
      setSentSignature(signature);
      toast({ title: "Payment sent", description: "Waiting for the network to confirm it." });
    } catch (e) {
      const message = e instanceof Error ? e.message : "The wallet didn't send the payment.";
      toast({
        title: "Payment not sent",
        description: /reject|denied|cancel/i.test(message) ? "You cancelled the request." : message,
        variant: "error",
      });
    } finally {
      setSending(false);
    }
  };

  const expired = status === "expired" || (countdown !== null && countdown.left === 0 && status === "pending");

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="-ml-1 inline-flex items-center text-[13px] text-secondary hover:underline"
      >
        <ChevronLeft className="size-4" />
        Payment method
      </button>
      <h2 className="mt-2 pr-8 text-[22px] font-semibold tracking-tight">
        Send {payment.token}
      </h2>
      <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
        Send exactly this amount to the address below. We match your payment by the amount,
        so include every digit.
      </p>

      {expired ? (
        <div className="mt-6 rounded-xl bg-foreground/[0.04] p-5 text-center">
          <p className="text-[15px] font-semibold">This payment request has expired</p>
          <p className="mt-1 text-[13px] text-muted-foreground">
            If you already sent funds, keep this page open a little longer or contact support
            with your transaction ID. Otherwise, start again for a fresh address and amount.
          </p>
          <Button className="mt-4" onClick={onBack}>
            Start again
          </Button>
        </div>
      ) : (
        <>
          <div className="mt-5 flex flex-col items-center gap-5 sm:flex-row sm:items-start">
            <div className="flex size-[148px] shrink-0 items-center justify-center rounded-2xl bg-white p-3 shadow-[0_0_0_1px_rgb(0_0_0/0.06)]">
              {qr ? (
                <div
                  className="size-full [&_svg]:size-full"
                  aria-label="Solana Pay QR code"
                  role="img"
                  dangerouslySetInnerHTML={{ __html: qr }}
                />
              ) : (
                <Loader2 className="size-5 animate-spin text-black/40" />
              )}
            </div>
            <div className="w-full text-center sm:text-left">
              <p className="text-xs text-muted-foreground">Amount</p>
              <p className="mt-0.5 break-all text-[26px] font-semibold leading-tight tracking-tight tabular">
                {payment.amountDecimal}
                <span className="ml-1.5 text-[15px] font-medium text-muted-foreground">{payment.token}</span>
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                Scan with Phantom, Solflare or any Solana Pay wallet. The amount fills in for you.
              </p>
              <a
                href={payment.solanaPayUrl}
                className="mt-2 inline-flex items-center gap-1 text-xs text-secondary hover:underline sm:hidden"
              >
                <Smartphone className="size-3.5" /> Open in wallet app
              </a>
            </div>
          </div>

          <div className="mt-5 divide-y divide-border overflow-hidden rounded-xl border border-border">
            <CopyRow label="Amount" value={payment.amountDecimal} display={`${payment.amountDecimal} ${payment.token}`} />
            <CopyRow
              label={`${payment.token} address (Solana network)`}
              value={payment.recipient}
              display={payment.recipient}
              mono
            />
          </div>

          <div className="mt-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <Button
            type="button"
            variant={connected ? "default" : "outline"}
            size="lg"
            className="mt-5 w-full"
            loading={sending}
            disabled={!!sentSignature}
            onClick={payWithWallet}
          >
            {sentSignature
              ? "Payment sent"
              : connected && publicKey
                ? `Pay with ${shortAddress(publicKey.toBase58())}`
                : "Connect a wallet to pay"}
          </Button>

          <div className="mt-5 flex items-center justify-between rounded-xl bg-foreground/[0.04] px-4 py-3">
            <span className="flex items-center gap-2 text-[13px]">
              <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
              {sentSignature ? "Confirming on Solana…" : "Waiting for your payment…"}
            </span>
            {countdown && (
              <span className="text-xs text-muted-foreground tabular">{countdown.label} left</span>
            )}
          </div>

          <p className="mt-3 text-center text-[11px] leading-relaxed text-muted-foreground">
            {`Only send ${payment.token} on Solana. Other networks or tokens can't be recovered.`}
            {payment.cluster !== "mainnet-beta" && ` Test network: ${payment.cluster}.`}
          </p>
        </>
      )}
      <span className="sr-only">
        Order {order.id} for the {plan.name} plan
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 3: done                                                       */
/* ------------------------------------------------------------------ */

function PaidStep({
  plan,
  order,
  payment,
  onClose,
}: {
  plan: Plan;
  order: PublicOrder;
  payment: CryptoPayment | null;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col items-center py-2 text-center">
      <SuccessMark size={64} />
      <h2 className="mt-6 text-[22px] font-semibold tracking-tight">You&apos;re on {plan.name}</h2>
      <p className="mt-1.5 text-[13px] text-muted-foreground">
        Payment received. Your {order.cycle} subscription is active now.
      </p>
      {order.signature && payment && (
        <a
          href={explorerUrl(order.signature, payment.cluster)}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-[13px] text-secondary hover:underline"
        >
          View transaction <ExternalLink className="size-3.5" />
        </a>
      )}
      <Button className="mt-7 w-full" size="lg" onClick={onClose}>
        Done
      </Button>
    </div>
  );
}
