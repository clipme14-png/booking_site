import "server-only";
import { randomBytes } from "node:crypto";
import { transact, type Order } from "./store";

/** Paystack references allow letters, digits, "-", "." and "=". */
export function newOrderId() {
  return `qi-${Date.now().toString(36)}-${randomBytes(6).toString("hex")}`;
}

const DAY = 24 * 60 * 60 * 1000;

/**
 * Mark an order paid and extend the customer's subscription.
 * Safe to call many times: only the first call for an order has any effect.
 * Returns the order as stored after the call.
 */
export async function markOrderPaid(
  orderId: string,
  details: {
    signature?: string;
    payer?: string;
    paystackTransactionId?: number;
    channel?: string;
  } = {},
): Promise<{ order: Order | null; newlyPaid: boolean }> {
  return transact((db) => {
    const order = db.orders[orderId];
    if (!order) return { order: null, newlyPaid: false };
    if (order.status === "paid") return { order, newlyPaid: false };

    if (details.signature) {
      const owner = db.claimedSignatures[details.signature];
      if (owner && owner !== orderId) {
        // This transaction already paid for a different order.
        return { order, newlyPaid: false };
      }
      db.claimedSignatures[details.signature] = orderId;
    }

    const now = Date.now();
    order.status = "paid";
    order.paidAt = now;
    if (order.crypto) {
      order.crypto.signature = details.signature ?? order.crypto.signature;
      order.crypto.payer = details.payer ?? order.crypto.payer;
    }
    if (order.paystack) {
      order.paystack.transactionId =
        details.paystackTransactionId ?? order.paystack.transactionId;
      order.paystack.channel = details.channel ?? order.paystack.channel;
    }

    // Extend from the later of now and the current end date, so paying early
    // never loses days already paid for.
    const key = order.email.toLowerCase();
    const current = db.subscriptions[key];
    const start = current && current.activeUntil > now ? current.activeUntil : now;
    const length = order.cycle === "yearly" ? 365 * DAY : 30 * DAY;
    db.subscriptions[key] = {
      email: key,
      planId: order.planId,
      cycle: order.cycle,
      activeUntil: start + length,
      lastOrderId: order.id,
      updatedAt: now,
    };

    return { order, newlyPaid: true };
  });
}

export async function updateOrder(orderId: string, patch: (o: Order) => void) {
  return transact((db) => {
    const order = db.orders[orderId];
    if (order) patch(order);
    return order ?? null;
  });
}

/** What the browser is allowed to see about an order. */
export function publicOrder(order: Order) {
  return {
    id: order.id,
    method: order.method,
    planId: order.planId,
    cycle: order.cycle,
    status: order.status,
    amount: order.amount,
    currency: order.currency,
    decimals: order.decimals,
    createdAt: order.createdAt,
    expiresAt: order.expiresAt,
    paidAt: order.paidAt,
    signature: order.crypto?.signature ?? null,
    failureReason: order.paystack?.failureReason ?? null,
  };
}
export type PublicOrder = ReturnType<typeof publicOrder>;
