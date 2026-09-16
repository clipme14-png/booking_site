import "server-only";
import { clusterApiUrl, PublicKey, type Cluster } from "@solana/web3.js";

/**
 * All billing configuration comes from environment variables.
 * See .env.example for the full list.
 */

const USDC_MINTS: Partial<Record<Cluster, string>> = {
  "mainnet-beta": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  devnet: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
};

export class BillingConfigError extends Error {}

function required(name: string): string {
  const v = process.env[name]?.trim();
  if (!v) throw new BillingConfigError(`${name} is not set`);
  return v;
}

export function appUrl() {
  return (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

/* ------------------------------ Paystack ------------------------------ */

export function paystackConfig() {
  const secretKey = required("PAYSTACK_SECRET_KEY");
  const currency = (process.env.PAYSTACK_CURRENCY ?? "NGN").toUpperCase();
  // Paystack charges in a local currency. Plan prices are set in USD, so a
  // rate is needed for anything else, e.g. PAYSTACK_USD_RATE=1550 for NGN.
  let usdRate = 1;
  if (currency !== "USD") {
    usdRate = Number(required("PAYSTACK_USD_RATE"));
    if (!Number.isFinite(usdRate) || usdRate <= 0) {
      throw new BillingConfigError("PAYSTACK_USD_RATE must be a positive number");
    }
  }
  return {
    secretKey,
    currency,
    usdRate,
    baseUrl: process.env.PAYSTACK_BASE_URL ?? "https://api.paystack.co",
  };
}

/* ------------------------------- Solana ------------------------------- */

export function solanaConfig() {
  const cluster = (process.env.NEXT_PUBLIC_SOLANA_NETWORK ?? "devnet") as Cluster;
  const rpcUrl =
    process.env.SOLANA_RPC_URL ??
    process.env.NEXT_PUBLIC_SOLANA_RPC_URL ??
    clusterApiUrl(cluster);

  let merchant: PublicKey;
  try {
    merchant = new PublicKey(required("MERCHANT_WALLET"));
  } catch (e) {
    if (e instanceof BillingConfigError) throw e;
    throw new BillingConfigError("MERCHANT_WALLET is not a valid Solana address");
  }

  const usdcMintRaw = process.env.USDC_MINT ?? USDC_MINTS[cluster];
  const usdcMint = usdcMintRaw ? new PublicKey(usdcMintRaw) : null;

  const commitment =
    process.env.SOLANA_PAYMENT_COMMITMENT === "finalized" ? "finalized" : "confirmed";

  return {
    cluster,
    rpcUrl,
    merchant,
    usdcMint,
    commitment,
    /** How long a customer has to send the payment. */
    windowMs: Number(process.env.CRYPTO_PAYMENT_WINDOW_MIN ?? 30) * 60_000,
    /** Extra time to keep looking for a payment sent just before the deadline. */
    graceMs: 15 * 60_000,
  } as const;
}

export function cronSecret() {
  return process.env.BILLING_CRON_SECRET?.trim() || null;
}
