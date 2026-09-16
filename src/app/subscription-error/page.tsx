"use client";

import Link from "next/link";
import { CreditCard } from "lucide-react";
import { StatusPage } from "@/components/status-page";
import { Button } from "@/components/ui/button";

export default function SubscriptionErrorPage() {
  return (
    <StatusPage
      icon={CreditCard}
      title="Payment didn't go through."
      description="Your subscription wasn't activated, and nothing was taken from your wallet."
      accent="destructive"
      actions={
        <>
          <Link href="/plans">
            <Button size="lg" className="w-full">
              Try again
            </Button>
          </Link>
          <a href="mailto:support@quantuminvest.io">
            <Button variant="outline" size="lg" className="w-full">
              Contact support
            </Button>
          </a>
        </>
      }
    >
      <div className="rounded-2xl bg-background p-5 text-left">
        <p className="text-[13px] font-semibold">Reason</p>
        <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
          The wallet balance didn&apos;t cover the plan price plus the network fee.
          Add SOL to your wallet, then try again.
        </p>
      </div>
    </StatusPage>
  );
}
