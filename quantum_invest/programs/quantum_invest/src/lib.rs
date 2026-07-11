pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("77AAyYrg2o34w4xS3wAtsLHaWnKWLUdFPbaruKzefBuG");

#[program]
pub mod quantum_invest {
    use super::*;

    /// Create a `UserAccount` PDA for a wallet. Call once on first sign-in.
    pub fn initialize_user(ctx: Context<InitializeUser>) -> Result<()> {
        instructions::initialize_user::handle_initialize_user(ctx)
    }

    /// Subscribe to a paid plan (Reader / Scholar / Sage).
    /// Transfers exact SOL to the `SubscriptionVault` PDA.
    pub fn subscribe(ctx: Context<Subscribe>, plan: u8) -> Result<()> {
        instructions::subscribe::handle_subscribe(ctx, plan)
    }

    /// Claim all pending SOL rewards to the user's wallet.
    pub fn claim_reward(ctx: Context<ClaimReward>) -> Result<()> {
        instructions::claim_reward::handle_claim_reward(ctx)
    }
}
