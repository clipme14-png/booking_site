import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { BillingCycle, PaymentMethod } from "./catalog";

/**
 * Order and subscription storage.
 *
 * This implementation keeps everything in one JSON file and serialises writes
 * inside the process. It is durable on a single long-running server
 * (`next start`, a VM, a container with a volume). It is NOT suitable for
 * serverless hosting or several instances. Replace the four functions below
 * with database calls before running at scale; nothing else needs to change.
 */

export type OrderStatus = "pending" | "paid" | "expired" | "failed";

export type Order = {
  id: string;
  method: PaymentMethod;
  planId: string;
  cycle: BillingCycle;
  email: string;
  status: OrderStatus;
  /** Amount in the smallest unit of `currency` (kobo, cents, lamports, micro-USDC). */
  amount: string;
  /** ISO currency (NGN, USD…) for Paystack, or SOL / USDC for crypto. */
  currency: string;
  decimals: number;
  createdAt: number;
  expiresAt: number | null;
  paidAt: number | null;
  /** Crypto only. */
  crypto?: {
    recipient: string;
    /** Owner wallet the payment must reach (same as recipient for SOL). */
    merchant: string;
    mint: string | null;
    reference: string;
    /** Small per-order amount offset that makes manual transfers identifiable. */
    tag: number;
    signature: string | null;
    payer: string | null;
    lastCheckedAt: number;
  };
  /** Paystack only. */
  paystack?: {
    authorizationUrl: string | null;
    transactionId: number | null;
    channel: string | null;
    failureReason: string | null;
  };
};

export type Subscription = {
  email: string;
  planId: string;
  cycle: BillingCycle;
  activeUntil: number;
  lastOrderId: string;
  updatedAt: number;
};

type Db = {
  orders: Record<string, Order>;
  subscriptions: Record<string, Subscription>;
  /** Transaction signatures already credited, so one payment can't pay twice. */
  claimedSignatures: Record<string, string>;
};

// The data file is chosen at runtime, so the bundler is told not to trace it.
const file = path.resolve(
  /*turbopackIgnore: true*/ process.env.BILLING_DATA_FILE ??
    path.join(/*turbopackIgnore: true*/ process.cwd(), ".data", "billing.json"),
);

let queue: Promise<unknown> = Promise.resolve();

async function load(): Promise<Db> {
  try {
    return JSON.parse(await fs.readFile(/*turbopackIgnore: true*/ file, "utf8")) as Db;
  } catch (e) {
    if ((e as NodeJS.ErrnoException).code === "ENOENT") {
      return { orders: {}, subscriptions: {}, claimedSignatures: {} };
    }
    throw e;
  }
}

async function save(db: Db) {
  await fs.mkdir(/*turbopackIgnore: true*/ path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.tmp`;
  await fs.writeFile(/*turbopackIgnore: true*/ tmp, JSON.stringify(db, null, 2));
  await fs.rename(/*turbopackIgnore: true*/ tmp, /*turbopackIgnore: true*/ file);
}

/** Run `fn` with exclusive access to the data. Changes to `db` are saved. */
export function transact<T>(fn: (db: Db) => T | Promise<T>): Promise<T> {
  const run = queue.then(async () => {
    const db = await load();
    const result = await fn(db);
    await save(db);
    return result;
  });
  queue = run.catch(() => undefined);
  return run;
}

export async function getOrder(id: string): Promise<Order | null> {
  await queue;
  return (await load()).orders[id] ?? null;
}

export async function listOrders(filter: (o: Order) => boolean): Promise<Order[]> {
  await queue;
  return Object.values((await load()).orders).filter(filter);
}

export async function getSubscription(email: string): Promise<Subscription | null> {
  await queue;
  return (await load()).subscriptions[email.toLowerCase()] ?? null;
}
