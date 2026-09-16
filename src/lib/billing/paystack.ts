import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import type { Plan } from "@/lib/mock-data";
import { priceUsd, type BillingCycle } from "./catalog";
import { appUrl, paystackConfig } from "./config";
import { markOrderPaid, newOrderId, updateOrder } from "./orders";
import { transact, type Order } from "./store";

/**
 * Paystack Standard (redirect) checkout.
 *
 * 1. `startPaystackCheckout` creates an order and a Paystack transaction and
 *    returns Paystack's hosted payment page URL.
 * 2. Paystack sends the customer back to /billing/return?reference=…, which
 *    asks the server to verify the transaction.
 * 3. Paystack also calls the webhook. Whichever arrives first marks the order
 *    paid; the other is a no-op.
 *
 * Every success is confirmed with Paystack's verify endpoint and the amount
 * and currency are compared with the order before anything is granted.
 */

type PaystackEnvelope<T> = { status: boolean; message: string; data: T };

type PaystackTransaction = {
  id: number;
  status: "success" | "failed" | "abandoned" | "ongoing" | "pending" | "reversed" | string;
  reference: string;
  amount: number;
  currency: string;
  channel: string | null;
  gateway_response: string | null;
  customer?: { email?: string };
};

export class PaystackError extends Error {
  constructor(message: string, readonly status = 502) {
    super(message);
  }
}

async function paystack<T>(pathname: string, init: RequestInit = {}): Promise<T> {
  const { secretKey, baseUrl } = paystackConfig();
  let res: Response;
  try {
    res = await fetch(`${baseUrl}${pathname}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
        ...init.headers,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(15_000),
    });
  } catch {
    throw new PaystackError("Could not reach Paystack. Try again.");
  }
  const body = (await res.json().catch(() => null)) as PaystackEnvelope<T> | null;
  if (!res.ok || !body?.status) {
    throw new PaystackError(body?.message ?? `Paystack returned ${res.status}`, res.status >= 500 ? 502 : 400);
  }
  return body.data;
}

/** Amount in the currency's subunit (kobo, pesewas, cents). */
export function paystackAmount(plan: Plan, cycle: BillingCycle) {
  const { usdRate, currency } = paystackConfig();
  const subunits = Math.round(priceUsd(plan, cycle) * usdRate * 100);
  return { subunits, currency };
}

export async function startPaystackCheckout(input: {
  plan: Plan;
  cycle: BillingCycle;
  email: string;
}) {
  const { subunits, currency } = paystackAmount(input.plan, input.cycle);
  const id = newOrderId();
  const now = Date.now();

  const order: Order = {
    id,
    method: "paystack",
    planId: input.plan.id,
    cycle: input.cycle,
    email: input.email,
    status: "pending",
    amount: String(subunits),
    currency,
    decimals: 2,
    createdAt: now,
    expiresAt: null,
    paidAt: null,
    paystack: { authorizationUrl: null, transactionId: null, channel: null, failureReason: null },
  };
  await transact((db) => {
    db.orders[id] = order;
  });

  try {
    const data = await paystack<{ authorization_url: string; reference: string }>(
      "/transaction/initialize",
      {
        method: "POST",
        body: JSON.stringify({
          email: input.email,
          amount: String(subunits),
          currency,
          reference: id,
          callback_url: `${appUrl()}/billing/return?reference=${encodeURIComponent(id)}`,
          metadata: {
            order_id: id,
            plan_id: input.plan.id,
            cycle: input.cycle,
            cancel_action: `${appUrl()}/plans`,
          },
        }),
      },
    );
    await updateOrder(id, (o) => {
      o.paystack!.authorizationUrl = data.authorization_url;
    });
    return { orderId: id, authorizationUrl: data.authorization_url };
  } catch (e) {
    await updateOrder(id, (o) => {
      o.status = "failed";
      o.paystack!.failureReason = e instanceof Error ? e.message : "Could not start checkout";
    });
    throw e;
  }
}

/**
 * Ask Paystack for the transaction's final state and apply it to the order.
 * Returns the order after the update.
 */
export async function verifyPaystackOrder(order: Order): Promise<Order> {
  if (order.method !== "paystack" || order.status !== "pending") return order;

  let tx: PaystackTransaction;
  try {
    tx = await paystack<PaystackTransaction>(
      `/transaction/verify/${encodeURIComponent(order.id)}`,
    );
  } catch (e) {
    // "Transaction reference not found" just means the customer hasn't paid yet.
    if (e instanceof PaystackError && e.status === 400) return order;
    throw e;
  }

  if (tx.status === "success") {
    if (tx.reference !== order.id || String(tx.amount) !== order.amount || tx.currency !== order.currency) {
      const reason = `Amount mismatch: expected ${order.amount} ${order.currency}, received ${tx.amount} ${tx.currency}`;
      console.error(`[billing] Paystack ${order.id}: ${reason}`);
      return (
        (await updateOrder(order.id, (o) => {
          o.status = "failed";
          o.paystack!.failureReason = reason;
        })) ?? order
      );
    }
    const { order: paid } = await markOrderPaid(order.id, {
      paystackTransactionId: tx.id,
      channel: tx.channel ?? undefined,
    });
    return paid ?? order;
  }

  if (tx.status === "failed" || tx.status === "reversed") {
    return (
      (await updateOrder(order.id, (o) => {
        o.status = "failed";
        o.paystack!.failureReason = tx.gateway_response ?? `Payment ${tx.status}`;
      })) ?? order
    );
  }

  // abandoned / ongoing / pending: the customer may still complete it.
  return order;
}

/** Constant-time check of the `x-paystack-signature` header. */
export function isValidPaystackSignature(rawBody: string, signature: string | null) {
  if (!signature) return false;
  const { secretKey } = paystackConfig();
  const expected = createHmac("sha512", secretKey).update(rawBody).digest("hex");
  const a = Buffer.from(expected, "utf8");
  const b = Buffer.from(signature.trim(), "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}
