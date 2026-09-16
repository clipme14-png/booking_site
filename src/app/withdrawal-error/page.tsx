"use client";

import Link from "next/link";
import { ArrowDownToLine, ShieldCheck } from "lucide-react";
import { StatusPage } from "@/components/status-page";
import { Button } from "@/components/ui/button";

export default function WithdrawalErrorPage() {
  return (
    <StatusPage
      icon={ArrowDownToLine}
      title="Withdrawal not completed."
      description="We couldn't process this withdrawal right now. Your funds are still in your Quantum Invest balance."
      accent="warning"
      actions={
        <>
          <Link href="/withdraw">
            <Button size="lg" className="w-full">
              Try again
            </Button>
          </Link>
          <Link href="/transactions">
            <Button variant="outline" size="lg" className="w-full">
              View transactions
            </Button>
          </Link>
        </>
      }
    >
      <div className="flex items-center justify-center gap-2 text-[13px] text-muted-foreground">
        <ShieldCheck className="size-4 shrink-0 stroke-[1.75] text-success" />
        <span>Your balance is unchanged.</span>
      </div>
    </StatusPage>
  );
}
