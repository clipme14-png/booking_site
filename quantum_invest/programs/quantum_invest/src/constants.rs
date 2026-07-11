use anchor_lang::prelude::*;

// ── PDA seeds ───────────────────────────────────────────────────────────────
#[constant]
pub const USER_SEED: &[u8] = b"user";

#[constant]
pub const VAULT_SEED: &[u8] = b"vault";

// ── Plan tier IDs ────────────────────────────────────────────────────────────
pub const PLAN_STARTER: u8 = 0;
pub const PLAN_READER: u8 = 1;
pub const PLAN_SCHOLAR: u8 = 2;
pub const PLAN_SAGE: u8 = 3;

// ── Subscription prices in lamports ─────────────────────────────────────────
// 1 SOL = 1_000_000_000 lamports
pub const PRICE_READER_LAMPORTS: u64 = 1_500_000_000;  // 1.5 SOL
pub const PRICE_SCHOLAR_LAMPORTS: u64 = 4_000_000_000; // 4.0 SOL
pub const PRICE_SAGE_LAMPORTS: u64 = 10_000_000_000;   // 10.0 SOL

// ── Subscription duration (Unix seconds) ─────────────────────────────────────
pub const SUBSCRIPTION_DURATION: i64 = 30 * 24 * 60 * 60; // 30 days
