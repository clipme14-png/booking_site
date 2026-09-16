import type { NextRequest } from "next/server";
import {
  baseUnitsToDecimal,
  findPaidPlan,
  isBillingCycle,
  priceBaseUnits,
  TOKEN_DECIMALS,
} from "@/lib/billing/catalog";
import { paystackConfig, solanaConfig } from "@/lib/billing/config";
import { jsonError } from "@/lib/billing/http";
import { paystackAmount } from "@/lib/billing/paystack";

/**
 * GET /api/billing/options?planId=scholar&cycle=monthly
 * Which payment methods are available, and what each would charge.
 * Crypto amounts shown here are before the small per-order offset.
 */
export async function GET(request: NextRequest) {
  const planId = request.nextUrl.searchParams.get("planId");
  const cycle = request.nextUrl.searchParams.get("cycle");
  const plan = findPaidPlan(planId);
  if (!plan) return jsonError("Unknown plan.", 400);
  if (!isBillingCycle(cycle)) return jsonError("Unknown billing cycle.", 400);

  let paystack: { currency: string; amount: string } | null = null;
  try {
    paystackConfig();
    const { subunits, currency } = paystackAmount(plan, cycle);
    paystack = { currency, amount: (subunits / 100).toFixed(2) };
  } catch {
    paystack = null;
  }

  let crypto: {
    cluster: string;
    sol: string;
    usdc: string | null;
  } | null = null;
  try {
    const cfg = solanaConfig();
    crypto = {
      cluster: cfg.cluster,
      sol: baseUnitsToDecimal(priceBaseUnits(plan, cycle, "sol"), TOKEN_DECIMALS.sol),
      usdc: cfg.usdcMint
        ? baseUnitsToDecimal(priceBaseUnits(plan, cycle, "usdc"), TOKEN_DECIMALS.usdc)
        : null,
    };
  } catch {
    crypto = null;
  }

  return Response.json({ paystack, crypto }, { headers: { "Cache-Control": "no-store" } });
}
