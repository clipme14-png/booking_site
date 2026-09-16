/**
 * Plan pricing. Shared by the client (for display) and the server (for
 * charging). The server never trusts an amount sent by the browser: it
 * recomputes the price from this catalog.
 */
import { plans, type Plan } from "@/lib/mock-data";

export type BillingCycle = "monthly" | "yearly";
export type PaymentMethod = "paystack" | "sol" | "usdc";
export type CryptoToken = Extract<PaymentMethod, "sol" | "usdc">;

/** Yearly billing is twelve months with a 20% discount. */
const YEARLY_MULTIPLIER = 12 * 0.8;

export const TOKEN_DECIMALS: Record<CryptoToken, number> = { sol: 9, usdc: 6 };
export const TOKEN_SYMBOL: Record<CryptoToken, string> = { sol: "SOL", usdc: "USDC" };

export function isBillingCycle(v: unknown): v is BillingCycle {
  return v === "monthly" || v === "yearly";
}

export function isPaymentMethod(v: unknown): v is PaymentMethod {
  return v === "paystack" || v === "sol" || v === "usdc";
}

export function findPaidPlan(planId: unknown): Plan | undefined {
  return plans.find((p) => p.id === planId && p.priceSol > 0);
}

const round = (n: number, digits: number) => {
  const f = 10 ** digits;
  return Math.round(n * f) / f;
};

/** Price in SOL, as shown to people. */
export function priceSol(plan: Plan, cycle: BillingCycle) {
  return round(cycle === "yearly" ? plan.priceSol * YEARLY_MULTIPLIER : plan.priceSol, 4);
}

/** Price in US dollars. USDC is charged at this value, one to one. */
export function priceUsd(plan: Plan, cycle: BillingCycle) {
  return round(cycle === "yearly" ? plan.priceUsd * YEARLY_MULTIPLIER : plan.priceUsd, 2);
}

/** Price in a token's smallest unit (lamports for SOL, micro-USDC for USDC). */
export function priceBaseUnits(plan: Plan, cycle: BillingCycle, token: CryptoToken): bigint {
  const value = token === "sol" ? priceSol(plan, cycle) : priceUsd(plan, cycle);
  return decimalToBaseUnits(String(value), TOKEN_DECIMALS[token]);
}

/** "1.5" with 9 decimals → BigInt(1500000000). Exact, no floating point. */
export function decimalToBaseUnits(value: string, decimals: number): bigint {
  const [whole, frac = ""] = value.split(".");
  if (!/^\d+$/.test(whole) || !/^\d*$/.test(frac) || frac.length > decimals) {
    throw new Error(`Invalid amount "${value}"`);
  }
  return BigInt(whole) * BigInt(10) ** BigInt(decimals) + BigInt(frac.padEnd(decimals, "0") || "0");
}

/** BigInt(1500000123) with 9 decimals → "1.500000123". Trailing zeros removed. */
export function baseUnitsToDecimal(units: bigint | string, decimals: number): string {
  const n = BigInt(units);
  const base = BigInt(10) ** BigInt(decimals);
  const whole = n / base;
  const frac = (n % base).toString().padStart(decimals, "0").replace(/0+$/, "");
  return frac ? `${whole}.${frac}` : whole.toString();
}
