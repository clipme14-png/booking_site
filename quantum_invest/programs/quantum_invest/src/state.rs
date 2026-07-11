use anchor_lang::prelude::*;

/// On-chain profile for each Quantum Invest user.
/// PDA seeds: [b"user", wallet_pubkey]
#[account]
#[derive(InitSpace)]
pub struct UserAccount {
    /// The wallet that owns this account.
    pub wallet: Pubkey,

    /// Current subscription plan: 0=Starter, 1=Reader, 2=Scholar, 3=Sage.
    pub plan: u8,

    /// Current board level (1–6).
    pub board_level: u8,

    /// Total books completed on-chain.
    pub books_read: u32,

    /// Consecutive-day reading streak.
    pub streak: u32,

    /// Total SOL rewards earned (lamports), lifetime.
    pub total_earned_lamports: u64,

    /// Unclaimed rewards available to withdraw (lamports).
    pub claimable_lamports: u64,

    /// Unix timestamp of the last reward claim.
    pub last_claimed_at: i64,

    /// Unix timestamp of the last book completion.
    pub last_read_at: i64,

    /// PDA bump.
    pub bump: u8,
}

/// Subscription vault — holds the SOL paid for a plan.
/// PDA seeds: [b"vault", wallet_pubkey]
#[account]
#[derive(InitSpace)]
pub struct SubscriptionVault {
    /// Wallet that owns this vault.
    pub owner: Pubkey,

    /// Active plan tier.
    pub plan: u8,

    /// Unix timestamp when the subscription was created / last renewed.
    pub subscribed_at: i64,

    /// Unix timestamp when the subscription expires.
    pub expires_at: i64,

    /// SOL deposited for this subscription period (lamports).
    pub amount_lamports: u64,

    /// PDA bump.
    pub bump: u8,
}
