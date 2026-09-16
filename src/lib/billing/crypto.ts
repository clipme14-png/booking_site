import "server-only";
import {
  Connection,
  Keypair,
  PublicKey,
  type ParsedTransactionWithMeta,
} from "@solana/web3.js";
import type { Plan } from "@/lib/mock-data";
import {
  baseUnitsToDecimal,
  priceBaseUnits,
  TOKEN_DECIMALS,
  TOKEN_SYMBOL,
  type BillingCycle,
  type CryptoToken,
} from "./catalog";
import { BillingConfigError, solanaConfig } from "./config";
import { markOrderPaid, newOrderId, updateOrder } from "./orders";
import { transact, type Order } from "./store";
import { associatedTokenAddress, solanaPayUrl } from "./solana-tx";

/**
 * Crypto checkout: the customer sends SOL or USDC to the merchant wallet.
 *
 * Each order gets:
 *  - a random reference key. Wallets that open the Solana Pay link or QR, and
 *    the in-app "Pay with wallet" button, attach it to the transaction, so the
 *    payment is found by looking the reference up on-chain.
 *  - a unique amount (the price plus a tiny per-order offset). A customer who
 *    copies the address and types the amount by hand, or pays from an
 *    exchange, can't attach a reference, so their transfer is matched by that
 *    exact amount instead.
 *
 * A transaction is only accepted if it succeeded, credited the merchant with
 * at least the order amount, happened after the order was created, and has
 * not already paid for another order.
 */

const TAG_UNIT: Record<CryptoToken, bigint> = {
  sol: BigInt(100), // 0.0000001 SOL per step, at most ~0.001 SOL
  usdc: BigInt(1), // 0.000001 USDC per step, at most ~0.01 USDC
};
const MAX_TAG = 9999;
/** Offsets stay reserved this long, so a late payment can't match a newer order. */
const TAG_RESERVATION_MS = 48 * 60 * 60 * 1000;
const CHECK_INTERVAL_MS = 3000;

let cachedConnection: { url: string; commitment: string; conn: Connection } | null = null;
function connection() {
  const { rpcUrl, commitment } = solanaConfig();
  if (!cachedConnection || cachedConnection.url !== rpcUrl || cachedConnection.commitment !== commitment) {
    cachedConnection = { url: rpcUrl, commitment, conn: new Connection(rpcUrl, commitment) };
  }
  return cachedConnection.conn;
}

export async function startCryptoCheckout(input: {
  plan: Plan;
  cycle: BillingCycle;
  email: string;
  token: CryptoToken;
}) {
  const cfg = solanaConfig();
  if (input.token === "usdc" && !cfg.usdcMint) {
    throw new BillingConfigError(`USDC_MINT is not set for cluster ${cfg.cluster}`);
  }
  const mint = input.token === "usdc" ? cfg.usdcMint!.toBase58() : null;
  const base = priceBaseUnits(input.plan, input.cycle, input.token);
  const reference = Keypair.generate().publicKey.toBase58();
  const now = Date.now();
  const id = newOrderId();

  const order = await transact((db) => {
    const taken = new Set(
      Object.values(db.orders)
        .filter((o) => o.method === input.token && o.crypto && now - o.createdAt < TAG_RESERVATION_MS)
        .map((o) => o.crypto!.tag),
    );
    const free: number[] = [];
    for (let t = 1; t <= MAX_TAG; t++) if (!taken.has(t)) free.push(t);
    if (free.length === 0) throw new Error("Too many open crypto orders. Try again later.");
    const tag = free[Math.floor(Math.random() * free.length)];

    const o: Order = {
      id,
      method: input.token,
      planId: input.plan.id,
      cycle: input.cycle,
      email: input.email,
      status: "pending",
      amount: (base + BigInt(tag) * TAG_UNIT[input.token]).toString(),
      currency: TOKEN_SYMBOL[input.token],
      decimals: TOKEN_DECIMALS[input.token],
      createdAt: now,
      expiresAt: now + cfg.windowMs,
      paidAt: null,
      crypto: {
        recipient: cfg.merchant.toBase58(),
        merchant: cfg.merchant.toBase58(),
        mint,
        reference,
        tag,
        signature: null,
        payer: null,
        lastCheckedAt: 0,
      },
    };
    db.orders[id] = o;
    return o;
  });

  return { order, payment: cryptoPaymentDetails(order) };
}

