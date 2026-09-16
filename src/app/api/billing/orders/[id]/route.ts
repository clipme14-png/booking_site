import type { NextRequest } from "next/server";
import { BillingConfigError } from "@/lib/billing/config";
import { checkCryptoOrder, cryptoPaymentDetails } from "@/lib/billing/crypto";
import { errorResponse, jsonError } from "@/lib/billing/http";
import { publicOrder } from "@/lib/billing/orders";
import { verifyPaystackOrder } from "@/lib/billing/paystack";
import { getOrder } from "@/lib/billing/store";

/**
 * GET /api/billing/orders/:id
 * Returns the order's status. While it is pending, this also checks with
 * Paystack or the Solana network, so polling it is enough to confirm payment.
 */
export async function GET(_request: NextRequest, ctx: RouteContext<"/api/billing/orders/[id]">) {
  const { id } = await ctx.params;
  if (!/^[A-Za-z0-9.=-]{1,64}$/.test(id)) return jsonError("Order not found.", 404);

  let order = await getOrder(id);
  if (!order) return jsonError("Order not found.", 404);

  try {
    if (order.status === "pending") {
      order = order.method === "paystack" ? await verifyPaystackOrder(order) : await checkCryptoOrder(order);
    }
  } catch (e) {
    if (e instanceof BillingConfigError) return errorResponse(e);
    // A network hiccup shouldn't break polling; report the stored state.
    console.error(`[billing] status check for ${id} failed`, e);
  }

  return Response.json(
    {
      order: publicOrder(order),
      payment: order.crypto ? cryptoPaymentDetails(order) : null,
    },
    { headers: { "Cache-Control": "no-store" } },
  );
}
