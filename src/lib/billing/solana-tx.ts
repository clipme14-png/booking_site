/**
 * Solana helpers shared by the browser and the server. No secrets here.
 */
import {
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";

export const TOKEN_PROGRAM_ID = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
export const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey(
  "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL",
);

export function associatedTokenAddress(owner: PublicKey, mint: PublicKey) {
  return PublicKey.findProgramAddressSync(
    [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    ASSOCIATED_TOKEN_PROGRAM_ID,
  )[0];
}

function u64(value: bigint) {
  const buf = new Uint8Array(8);
  new DataView(buf.buffer).setBigUint64(0, value, true);
  return buf;
}

export type CryptoPaymentRequest = {
  recipient: string;
  amount: string; // smallest units
  decimals: number;
  mint: string | null; // null means native SOL
  reference: string;
};

/**
 * Build the transfer a connected wallet signs. The order's reference key is
 * attached as a read-only account so the server can find the transaction.
 */
export function buildPaymentTransaction(payer: PublicKey, req: CryptoPaymentRequest) {
  const recipient = new PublicKey(req.recipient);
  const reference = new PublicKey(req.reference);
  const amount = BigInt(req.amount);
  const tx = new Transaction();
  const refKey = { pubkey: reference, isSigner: false, isWritable: false };

  if (!req.mint) {
    const ix = SystemProgram.transfer({
      fromPubkey: payer,
      toPubkey: recipient,
      lamports: amount,
    });
    ix.keys.push(refKey);
    tx.add(ix);
    return tx;
  }

  const mint = new PublicKey(req.mint);
  const source = associatedTokenAddress(payer, mint);
  const destination = associatedTokenAddress(recipient, mint);

  // Create the merchant's token account if it doesn't exist yet (no-op otherwise).
  tx.add(
    new TransactionInstruction({
      programId: ASSOCIATED_TOKEN_PROGRAM_ID,
      keys: [
        { pubkey: payer, isSigner: true, isWritable: true },
        { pubkey: destination, isSigner: false, isWritable: true },
        { pubkey: recipient, isSigner: false, isWritable: false },
        { pubkey: mint, isSigner: false, isWritable: false },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      ],
      data: Buffer.from([1]), // CreateIdempotent
    }),
  );

  const data = new Uint8Array(10);
  data[0] = 12; // TransferChecked
  data.set(u64(amount), 1);
  data[9] = req.decimals;
  tx.add(
    new TransactionInstruction({
      programId: TOKEN_PROGRAM_ID,
      keys: [
        { pubkey: source, isSigner: false, isWritable: true },
        { pubkey: mint, isSigner: false, isWritable: false },
        { pubkey: destination, isSigner: false, isWritable: true },
        { pubkey: payer, isSigner: true, isWritable: false },
        refKey,
      ],
      data: Buffer.from(data),
    }),
  );
  return tx;
}

/** Solana Pay transfer-request link, understood by Phantom, Solflare and others. */
export function solanaPayUrl(opts: {
  recipient: string;
  amountDecimal: string;
  mint: string | null;
  reference: string;
  label: string;
  message: string;
}) {
  const params = new URLSearchParams();
  params.set("amount", opts.amountDecimal);
  if (opts.mint) params.set("spl-token", opts.mint);
  params.set("reference", opts.reference);
  params.set("label", opts.label);
  params.set("message", opts.message);
  return `solana:${opts.recipient}?${params.toString().replace(/\+/g, "%20")}`;
}
