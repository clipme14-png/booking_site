use anchor_lang::prelude::*;
use crate::{
    constants::USER_SEED,
    error::QuantumError,
    state::UserAccount,
};

/// Claims all pending SOL rewards to the user's wallet.
///
/// NOTE: In Phase 3 this will be gated by the reward oracle / program-owned
/// reward pool. For now it drains `claimable_lamports` from the UserAccount's
/// lamport balance (funded externally by the admin in tests).
pub fn handle_claim_reward(ctx: Context<ClaimReward>) -> Result<()> {
    let user = &mut ctx.accounts.user_account;

    require!(user.claimable_lamports > 0, QuantumError::NoRewardsToClaim);

    let amount = user.claimable_lamports;

    // ── Transfer lamports out of the PDA to the wallet ───────────────────────
    // Uses raw lamport manipulation (safe for PDAs owned by this program).
    **user.to_account_info().try_borrow_mut_lamports()? -= amount;
    **ctx.accounts.wallet.to_account_info().try_borrow_mut_lamports()? += amount;

    // ── Update state ─────────────────────────────────────────────────────────
    let clock = Clock::get()?;
    user.total_earned_lamports = user
        .total_earned_lamports
        .checked_add(amount)
        .ok_or(QuantumError::Overflow)?;
    user.claimable_lamports = 0;
    user.last_claimed_at = clock.unix_timestamp;

    msg!(
        "Claimed {} lamports ({} SOL) for wallet {}",
        amount,
        amount as f64 / 1_000_000_000.0,
        ctx.accounts.wallet.key()
    );
    Ok(())
}

#[derive(Accounts)]
pub struct ClaimReward<'info> {
    #[account(mut)]
    pub wallet: Signer<'info>,

    /// The user's profile — must be the owner.
    #[account(
        mut,
        seeds = [USER_SEED, wallet.key().as_ref()],
        bump = user_account.bump,
        has_one = wallet,
    )]
    pub user_account: Account<'info, UserAccount>,

    pub system_program: Program<'info, System>,
}
