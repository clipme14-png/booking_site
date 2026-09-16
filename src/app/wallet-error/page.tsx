"use client";

import Link from "next/link";
import { Wallet, Lock, CheckCircle2, Download } from "lucide-react";
import { StatusChecklist, StatusPage } from "@/components/status-page";
import { Button } from "@/components/ui/button";
import { WalletButton } from "@/components/wallet-button";

const fixes = [
  { icon: Lock, text: "Unlock your wallet extension and make sure it is set to Solana." },
  { icon: CheckCircle2, text: "Approve the connection request when the wallet window opens." },
  { icon: Download, text: "No wallet yet? Install Phantom or Solflare, then try again." },
];

export default function WalletErrorPage() {
  return (
    <StatusPage
      icon={Wallet}
      title="Couldn't connect your wallet."
      description="The request was dismissed or the extension is locked. Nothing was changed."
      actions={
        <>
          <WalletButton size="lg" />
          <Link href="/dashboard">
            <Button variant="outline" size="lg" className="w-full">
              Continue without a wallet
            </Button>
          </Link>
        </>
      }
    >
      <StatusChecklist title="Things to check" items={fixes} />
    </StatusPage>
  );
}