export function cryptoPaymentDetails(order: Order) {
  const c = order.crypto!;
  const amountDecimal = baseUnitsToDecimal(order.amount, order.decimals);
  return {
    recipient: c.recipient,
    amount: order.amount,
    amountDecimal,
    decimals: order.decimals,
    token: order.currency,
    mint: c.mint,
    reference: c.reference,
    cluster: solanaConfig().cluster,
    solanaPayUrl: solanaPayUrl({
      recipient: c.recipient,
      amountDecimal,
      mint: c.mint,
      reference: c.reference,
      label: "Quantum Invest",
      message: `${order.planId[0].toUpperCase()}${order.planId.slice(1)} plan, ${order.cycle}`,
    }),
  };
}

/** How much `owner` gained in this transaction, in smallest units. */
function amountReceived(tx: ParsedTransactionWithMeta, owner: string, mint: string | null): bigint {
  const meta = tx.meta;
  if (!meta) return BigInt(0);
  if (!mint) {
    const i = tx.transaction.message.accountKeys.findIndex((k) => k.pubkey.toBase58() === owner);
    if (i < 0) return BigInt(0);
    return BigInt(meta.postBalances[i]) - BigInt(meta.preBalances[i]);
  }
  const sum = (list: typeof meta.postTokenBalances) =>
    (list ?? [])
      .filter((b) => b.owner === owner && b.mint === mint)
      .reduce((s, b) => s + BigInt(b.uiTokenAmount.amount), BigInt(0));
  return sum(meta.postTokenBalances) - sum(meta.preTokenBalances);
}

function hasAccount(tx: ParsedTransactionWithMeta, key: string) {
  return tx.transaction.message.accountKeys.some((k) => k.pubkey.toBase58() === key);
}

/**
 * Look for an on-chain payment for this order and record it.
 * Throttled per order, so it is safe to call on every status poll.
 */
export async function checkCryptoOrder(order: Order, { force = false } = {}): Promise<Order> {
  if (!order.crypto || order.status !== "pending") return order;
  const now = Date.now();
  if (!force && now - order.crypto.lastCheckedAt < CHECK_INTERVAL_MS) return order;
  await updateOrder(order.id, (o) => {
    o.crypto!.lastCheckedAt = now;
  });

  const cfg = solanaConfig();
  const conn = connection();
  const c = order.crypto;
  const expected = BigInt(order.amount);
  const watched = c.mint
    ? associatedTokenAddress(new PublicKey(c.merchant), new PublicKey(c.mint))
    : new PublicKey(c.merchant);
  const earliest = Math.floor(order.createdAt / 1000) - 60;

  const [byReference, byRecipient] = await Promise.all([
    conn.getSignaturesForAddress(new PublicKey(c.reference), { limit: 10 }, cfg.commitment),
    conn.getSignaturesForAddress(watched, { limit: 50 }, cfg.commitment),
  ]);

  const candidates = new Map<string, boolean>(); // signature → carries reference
  for (const s of byReference) if (!s.err) candidates.set(s.signature, true);
  for (const s of byRecipient) {
    if (s.err || candidates.has(s.signature)) continue;
    if (s.blockTime != null && s.blockTime < earliest) continue;
    candidates.set(s.signature, false);
  }

  const signatures = [...candidates.keys()];
  const txs = signatures.length
    ? await conn.getParsedTransactions(signatures, {
        commitment: cfg.commitment,
        maxSupportedTransactionVersion: 0,
      })
    : [];

  for (let i = 0; i < signatures.length; i++) {
    const tx = txs[i];
    if (!tx || tx.meta?.err) continue;
    if (tx.blockTime != null && tx.blockTime < earliest) continue;

    const received = amountReceived(tx, c.merchant, c.mint);
    const viaReference = candidates.get(signatures[i]) && hasAccount(tx, c.reference);
    const ok = viaReference ? received >= expected : received === expected;
    if (!ok) continue;

    const payer = tx.transaction.message.accountKeys.find((k) => k.signer)?.pubkey.toBase58();
    const { order: after } = await markOrderPaid(order.id, { signature: signatures[i], payer });
    if (after?.status === "paid") return after;
  }

  if (order.expiresAt && now > order.expiresAt + cfg.graceMs) {
    return (
      (await updateOrder(order.id, (o) => {
        if (o.status === "pending") o.status = "expired";
      })) ?? order
    );
  }
  return order;
}
