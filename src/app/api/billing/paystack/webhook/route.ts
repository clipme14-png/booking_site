import { isValidPaystackSignature, verifyPaystackOrder } from "@/lib/billing/paystack";
import { getOrder } from "@/lib/billing/store";

/**
 * POST /api/billing/paystack/webhook
 * Set this URL in the Paystack dashboard (Settings → API Keys & Webhooks).
 *
 * The event body is only used to learn which order changed. The order is then
 * re-verified with Paystack's API, so a forged or replayed event can't grant
 * anything.
 */
export async function POST(request: Request) {
  const raw = await request.text();
  let valid = false;
  try {
    valid = isValidPaystackSignature(raw, request.headers.get("x-paystack-signature"));
  } catch (e) {
    console.error("[billing] webhook received but Paystack is not configured", e);
    return new Response("Not configured", { status: 503 });
  }
  if (!valid) return new Response("Invalid signature", { status: 401 });

  let event: { event?: string; data?: { reference?: string } };
  try {
    event = JSON.parse(raw);
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const reference = event.data?.reference;
  if (!reference || !["charge.success", "charge.failed"].includes(event.event ?? "")) {
    // Acknowledge events we don't act on so Paystack stops retrying them.
    return new Response("Ignored", { status: 200 });
  }

  const order = await getOrder(reference);
  if (!order) return new Response("Unknown reference", { status: 200 });

  try {
    await verifyPaystackOrder(order);
  } catch (e) {
    // A non-2xx response makes Paystack retry later.
    console.error(`[billing] webhook verification for ${reference} failed`, e);
    return new Response("Verification failed", { status: 502 });
  }
  return new Response("OK", { status: 200 });
}
