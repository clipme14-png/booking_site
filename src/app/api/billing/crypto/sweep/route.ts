import { timingSafeEqual } from "node:crypto";
import { cronSecret } from "@/lib/billing/config";
import { checkCryptoOrder } from "@/lib/billing/crypto";
import { listOrders } from "@/lib/billing/store";

/**
 * POST /api/billing/crypto/sweep
 * Header: Authorization: Bearer <BILLING_CRON_SECRET>
 *
 * Checks every pending crypto order. Run it every minute or two from a
 * scheduler, so payments are credited even when the customer closed the page
 * before confirmation.
 */
export async function POST(request: Request) {
  const secret = cronSecret();
  if (!secret) return new Response("Not configured", { status: 503 });

  const given = Buffer.from(request.headers.get("authorization") ?? "");
  const wanted = Buffer.from(`Bearer ${secret}`);
  if (given.length !== wanted.length || !timingSafeEqual(given, wanted)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const pending = await listOrders((o) => o.status === "pending" && !!o.crypto);
  const summary = { checked: 0, paid: 0, expired: 0, errors: 0 };
  for (const order of pending) {
    try {
      const after = await checkCryptoOrder(order, { force: true });
      summary.checked++;
      if (after.status === "paid") summary.paid++;
      if (after.status === "expired") summary.expired++;
    } catch (e) {
      summary.errors++;
      console.error(`[billing] sweep failed for ${order.id}`, e);
    }
  }
  return Response.json(summary);
}
