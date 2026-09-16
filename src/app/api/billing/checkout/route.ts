import type { NextRequest } from "next/server";
import { findPaidPlan, isBillingCycle, isPaymentMethod } from "@/lib/billing/catalog";
import { startCryptoCheckout } from "@/lib/billing/crypto";
import { errorResponse, isEmail, jsonError } from "@/lib/billing/http";
import { publicOrder } from "@/lib/billing/orders";
import { startPaystackCheckout } from "@/lib/billing/paystack";

/**
 * POST /api/billing/checkout
 * Body: { planId, cycle: "monthly" | "yearly", method: "paystack" | "sol" | "usdc", email }
 *
 * Paystack → { orderId, authorizationUrl }  (redirect the browser there)
 * Crypto   → { order, payment }             (show address, amount and QR)
 */
export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return jsonError("Invalid request body.", 400);

  const plan = findPaidPlan(body.planId);
  if (!plan) return jsonError("Unknown plan.", 400);
  if (!isBillingCycle(body.cycle)) return jsonError("Unknown billing cycle.", 400);
  if (!isPaymentMethod(body.method)) return jsonError("Unknown payment method.", 400);
  if (!isEmail(body.email)) return jsonError("Enter a valid email address.", 400);

  const email = body.email.trim().toLowerCase();

  try {
    if (body.method === "paystack") {
      const result = await startPaystackCheckout({ plan, cycle: body.cycle, email });
      return Response.json(result, { headers: { "Cache-Control": "no-store" } });
    }
    const { order, payment } = await startCryptoCheckout({
      plan,
      cycle: body.cycle,
      email,
      token: body.method,
    });
    return Response.json(
      { order: publicOrder(order), payment },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (e) {
    return errorResponse(e);
  }
}
