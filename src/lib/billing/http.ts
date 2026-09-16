import "server-only";
import { BillingConfigError } from "./config";
import { PaystackError } from "./paystack";

export function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}

/** Turn a thrown error into a response without leaking internals. */
export function errorResponse(e: unknown) {
  if (e instanceof BillingConfigError) {
    console.error(`[billing] configuration: ${e.message}`);
    return jsonError("This payment method isn't configured yet.", 503);
  }
  if (e instanceof PaystackError) {
    console.error(`[billing] paystack: ${e.message}`);
    return jsonError(e.message, e.status);
  }
  console.error("[billing]", e);
  return jsonError("Something went wrong. Please try again.", 500);
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export function isEmail(v: unknown): v is string {
  return typeof v === "string" && v.length <= 254 && EMAIL.test(v);
}
