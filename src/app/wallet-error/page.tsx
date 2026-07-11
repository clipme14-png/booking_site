"use client";

import Link from "next/link";
import {
  Wallet,
  Lock,
  CheckCircle2,
  Download,
  ArrowRight,
} from "lucide-react";
import { StatusPage } from "@/components/status-page";
import { Button } from "@/components/ui/button";
import { WalletButton } from "@/components/wallet-button";

const fixes = [
  {
    icon: Lock,
    text: "Unlock your wallet extension and make sure it's on the Solana network.",
  },
  {
    icon: CheckCircle2,
    text: "Approve the connection request in the wallet pop-up.",
  },
  {
    icon: Download,
    text: "Install a supported wallet (Phantom, Solflare) if you don't have one.",
  },
];

export default function WalletErrorPage() {
  return (
    <StatusPage
      icon={Wallet}
      title="Wallet connection failed"
      description="We couldn't connect to your Solana wallet. This usually happens when the request was dismissed or the extension is locked."
      accent="secondary"
      actions={
        <>
          <WalletButton size="lg" />
          <Link href="/dashboard">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Continue without wallet
              <ArrowRight />
            </Button>
          </Link>
        </>
      }
    >
      <div className="rounded-xl border border-border bg-card/60 p-4 text-left backdrop-blur">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Common fixes
        </p>
        <ul className="space-y-3">
          {fixes.map((fix, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-lg bg-secondary/12 text-secondary">
                <fix.icon className="size-3.5" />
              </span>
              <span className="text-sm leading-relaxed text-foreground/80">
                {fix.text}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </StatusPage>
  );
}
