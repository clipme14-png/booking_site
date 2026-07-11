"use client";

import { ReactNode, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { clusterApiUrl } from "@solana/web3.js";
import type { WalletAdapterNetwork } from "@solana/wallet-adapter-base";

// Default styles for the wallet modal / buttons.
import "@solana/wallet-adapter-react-ui/styles.css";

export function WalletContextProvider({ children }: { children: ReactNode }) {
  // Read the RPC endpoint from env, falling back to the public devnet cluster.
  const endpoint = useMemo(() => {
    const fromEnv = process.env.NEXT_PUBLIC_SOLANA_RPC_URL;
    if (fromEnv) return fromEnv;
    const network = (process.env.NEXT_PUBLIC_SOLANA_NETWORK ??
      "devnet") as WalletAdapterNetwork;
    return clusterApiUrl(network);
  }, []);

  // Wallet-Standard wallets (Phantom, Solflare, Backpack, etc.) are detected
  // automatically, so no adapters need to be listed here.
  const wallets = useMemo(() => [], []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
