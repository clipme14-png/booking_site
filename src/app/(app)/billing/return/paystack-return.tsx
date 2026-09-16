"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SuccessMark } from "@/components/ui/success-mark";
import type { PublicOrder } from "@/lib/billing/orders";
import { plans } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type State =
  | { kind: "checking" }
  | { kind: "paid"; order: PublicOrder }
  | { kind: "pending"; order: PublicOrder }
  | { kind: "failed"; order: PublicOrder | null; message: string };

/** Paystack sends customers here after checkout, with ?reference=<order id>. */
export function PaystackReturn() {
  const params = useSearchParams();
  const reference = params.get("reference") ?? params.get("trxref");
  const [state, setState] = React.useState<State>(
    reference ? { kind: "checking" } : { kind: "failed", order: null, message: "No payment reference was provided." },
  );

  React.useEffect(() => {
    if (!reference) return;
    let stopped = false;
    let attempts = 0;
    const check = async () => {
      attempts++;
      try {
        const res = await fetch(`/api/billing/orders/${encodeURIComponent(reference)}`, { cache: "no-store" });
        const data = await res.json();
        if (stopped) return;
        if (!res.ok) {
          setState({ kind: "failed", order: null, message: data.error ?? "We couldn't find this payment." });
          return;
        }
        const order = data.order as PublicOrder;
        if (order.status === "paid") return setState({ kind: "paid", order });
        if (order.status === "failed" || order.status === "expired") {
          return setState({ kind: "failed", order, message: order.failureReason ?? "The payment didn't go through." });
        }
        // Paystack can take a few seconds to settle bank transfers and USSD.
        if (attempts < 10) setTimeout(check, 3000);
        else setState({ kind: "pending", order });
      } catch {
        if (!stopped && attempts < 10) setTimeout(check, 3000);
      }
    };
    check();
    return () => {
      stopped = true;
    };
  }, [reference]);

  const plan = (id?: string) => plans.find((p) => p.id === id)?.name ?? "your plan";

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md items-center">
      <Card className="w-full p-8 text-center">
        {state.kind === "checking" && (
          <>
            <Loader2 className="mx-auto size-8 animate-spin text-muted-foreground" />
            <h1 className="mt-6 text-[22px] font-semibold tracking-tight">Confirming your payment</h1>
            <p className="mt-1.5 text-[13px] text-muted-foreground">This usually takes a few seconds.</p>
          </>
        )}

        {state.kind === "paid" && (
          <>
            <div className="flex justify-center">
              <SuccessMark size={64} />
            </div>
            <h1 className="mt-6 text-[22px] font-semibold tracking-tight">
              You&apos;re on {plan(state.order.planId)}
            </h1>
            <p className="mt-1.5 text-[13px] text-muted-foreground">
              Payment received. Your {state.order.cycle} subscription is active now.
            </p>
            <Link href="/dashboard" className={cn(buttonVariants({ size: "lg" }), "mt-7 w-full")}>
              Go to dashboard
            </Link>
          </>
        )}

        {state.kind === "pending" && (
          <>
            <Loader2 className="mx-auto size-8 text-muted-foreground" />
            <h1 className="mt-6 text-[22px] font-semibold tracking-tight">Payment is still processing</h1>
            <p className="mt-1.5 text-[13px] text-muted-foreground">
              Some bank payments take a few minutes. We&apos;ll activate {plan(state.order.planId)} as soon
              as Paystack confirms it. You can safely leave this page.
            </p>
            <Link href="/dashboard" className={cn(buttonVariants({ size: "lg" }), "mt-7 w-full")}>
              Go to dashboard
            </Link>
          </>
        )}

        {state.kind === "failed" && (
          <>
            <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertCircle className="size-7" strokeWidth={1.5} />
            </span>
            <h1 className="mt-6 text-[22px] font-semibold tracking-tight">Payment not completed</h1>
            <p className="mt-1.5 text-[13px] text-muted-foreground">{state.message}</p>
            <Link href="/plans" className={cn(buttonVariants({ size: "lg" }), "mt-7 w-full")}>
              Back to plans
            </Link>
          </>
        )}
      </Card>
    </div>
  );
}
