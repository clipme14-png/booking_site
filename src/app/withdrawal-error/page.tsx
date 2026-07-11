"use client";

import Link from "next/link";
import { ArrowDownToLine, RotateCcw, Receipt, ShieldCheck } from "lucide-react";
import { StatusPage } from "@/components/status-page";
import { Button } from "@/components/ui/button";

export default function WithdrawalErrorPage() {
  return (
    <StatusPage
      icon={ArrowDownToLine}
      title="Withdrawal failed"
      description="Your withdrawal transaction couldn't be processed at this time. Don't worry — your funds are safe and remain in your Quantum Invest balance."
      accent="warning"
      actions={
        <>
          <Link href="/withdraw">
            <Button size="lg" className="w-full sm:w-auto">
              <RotateCcw />
              Try again
            </Button>
          </Link>
          <Link href="/transactions">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              <Receipt />
              View transactions
            </Button>
          </Link>
        </>
      }
    >
      <div className="flex items-center justify-center gap-2 rounded-xl border border-success/20 bg-success/10 px-4 py-3 text-sm text-foreground/80">
        <ShieldCheck className="size-4 shrink-0 text-success" />
        <span>Your balance is unchanged and fully protected.</span>
      </div>
    </StatusPage>
  );
}
