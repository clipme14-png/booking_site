"use client";

import Link from "next/link";
import { CreditCard, RotateCcw, LifeBuoy } from "lucide-react";
import { StatusPage } from "@/components/status-page";
import { Button } from "@/components/ui/button";

export default function SubscriptionErrorPage() {
  return (
    <StatusPage
      icon={CreditCard}
      title="Payment failed"
      description="Your SOL transaction didn't go through, so your subscription wasn't activated. No funds were deducted from your wallet."
      accent="destructive"
      actions={
        <>
          <Link href="/plans">
            <Button size="lg" className="w-full sm:w-auto">
              <RotateCcw />
              Try again
            </Button>
          </Link>
          <Link href="/support">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <LifeBuoy />
              Contact support
            </Button>
          </Link>
        </>
      }
    >
      <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-4 text-left">
        <p className="text-xs font-semibold uppercase tracking-wide text-destructive">
          Reason
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">
          Transaction rejected — insufficient SOL balance to cover the plan
          price plus network fees.
        </p>
      </div>
    </StatusPage>
  );
}
