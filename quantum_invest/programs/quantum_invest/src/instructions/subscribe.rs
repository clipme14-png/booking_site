use anchor_lang::prelude::*;
use anchor_lang::system_program;
use crate::{
    constants::*,
    error::QuantumError,
    state::{UserAccount, SubscriptionVault},
};

/// Subscribes a user to a paid plan.
/// Transfers the exact SOL amount to the vault PDA and records the subscription.
/// The Starter plan (0) is free and does not call this instruction.
pub fn handle_subscribe(ctx: Context<Subscribe>, plan: u8) -> Result<()> {
    // ── Validate plan ────────────────────────────────────────────────────────
    let price = match plan {
        PLAN_READER  => PRICE_READER_LAMPORTS,
        PLAN_SCHOLAR => PRICE_SCHOLAR_LAMPORTS,
        PLAN_SAGE    => PRICE_SAGE_LAMPORTS,
        _            => return err!(QuantumError::InvalidPlan),
    };

    let clock = Clock::get()?;

    // ── Check for active subscription on same or higher plan ─────────────────
    let vault = &mut ctx.accounts.subscription_vault;
    if vault.expires_at > clock.unix_timestamp && vault.plan >= plan {
        return err!(QuantumError::SubscriptionStillActive);
    }

    // ── Transfer SOL: wallet → vault PDA ────────────────────────────────────
    let cpi_ctx = CpiContext::new(
        ctx.accounts.system_program.to_account_info(),
        system_program::Transfer {
            from: ctx.accounts.wallet.to_account_info(),
            to:   ctx.accounts.subscription_vault.to_account_info(),
        },
    );
    system_program::transfer(cpi_ctx, price)?;

    // ── Update vault state ───────────────────────────────────────────────────
    vault.owner           = ctx.accounts.wallet.key();
    vault.plan            = plan;
    vault.subscribed_at   = clock.unix_timestamp;
    vault.expires_at      = clock.unix_timestamp
        .checked_add(SUBSCRIPTION_DURATION)
        .ok_or(QuantumError::Overflow)?;
    vault.amount_lamports = price;
    vault.bump            = ctx.bumps.subscription_vault;

    // ── Update user plan on UserAccount ─────────────────────────────────────
    let user = &mut ctx.accounts.user_account;
    user.plan = plan;

    msg!(
        "Subscribed wallet {} to plan {} until {}",
        ctx.accounts.wallet.key(),
        plan,
        vault.expires_at
    );
    Ok(())
}

#[derive(Accounts)]
pub struct Subscribe<'info> {
    #[account(mut)]
    pub wallet: Signer<'info>,

    /// The user's profile — must already be initialized.
    #[account(
        mut,
        seeds = [USER_SEED, wallet.key().as_ref()],
        bump = user_account.bump,
    )]
    pub user_account: Account<'info, UserAccount>,

    /// The subscription vault PDA (created on first subscription).
    #[account(
        init_if_needed,
        payer = wallet,
        space = 8 + SubscriptionVault::INIT_SPACE,
        seeds = [VAULT_SEED, wallet.key().as_ref()],
        bump,
    )]
    pub subscription_vault: Account<'info, SubscriptionVault>,

    pub system_program: Program<'info, System>,
}
