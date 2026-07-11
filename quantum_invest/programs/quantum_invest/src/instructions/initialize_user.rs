use anchor_lang::prelude::*;
use crate::{constants::*, state::UserAccount};

/// Creates the `UserAccount` PDA for a wallet on first use.
/// Anyone can call this once per wallet — it's idempotent via `init`.
pub fn handle_initialize_user(ctx: Context<InitializeUser>) -> Result<()> {
    let user = &mut ctx.accounts.user_account;
    let clock = Clock::get()?;

    user.wallet = ctx.accounts.wallet.key();
    user.plan = PLAN_STARTER;
    user.board_level = 1;
    user.books_read = 0;
    user.streak = 0;
    user.total_earned_lamports = 0;
    user.claimable_lamports = 0;
    user.last_claimed_at = clock.unix_timestamp;
    user.last_read_at = 0;
    user.bump = ctx.bumps.user_account;

    msg!("UserAccount initialized for wallet: {}", user.wallet);
    Ok(())
}

#[derive(Accounts)]
pub struct InitializeUser<'info> {
    /// The user's wallet — pays for account rent.
    #[account(mut)]
    pub wallet: Signer<'info>,

    /// The `UserAccount` PDA.
    #[account(
        init,
        payer = wallet,
        space = 8 + UserAccount::INIT_SPACE,
        seeds = [USER_SEED, wallet.key().as_ref()],
        bump,
    )]
    pub user_account: Account<'info, UserAccount>,

    pub system_program: Program<'info, System>,
}
