"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";
import { Wallet, LogOut, Copy, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dropdown, DropdownItem, DropdownSeparator } from "@/components/ui/dropdown";
import { useToast } from "@/components/ui/toast";
import { shortAddress } from "@/lib/utils";

export function WalletButton({
  size = "default",
  variant = "default",
}: {
  size?: "sm" | "default" | "lg";
  variant?: "default" | "outline";
}) {
  const { publicKey, connected, disconnect } = useWallet();
  const { setVisible } = useWalletModal();
  const { toast } = useToast();

  if (!connected || !publicKey) {
    return (
      <Button
        size={size}
        variant={variant}
        onClick={() => setVisible(true)}
      >
        <Wallet />
        Connect Wallet
      </Button>
    );
  }

  const address = publicKey.toBase58();

  return (
    <Dropdown
      trigger={
        <Button size={size} variant="outline" className="font-mono">
          <span className="size-2 rounded-full bg-success" />
          {shortAddress(address)}
          <ChevronDown className="opacity-60" />
        </Button>
      }
    >
      <div className="px-2.5 py-2">
        <p className="text-xs text-muted-foreground">Connected</p>
        <p className="mt-0.5 font-mono text-sm">{shortAddress(address, 6)}</p>
      </div>
      <DropdownSeparator />
      <DropdownItem
        onClick={() => {
          navigator.clipboard?.writeText(address);
          toast({ title: "Address copied", variant: "success" });
        }}
      >
        <Copy /> Copy address
      </DropdownItem>
      <DropdownItem destructive onClick={() => disconnect()}>
        <LogOut /> Disconnect
      </DropdownItem>
    </Dropdown>
  );
}
